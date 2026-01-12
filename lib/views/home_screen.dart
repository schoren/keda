import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/data_providers.dart';
import '../providers/auth_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(categoriesProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Presupuestos'),
        actions: [
          ref.watch(expensesProvider).when(
            data: (expenses) => Center(child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text('Gastos: ${expenses.length}', style: const TextStyle(fontSize: 12)),
            )),
            loading: () => const SizedBox(),
            error: (_, __) => const SizedBox(),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(authProvider.notifier).logout(),
          ),
        ],
      ),
      body: categoriesAsync.when(
        data: (categories) => LayoutBuilder(
          builder: (context, constraints) {
            int crossAxisCount = 2;
            if (constraints.maxWidth > 600) {
              crossAxisCount = 3;
            }
            if (constraints.maxWidth > 1200) {
              crossAxisCount = 6;
            }

            return GridView.builder(
              padding: const EdgeInsets.all(12),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: crossAxisCount,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
                childAspectRatio: 1.2,
              ),
              itemCount: categories.length,
              itemBuilder: (context, index) {
            final category = categories[index];
            final remaining = ref.watch(categoryRemainingProvider(category.id));
            final progress = remaining > 0 ? (remaining / category.monthlyBudget) : 0.0;
            
            return Card(
              elevation: 2,
              margin: EdgeInsets.zero,
              child: Stack(
                children: [
                  InkWell(
                    onTap: () => context.push('/new-expense/${category.id}'),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(right: 24.0), // Space for the menu icon
                            child: Text(
                              category.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            '\$${remaining.toStringAsFixed(0)}',
                            style: TextStyle(
                              fontSize: 15,
                              color: remaining < 0 ? Colors.red : Colors.green,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 6),
                          LinearProgressIndicator(
                            value: progress,
                            backgroundColor: Colors.grey[200],
                            minHeight: 6,
                            borderRadius: BorderRadius.circular(3),
                            valueColor: AlwaysStoppedAnimation<Color>(
                              remaining < 0 ? Colors.red : Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    top: -4,
                    right: -4,
                    child: PopupMenuButton<String>(
                      icon: const Icon(Icons.more_vert, size: 18, color: Colors.grey),
                      padding: EdgeInsets.zero,
                      onSelected: (value) {
                        if (value == 'details') {
                          context.push('/category/${category.id}');
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'details',
                          height: 32,
                          child: Text('Ver Detalle', style: TextStyle(fontSize: 14)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
            );
          },
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Default to first category if none selected? 
          // Or just let user pick from Home.
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
