import 'dart:convert';
import 'package:http/http.dart' as http;

class E2ETestHelper {
  final String apiUrl;
  String? authToken;
  String? householdId;

  E2ETestHelper({required this.apiUrl});

  /// Login with test user (only works when server has TEST_MODE=true)
  Future<void> loginTestUser({
    required String email,
    required String name,
    String? inviteCode,
  }) async {
    final response = await http.post(
      Uri.parse('$apiUrl/auth/test-login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'name': name,
        if (inviteCode != null) 'invite_code': inviteCode,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Test login failed: ${response.body}');
    }

    final data = jsonDecode(response.body);
    authToken = data['token'];
    householdId = data['household_id'];
  }

  /// Get headers with authentication
  Map<String, String> get authHeaders => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  /// Create a category
  Future<Map<String, dynamic>> createCategory({
    required String name,
    required double monthlyBudget,
  }) async {
    final response = await http.post(
      Uri.parse('$apiUrl/households/$householdId/categories'),
      headers: authHeaders,
      body: jsonEncode({
        'name': name,
        'monthly_budget': monthlyBudget,
        'is_active': true,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Create category failed: ${response.body}');
    }

    return jsonDecode(response.body);
  }

  /// Create an account
  Future<Map<String, dynamic>> createAccount({
    required String name,
    required String type,
  }) async {
    final response = await http.post(
      Uri.parse('$apiUrl/households/$householdId/accounts'),
      headers: authHeaders,
      body: jsonEncode({
        'name': name,
        'type': type,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Create account failed: ${response.body}');
    }

    return jsonDecode(response.body);
  }

  /// Create a transaction
  Future<Map<String, dynamic>> createTransaction({
    required String categoryId,
    required String accountId,
    required double amount,
    String? note,
  }) async {
    final response = await http.post(
      Uri.parse('$apiUrl/households/$householdId/transactions'),
      headers: authHeaders,
      body: jsonEncode({
        'category_id': categoryId,
        'account_id': accountId,
        'amount': amount,
        'date': DateTime.now().toUtc().toIso8601String(),
        if (note != null) 'note': note,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Create transaction failed: ${response.body}');
    }

    return jsonDecode(response.body);
  }

  /// Get monthly summary
  Future<Map<String, dynamic>> getMonthlySummary(String month) async {
    final response = await http.get(
      Uri.parse('$apiUrl/households/$householdId/summary/$month'),
      headers: authHeaders,
    );

    if (response.statusCode != 200) {
      throw Exception('Get monthly summary failed: ${response.body}');
    }

    return jsonDecode(response.body);
  }

  /// Wait for server to be ready
  static Future<void> waitForServer(String apiUrl, {int maxRetries = 30}) async {
    for (var i = 0; i < maxRetries; i++) {
      try {
        final response = await http.get(Uri.parse('$apiUrl/health'));
        if (response.statusCode == 200) {
          print('✅ Server is ready');
          return;
        }
      } catch (e) {
        print('Waiting for server... (${i + 1}/$maxRetries)');
        await Future.delayed(const Duration(seconds: 2));
      }
    }
    throw Exception('Server did not become ready in time');
  }
}
