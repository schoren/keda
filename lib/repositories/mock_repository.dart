import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/category.dart';
import '../models/finance_account.dart';
import '../models/expense.dart';

class MockRepository {
  Future<List<Category>> getCategories() async {
    final String response = await rootBundle.loadString('assets/data/categories.json');
    final List<dynamic> data = json.decode(response);
    return data.map((json) => Category.fromJson(json)).toList();
  }

  Future<List<FinanceAccount>> getAccounts() async {
    final String response = await rootBundle.loadString('assets/data/accounts.json');
    final List<dynamic> data = json.decode(response);
    return data.map((json) => FinanceAccount.fromJson(json)).toList();
  }

  Future<List<Expense>> getExpenses() async {
    final String response = await rootBundle.loadString('assets/data/expenses.json');
    final List<dynamic> data = json.decode(response);
    return data.map((json) => Expense.fromJson(json)).toList();
  }
}
