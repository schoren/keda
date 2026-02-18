import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/data_providers.dart';
import 'package:keda/l10n/app_localizations.dart';

class MonthNavigationSelector extends ConsumerWidget {
  const MonthNavigationSelector({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMonth = ref.watch(selectedMonthProvider);
    final isCurrentMonth = ref.watch(isCurrentMonthProvider);
    final l10n = AppLocalizations.of(context)!;
    
    final monthName = DateFormat.yMMMM(Localizations.localeOf(context).toString()).format(selectedMonth);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left, color: Color(0xFF64748B)),
            onPressed: () {
              final newDate = DateTime(selectedMonth.year, selectedMonth.month - 1);
              ref.read(selectedMonthProvider.notifier).setMonth(newDate);
            },
            tooltip: l10n.prevMonth,
          ),
          Container(
            constraints: const BoxConstraints(minWidth: 140),
            child: Text(
              monthName.toUpperCase(),
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: const Color(0xFF1E293B),
                fontWeight: FontWeight.w700,
                fontSize: 13,
                letterSpacing: 1.2,
              ),
            ),
          ),
          IconButton(
            icon: Icon(
              Icons.chevron_right, 
              color: isCurrentMonth ? const Color(0xFFCBD5E1) : const Color(0xFF64748B),
            ),
            onPressed: isCurrentMonth ? null : () {
              final newDate = DateTime(selectedMonth.year, selectedMonth.month + 1);
              ref.read(selectedMonthProvider.notifier).setMonth(newDate);
            },
            tooltip: l10n.nextMonth,
          ),
        ],
      ),
    );
  }
}
