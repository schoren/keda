import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MonthSummaryCard extends StatelessWidget {
  final double totalBudget;
  final double totalSpent;

  const MonthSummaryCard({
    super.key,
    required this.totalBudget,
    required this.totalSpent,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final monthName = DateFormat('MMMM yyyy', 'es_ES').format(now);
    // Capitalize first letter
    final formattedMonth = monthName[0].toUpperCase() + monthName.substring(1);

    final progress = totalBudget > 0 ? (totalSpent / totalBudget) : 0.0;
    final remaining = totalBudget - totalSpent;
    final isOverBudget = remaining < 0;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              formattedMonth,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoColumn(
                  context,
                  'Presupuesto',
                  totalBudget,
                  Colors.green,
                ),
                _buildInfoColumn(
                  context,
                  'Gastado',
                  totalSpent,
                  Colors.red,
                ),
              ],
            ),
            const SizedBox(height: 16),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: (remaining / totalBudget).clamp(0.0, 1.0),
                minHeight: 12,
                backgroundColor: Colors.red,
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isOverBudget
                  ? 'Excedido por \$${(-remaining).toStringAsFixed(0)}'
                  : 'Quedan \$${remaining.toStringAsFixed(0)}',
              style: TextStyle(
                color: isOverBudget ? Colors.red : Colors.green,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }



  Widget _buildInfoColumn(
    BuildContext context,
    String label,
    double amount,
    Color amountColor,
  ) {
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '\$${amount.toStringAsFixed(0)}',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: amountColor,
          ),
        ),
      ],
    );
  }
}
