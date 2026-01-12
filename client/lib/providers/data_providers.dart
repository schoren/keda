import 'package:flutter/foundation.dart' hide Category;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/category.dart';
import '../models/finance_account.dart';
import '../models/expense.dart';
import '../models/monthly_summary.dart';
import '../repositories/database.dart';
import '../repositories/local_repository.dart';
import '../repositories/api_client.dart';
import '../providers/auth_provider.dart';

// ============================================================================
// DATABASE & REPOSITORY
// ============================================================================

final databaseProvider = Provider((ref) => AppDatabase());

final repositoryProvider = Provider((ref) {
  final db = ref.watch(databaseProvider);
  return LocalRepository(db);
});

final apiClientProvider = Provider((ref) {
  final authState = ref.watch(authProvider);
  // TODO: Replace with actual server URL from environment or config
  return ApiClient(
    baseUrl: 'http://localhost:8090',
    householdId: authState.householdId,
  );
});

// ============================================================================
// CATEGORIES
// ============================================================================

class CategoriesNotifier extends AsyncNotifier<List<Category>> {
  @override
  Future<List<Category>> build() async {
    final apiClient = ref.watch(apiClientProvider);
    final repo = ref.watch(repositoryProvider);

    try {
      // Try to load from cache first for fast startup
      final cached = await repo.getCategories();
      if (cached.isNotEmpty) {
        // Return cached data immediately
        state = AsyncData(cached);
        
        // Fetch from server in background and update
        _fetchFromServer();
        
        return cached;
      }
    } catch (e) {
      if (kDebugMode) print('Failed to load from cache: $e');
    }

    // No cache, fetch from server
    return _fetchFromServer();
  }

  Future<List<Category>> _fetchFromServer() async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      final categories = await apiClient.getCategories();
      
      // Update cache
      for (var category in categories) {
        await repo.upsertCategory(category);
      }
      
      return categories;
    } catch (e) {
      if (kDebugMode) print('Failed to fetch categories from server: $e');
      rethrow;
    }
  }

  Future<void> createCategory(Category category) async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      final created = await apiClient.createCategory(category);
      await repo.upsertCategory(created);
      
      final current = await future;
      state = AsyncData([...current, created]);
    } catch (e) {
      if (kDebugMode) print('Failed to create category: $e');
      rethrow;
    }
  }

  Future<void> updateCategory(Category category) async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      final updated = await apiClient.updateCategory(category.id, category);
      await repo.upsertCategory(updated);
      
      final current = await future;
      state = AsyncData(
        current.map((c) => c.id == updated.id ? updated : c).toList(),
      );
    } catch (e) {
      if (kDebugMode) print('Failed to update category: $e');
      rethrow;
    }
  }

  Future<void> deleteCategory(String id) async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      await apiClient.deleteCategory(id);
      await repo.deleteCategory(id);
      
      final current = await future;
      state = AsyncData(current.where((c) => c.id != id).toList());
    } catch (e) {
      if (kDebugMode) print('Failed to delete category: $e');
      rethrow;
    }
  }
}

final categoriesProvider = AsyncNotifierProvider<CategoriesNotifier, List<Category>>(() {
  return CategoriesNotifier();
});

// ============================================================================
// ACCOUNTS
// ============================================================================

class AccountsNotifier extends AsyncNotifier<List<FinanceAccount>> {
  @override
  Future<List<FinanceAccount>> build() async {
    final apiClient = ref.watch(apiClientProvider);
    final repo = ref.watch(repositoryProvider);

    try {
      // Try to load from cache first for fast startup
      final cached = await repo.getAccounts();
      if (cached.isNotEmpty) {
        state = AsyncData(cached);
        _fetchFromServer();
        return cached;
      }
    } catch (e) {
      if (kDebugMode) print('Failed to load from cache: $e');
    }

    return _fetchFromServer();
  }

  Future<List<FinanceAccount>> _fetchFromServer() async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      final accounts = await apiClient.getAccounts();
      
      for (var account in accounts) {
        await repo.upsertAccount(account);
      }
      
      return accounts;
    } catch (e) {
      if (kDebugMode) print('Failed to fetch accounts from server: $e');
      rethrow;
    }
  }

  Future<void> createAccount(FinanceAccount account) async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      final created = await apiClient.createAccount(account);
      await repo.upsertAccount(created);
      
      final current = await future;
      state = AsyncData([...current, created]);
    } catch (e) {
      if (kDebugMode) print('Failed to create account: $e');
      rethrow;
    }
  }
}

final accountsProvider = AsyncNotifierProvider<AccountsNotifier, List<FinanceAccount>>(() {
  return AccountsNotifier();
});

