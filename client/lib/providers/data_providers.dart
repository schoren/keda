import 'package:flutter/foundation.dart' hide Category;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/category.dart';
import '../models/finance_account.dart';
import '../models/expense.dart';
import '../repositories/database.dart';
import '../repositories/local_repository.dart';
import '../repositories/mock_repository.dart';

final databaseProvider = Provider((ref) => AppDatabase());

final repositoryProvider = Provider((ref) {
  final db = ref.watch(databaseProvider);
  return LocalRepository(db);
});

final categoriesProvider = FutureProvider<List<Category>>((ref) async {
  final repo = ref.watch(repositoryProvider);
  final categories = await repo.getCategories();
  
  if (categories.isEmpty) {
    if (kDebugMode) print('Seeding categories...');
    final mockRepo = MockRepository();
    final initialCategories = await mockRepo.getCategories();
    for (var cat in initialCategories) {
      await repo.upsertCategory(cat);
    }
    return initialCategories;
  }
  
  return categories;
});

final accountsProvider = FutureProvider<List<FinanceAccount>>((ref) async {
  final repo = ref.watch(repositoryProvider);
  final accounts = await repo.getAccounts();
  
  if (accounts.isEmpty) {
    if (kDebugMode) print('Seeding accounts...');
    final mockRepo = MockRepository();
    final initialAccounts = await mockRepo.getAccounts();
    for (var acc in initialAccounts) {
      await repo.upsertAccount(acc);
    }
    return initialAccounts;
  }
  
  return accounts;
});

class ExpensesNotifier extends AsyncNotifier<List<Expense>> {
  @override
  Future<List<Expense>> build() async {
    final repo = ref.watch(repositoryProvider);
    final initialExpenses = await repo.getExpenses();
    
    if (initialExpenses.isEmpty) {
      if (kDebugMode) print('Seeding expenses...');
      final mockRepo = MockRepository();
      final mockExpenses = await mockRepo.getExpenses();
      for (var exp in mockExpenses) {
        await repo.addExpense(exp);
      }
      return mockExpenses;
    }
    
    return initialExpenses;
  }

  Future<void> addExpense(Expense expense) async {
    if (kDebugMode) print('Adding expense: ${expense.amount}');
    final repo = ref.read(repositoryProvider);
    await repo.addExpense(expense);
    
    final previousState = await future;
    state = AsyncData([...previousState, expense]);
    if (kDebugMode) print('Expense added to state. New count: ${state.value?.length}');
  }
}

final expensesProvider = AsyncNotifierProvider<ExpensesNotifier, List<Expense>>(() {
  return ExpensesNotifier();
});

// Provider for remaining budget per category
final categoryRemainingProvider = Provider.family<double, String>((ref, categoryId) {
  final categoriesAsync = ref.watch(categoriesProvider);
  final expensesAsync = ref.watch(expensesProvider);
  
  return categoriesAsync.when(
    data: (categories) {
      return expensesAsync.when(
        data: (expenses) {
          final category = categories.firstWhere((c) => c.id == categoryId);
          final now = DateTime.now();
          
          final totalSpent = expenses
              .where((e) => e.categoryId == categoryId && e.date.month == now.month && e.date.year == now.year)
              .fold(0.0, (sum, e) => sum + e.amount);
              
          return category.monthlyBudget - totalSpent;
        },
        loading: () => 0.0,
        error: (_, __) => 0.0,
      );
    },
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});

// Provider for monthly totals (budget and spent)
final monthlyTotalsProvider = Provider.autoDispose<(double budget, double spent)>((ref) {
  final categoriesAsync = ref.watch(categoriesProvider);
  final expensesAsync = ref.watch(expensesProvider);

  return categoriesAsync.when(
    data: (categories) {
      return expensesAsync.when(
        data: (expenses) {
          final now = DateTime.now();
          
          final totalBudget = categories.fold(0.0, (sum, c) => sum + c.monthlyBudget);
          
          final totalSpent = expenses
              .where((e) => e.date.month == now.month && e.date.year == now.year)
              .fold(0.0, (sum, e) => sum + e.amount);

          return (totalBudget, totalSpent);
        },
        loading: () => (0.0, 0.0),
        error: (_, __) => (0.0, 0.0),
      );
    },
    loading: () => (0.0, 0.0),
    error: (_, __) => (0.0, 0.0),
  );
});
