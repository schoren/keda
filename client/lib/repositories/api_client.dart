import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/category.dart';
import '../models/finance_account.dart';
import '../models/expense.dart';
import '../models/monthly_summary.dart';

class SyncResponse {
  final List<Category> categories;
  final List<FinanceAccount> accounts;
  final List<Expense> transactions;

  SyncResponse({
    required this.categories,
    required this.accounts,
    required this.transactions,
  });

  factory SyncResponse.fromJson(Map<String, dynamic> json) {
    return SyncResponse(
      categories: (json['categories'] as List)
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList(),
      accounts: (json['accounts'] as List)
          .map((e) => FinanceAccount.fromJson(e as Map<String, dynamic>))
          .toList(),
      transactions: (json['transactions'] as List)
          .map((e) => Expense.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class ApiClient {
  final String baseUrl;
  final http.Client _client;

  ApiClient({
    required this.baseUrl,
    http.Client? client,
  }) : _client = client ?? http.Client();

  // ============================================================================
  // CATEGORIES
  // ============================================================================

  Future<List<Category>> getCategories() async {
    final uri = Uri.parse('$baseUrl/categories');
    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> json = jsonDecode(response.body);
      return json.map((e) => Category.fromJson(e as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to fetch categories: ${response.statusCode}');
    }
  }

  Future<Category> createCategory(Category category) async {
    final uri = Uri.parse('$baseUrl/categories');
    final response = await _client.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(category.toJson()),
    );

    if (response.statusCode == 201) {
      return Category.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to create category: ${response.statusCode}');
    }
  }

  Future<Category> updateCategory(String id, Category category) async {
    final uri = Uri.parse('$baseUrl/categories/$id');
    final response = await _client.put(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(category.toJson()),
    );

    if (response.statusCode == 200) {
      return Category.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to update category: ${response.statusCode}');
    }
  }

  Future<void> deleteCategory(String id) async {
    final uri = Uri.parse('$baseUrl/categories/$id');
    final response = await _client.delete(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to delete category: ${response.statusCode}');
    }
  }

  // ============================================================================
  // ACCOUNTS
  // ============================================================================

  Future<List<FinanceAccount>> getAccounts() async {
    final uri = Uri.parse('$baseUrl/accounts');
    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> json = jsonDecode(response.body);
      return json.map((e) => FinanceAccount.fromJson(e as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to fetch accounts: ${response.statusCode}');
    }
  }

  Future<FinanceAccount> createAccount(FinanceAccount account) async {
    final uri = Uri.parse('$baseUrl/accounts');
    final response = await _client.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(account.toJson()),
    );

    if (response.statusCode == 201) {
      return FinanceAccount.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to create account: ${response.statusCode}');
    }
  }

  Future<FinanceAccount> updateAccount(String id, FinanceAccount account) async {
    final uri = Uri.parse('$baseUrl/accounts/$id');
    final response = await _client.put(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(account.toJson()),
    );

    if (response.statusCode == 200) {
      return FinanceAccount.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to update account: ${response.statusCode}');
    }
  }

  Future<void> deleteAccount(String id) async {
    final uri = Uri.parse('$baseUrl/accounts/$id');
    final response = await _client.delete(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to delete account: ${response.statusCode}');
    }
  }

  // ============================================================================
  // TRANSACTIONS (EXPENSES)
  // ============================================================================

  Future<List<Expense>> getTransactions({String? month}) async {
    final uri = Uri.parse('$baseUrl/transactions').replace(
      queryParameters: month != null ? {'month': month} : null,
    );
    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> json = jsonDecode(response.body);
      return json.map((e) => Expense.fromJson(e as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to fetch transactions: ${response.statusCode}');
    }
  }

  Future<Expense> createTransaction(Expense expense) async {
    final uri = Uri.parse('$baseUrl/transactions');
    final response = await _client.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(expense.toJson()),
    );

    if (response.statusCode == 201) {
      return Expense.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to create transaction: ${response.statusCode}');
    }
  }

  Future<Expense> updateTransaction(String id, Expense expense) async {
    final uri = Uri.parse('$baseUrl/transactions/$id');
    final response = await _client.put(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(expense.toJson()),
    );

    if (response.statusCode == 200) {
      return Expense.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to update transaction: ${response.statusCode}');
    }
  }

  Future<void> deleteTransaction(String id) async {
    final uri = Uri.parse('$baseUrl/transactions/$id');
    final response = await _client.delete(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to delete transaction: ${response.statusCode}');
    }
  }

  // ============================================================================
  // MONTHLY SUMMARY
  // ============================================================================

  Future<MonthlySummary> getMonthlySummary(String month) async {
    final uri = Uri.parse('$baseUrl/summary/$month');
    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      return MonthlySummary.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
      throw Exception('Failed to fetch monthly summary: ${response.statusCode}');
    }
  }

  // ============================================================================
  // LEGACY SYNC
  // ============================================================================

  Future<SyncResponse> sync({String? month}) async {
    final uri = Uri.parse('$baseUrl/sync').replace(
      queryParameters: month != null ? {'month': month} : null,
    );

    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      return SyncResponse.fromJson(json);
    } else {
      throw Exception('Failed to sync: ${response.statusCode} ${response.body}');
    }
  }

  void dispose() {
    _client.close();
  }
}

