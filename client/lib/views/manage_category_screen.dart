import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import '../providers/data_providers.dart';
import '../models/category.dart';

class ManageCategoryScreen extends ConsumerStatefulWidget {
  final String? categoryId;

  const ManageCategoryScreen({super.key, this.categoryId});

  @override
  ConsumerState<ManageCategoryScreen> createState() => _ManageCategoryScreenState();
}

class _ManageCategoryScreenState extends ConsumerState<ManageCategoryScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _budgetController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.categoryId != null) {
      // Defer state update to next frame to allow reading provider
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadCategory();
      });
    }
  }

  void _loadCategory() {
    final categories = ref.read(categoriesProvider).asData?.value;
    if (categories != null) {
      final category = categories.firstWhere(
        (c) => c.id == widget.categoryId,
        orElse: () => Category(id: '', name: '', monthlyBudget: 0),
      );
      
      if (category.id.isNotEmpty) {
        _nameController.text = category.name;
        _budgetController.text = category.monthlyBudget.toStringAsFixed(0);
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _budgetController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final repository = ref.read(repositoryProvider);
      
      final id = widget.categoryId ?? const Uuid().v4();
      final name = _nameController.text.trim();
      final budget = double.parse(_budgetController.text);

      final category = Category(
        id: id,
        name: name,
        monthlyBudget: budget,
        isActive: true,
      );

      await repository.upsertCategory(category);
      
      // Refresh the list of categories
      ref.invalidate(categoriesProvider);
      // Also refresh remaining provider if editing
      if (widget.categoryId != null) {
        ref.invalidate(categoryRemainingProvider(widget.categoryId!));
      }

      if (mounted) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Categoría guardada exitosamente')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al guardar: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.categoryId != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Editar Categoría' : 'Nueva Categoría'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Por favor ingresa un nombre';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _budgetController,
                decoration: const InputDecoration(
                  labelText: 'Presupuesto Mensual',
                  prefixText: '\$ ',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa un presupuesto';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Ingresa un número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _save,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _isLoading 
                    ? const SizedBox(
                        height: 20, 
                        width: 20, 
                        child: CircularProgressIndicator(strokeWidth: 2)
                      )
                    : const Text('GUARDAR', style: TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
