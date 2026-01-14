import 'package:family_finance/models/expense.dart';
import 'package:family_finance/models/user.dart';
import 'package:family_finance/providers/data_providers.dart';
import 'package:family_finance/views/category_detail_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:family_finance/models/finance_account.dart';
import 'package:family_finance/models/category.dart';
import 'package:family_finance/models/account_type.dart';

class MockExpensesNotifier extends ExpensesNotifier {
  final List<Expense> data;
  MockExpensesNotifier(this.data);
  @override
  Future<List<Expense>> build() async => data;
}

class MockCategoriesNotifier extends CategoriesNotifier {
  final List<Category> data;
  MockCategoriesNotifier(this.data);
  @override
  Future<List<Category>> build() async => data;
}

class MockAccountsNotifier extends AccountsNotifier {
  final List<FinanceAccount> data;
  MockAccountsNotifier(this.data);
  @override
  Future<List<FinanceAccount>> build() async => data;
}

void main() {
  testWidgets('CategoryDetailScreen shows creator name', (tester) async {
    final now = DateTime.now();
    final categoryId = 'c1';
    final user = User(id: 'u1', name: 'Test User', email: 'test@example.com');
    final expenses = [
      Expense(
        id: 'e1',
        amount: 100.0,
        date: now,
        categoryId: categoryId,
        accountId: 'a1',
        note: 'Milk',
        user: user,
      ),
    ];
    final categories = [
      Category(id: categoryId, name: 'Food', monthlyBudget: 500),
    ];
    final accounts = [
      FinanceAccount(id: 'a1', name: 'Cash', type: AccountType.cash, displayName: 'Efectivo'),
    ];

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          expensesProvider.overrideWith(() => MockExpensesNotifier(expenses)),
          categoriesProvider.overrideWith(() => MockCategoriesNotifier(categories)),
          accountsProvider.overrideWith(() => MockAccountsNotifier(accounts)),
        ],
        child: MaterialApp(
          home: CategoryDetailScreen(categoryId: categoryId),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Milk'), findsOneWidget);
    expect(find.textContaining('Test User'), findsOneWidget);
    expect(find.textContaining('Creado por:'), findsOneWidget);
  });
}
