import 'package:drift/drift.dart';
import 'database.dart';
import '../models/category.dart';
import '../models/finance_account.dart';
import '../models/expense.dart';
import '../models/account_type.dart';

class LocalRepository {
  final AppDatabase db;

  LocalRepository(this.db);

  // Categories
  Future<List<Category>> getCategories() async {
    final entities = await db.select(db.categories).get();
    return entities.map((e) => Category(
      id: e.id,
      name: e.name,
      monthlyBudget: e.monthlyBudget,
      isActive: e.isActive,
    )).toList();
  }

  Future<void> upsertCategory(Category category) async {
    await db.into(db.categories).insertOnConflictUpdate(
      CategoriesCompanion.insert(
        id: category.id,
        name: category.name,
        monthlyBudget: category.monthlyBudget,
        isActive: Value(category.isActive),
      ),
    );
  }

  Future<void> deleteCategory(String id) async {
    await (db.delete(db.categories)..where((tbl) => tbl.id.equals(id))).go();
  }

  // Accounts
  Future<List<FinanceAccount>> getAccounts() async {
    final entities = await db.select(db.financeAccounts).get();
    return entities.map((e) => FinanceAccount(
      id: e.id,
      type: AccountType.values.firstWhere((t) => t.name == e.type),
      name: e.name,
      brand: e.brand,
      bank: e.bank,
    )).toList();
  }

  Future<void> upsertAccount(FinanceAccount account) async {
    await db.into(db.financeAccounts).insertOnConflictUpdate(
      FinanceAccountsCompanion.insert(
        id: account.id,
        type: account.type.name,
        name: account.name,
        brand: Value(account.brand),
        bank: Value(account.bank),
      ),
    );
  }

  // Expenses
  Future<List<Expense>> getExpenses() async {
    final entities = await db.select(db.expenses).get();
    return entities.map((e) => Expense(
      id: e.id,
      date: e.date,
      categoryId: e.categoryId,
      accountId: e.accountId,
      amount: e.amount,
      note: e.note,
    )).toList();
  }

  Future<void> addExpense(Expense expense) async {
    print('DB: Inserting expense ${expense.id} for amount ${expense.amount}');
    await db.into(db.expenses).insert(
      ExpensesCompanion.insert(
        id: expense.id,
        date: expense.date,
        categoryId: expense.categoryId,
        accountId: expense.accountId,
        amount: expense.amount,
        note: Value(expense.note),
      ),
    );
    print('DB: Expense inserted successfully');
  }

  // Sync from server
  Future<void> syncFromServer({
    required List<Category> categories,
    required List<FinanceAccount> accounts,
    required List<Expense> expenses,
  }) async {
    await db.transaction(() async {
      // Clear all tables
      await db.delete(db.expenses).go();
      await db.delete(db.categories).go();
      await db.delete(db.financeAccounts).go();

      // Insert categories
      for (var category in categories) {
        await db.into(db.categories).insert(
          CategoriesCompanion.insert(
            id: category.id,
            name: category.name,
            monthlyBudget: category.monthlyBudget,
            isActive: Value(category.isActive),
          ),
        );
      }

      // Insert accounts
      for (var account in accounts) {
        await db.into(db.financeAccounts).insert(
          FinanceAccountsCompanion.insert(
            id: account.id,
            type: account.type.name,
            name: account.name,
            brand: Value(account.brand),
            bank: Value(account.bank),
          ),
        );
      }

      // Insert expenses
      for (var expense in expenses) {
        await db.into(db.expenses).insert(
          ExpensesCompanion.insert(
            id: expense.id,
            date: expense.date,
            categoryId: expense.categoryId,
            accountId: expense.accountId,
            amount: expense.amount,
            note: Value(expense.note),
          ),
        );
      }
    });
  }
}