// ============================================================================
// EXPENSES (TRANSACTIONS)
// ============================================================================

class ExpensesNotifier extends AsyncNotifier<List<Expense>> {
  @override
  Future<List<Expense>> build() async {
    final apiClient = ref.watch(apiClientProvider);
    final repo = ref.watch(repositoryProvider);

    try {
      // Try to load from cache first for fast startup
      final cached = await repo.getExpenses();
      if (cached.isNotEmpty) {
        state = AsyncData(cached);
        _fetchFromServer();
        return cached;
      }
    } catch (e) {
      if (kDebugMode) print('Failed to load from cache: $e');
    }

    return _fetchFromServer();
  }

  Future<List<Expense>> _fetchFromServer() async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      // Get current month
      final now = DateTime.now();
      final month = '${now.year}-${now.month.toString().padLeft(2, '0')}';
      
      final expenses = await apiClient.getTransactions(month: month);
      
      // Note: We're only caching current month's expenses
      // This keeps the cache small and relevant
      await repo.syncFromServer(
        categories: [],
        accounts: [],
        expenses: expenses,
      );
      
      return expenses;
    } catch (e) {
      if (kDebugMode) print('Failed to fetch expenses from server: $e');
      rethrow;
    }
  }

  Future<void> addExpense(Expense expense) async {
    final apiClient = ref.read(apiClientProvider);
    final repo = ref.read(repositoryProvider);

    try {
      if (kDebugMode) print('Adding expense: ${expense.amount}');
      
      final created = await apiClient.createTransaction(expense);
      await repo.addExpense(created);
      
      final current = await future;
      state = AsyncData([...current, created]);
      
      if (kDebugMode) print('Expense added. New count: ${state.value?.length}');
    } catch (e) {
      if (kDebugMode) print('Failed to add expense: $e');
      rethrow;
    }
  }

  Future<void> updateExpense(Expense expense) async {
    final apiClient = ref.read(apiClientProvider);

    try {
      final updated = await apiClient.updateTransaction(expense.id, expense);
      
      final current = await future;
      state = AsyncData(
        current.map((e) => e.id == updated.id ? updated : e).toList(),
      );
    } catch (e) {
      if (kDebugMode) print('Failed to update expense: $e');
      rethrow;
    }
  }

  Future<void> deleteExpense(String id) async {
    final apiClient = ref.read(apiClientProvider);

    try {
      await apiClient.deleteTransaction(id);
      
      final current = await future;
      state = AsyncData(current.where((e) => e.id != id).toList());
    } catch (e) {
      if (kDebugMode) print('Failed to delete expense: $e');
      rethrow;
    }
  }
}

final expensesProvider = AsyncNotifierProvider<ExpensesNotifier, List<Expense>>(() {
  return ExpensesNotifier();
});

// ============================================================================
// MONTHLY SUMMARY (from server)
// ============================================================================

final monthlySummaryProvider = FutureProvider.family<MonthlySummary, String>((ref, month) async {
  final apiClient = ref.watch(apiClientProvider);
  
  try {
    return await apiClient.getMonthlySummary(month);
  } catch (e) {
    if (kDebugMode) print('Failed to fetch monthly summary: $e');
    rethrow;
  }
});

// Convenience provider for current month summary
final currentMonthSummaryProvider = FutureProvider<MonthlySummary>((ref) async {
  final now = DateTime.now();
  final month = '${now.year}-${now.month.toString().padLeft(2, '0')}';
  return ref.watch(monthlySummaryProvider(month).future);
});

// ============================================================================
// LEGACY PROVIDERS (for backwards compatibility)
// ============================================================================

// Provider for remaining budget per category (calculated client-side from summary)
final categoryRemainingProvider = Provider.family<double, String>((ref, categoryId) {
  final summaryAsync = ref.watch(currentMonthSummaryProvider);
  
  return summaryAsync.when(
    data: (summary) {
      final categorySummary = summary.categories.firstWhere(
        (c) => c.id == categoryId,
        orElse: () => CategorySummary(id: '', name: '', budget: 0, spent: 0, remaining: 0),
      );
      return categorySummary.remaining;
    },
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});

// Provider for monthly totals (from server summary)
final monthlyTotalsProvider = Provider.autoDispose<(double budget, double spent)>((ref) {
  final summaryAsync = ref.watch(currentMonthSummaryProvider);

  return summaryAsync.when(
    data: (summary) => (summary.totalBudget, summary.totalSpent),
    loading: () => (0.0, 0.0),
    error: (_, __) => (0.0, 0.0),
  );
});
