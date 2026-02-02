import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/recommendation_provider.dart';

class RecommendationDialog extends ConsumerWidget {
  const RecommendationDialog({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(recommendationProvider);

    return AlertDialog(
      title: const Text('Recomendaciones de Ajuste'),
      content: SizedBox(
        width: double.maxFinite,
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: state.recommendations.length,
          itemBuilder: (context, index) {
            final rec = state.recommendations[index];
            return CheckboxListTile(
              title: Text(rec.categoryName),
              subtitle: Text(
                '${rec.action == 'increase' ? 'Aumentar' : 'Disminuir'} a \$${rec.amount.toStringAsFixed(0)}',
                style: TextStyle(
                  color: rec.action == 'increase' ? Colors.red : Colors.green,
                  fontWeight: FontWeight.bold,
                ),
              ),
              value: rec.isSelected,
              onChanged: (_) {
                ref.read(recommendationProvider.notifier).toggleSelection(index);
              },
            );
          },
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {
            ref.read(recommendationProvider.notifier).applyRecommendations();
            Navigator.of(context).pop();
          },
          child: const Text('Aplicar Seleccionados'),
        ),
      ],
    );
  }
}
