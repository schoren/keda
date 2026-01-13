import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'test_helper.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('E2E Tests', () {
    late E2ETestHelper helper;
    const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'http://localhost:8090');

    setUpAll(() async {
      // Wait for server to be ready
      await E2ETestHelper.waitForServer(apiUrl);
      helper = E2ETestHelper(apiUrl: apiUrl);
    });

    test('Complete user flow: login, create category, add expense, view summary', () async {
      // 1. Login with test user
      await helper.loginTestUser(
        email: 'e2e-test@example.com',
        name: 'E2E Test User',
      );

      expect(helper.authToken, isNotNull);
      expect(helper.householdId, isNotNull);
      print('✅ Logged in successfully');

      // 2. Create a category
      final category = await helper.createCategory(
        name: 'Food',
        monthlyBudget: 500.0,
      );

      expect(category['name'], 'Food');
      expect(category['monthly_budget'], 500.0);
      print('✅ Created category: ${category['name']}');

      // 3. Create an account
      final account = await helper.createAccount(
        name: 'Cash',
        type: 'cash',
      );

      expect(account['name'], 'Cash');
      expect(account['type'], 'cash');
      print('✅ Created account: ${account['name']}');

      // 4. Create a transaction
      final transaction = await helper.createTransaction(
        categoryId: category['id'],
        accountId: account['id'],
        amount: 50.0,
        note: 'Groceries',
      );

      expect(transaction['amount'], 50.0);
      expect(transaction['note'], 'Groceries');
      print('✅ Created transaction: \$${transaction['amount']}');

      // 5. Get monthly summary
      final now = DateTime.now();
      final month = '${now.year}-${now.month.toString().padLeft(2, '0')}';
      final summary = await helper.getMonthlySummary(month);

      expect(summary['total_budget'], 500.0);
      expect(summary['total_spent'], 50.0);
      expect(summary['categories'], isNotEmpty);
      
      final categorySummary = summary['categories'][0];
      expect(categorySummary['name'], 'Food');
      expect(categorySummary['spent'], 50.0);
      expect(categorySummary['remaining'], 450.0);
      
      print('✅ Monthly summary verified');
      print('   Budget: \$${summary['total_budget']}');
      print('   Spent: \$${summary['total_spent']}');
      print('   Remaining: \$${categorySummary['remaining']}');
    });

    test('Second user can create their own household', () async {
      // Create a second user with different email
      await helper.loginTestUser(
        email: 'user2@example.com',
        name: 'User Two',
      );

      expect(helper.authToken, isNotNull);
      expect(helper.householdId, isNotNull);
      print('✅ User 2 created household: ${helper.householdId}');

      // Verify user 2 can create their own category
      final category = await helper.createCategory(
        name: 'User 2 Category',
        monthlyBudget: 200.0,
      );

      expect(category['name'], 'User 2 Category');
      expect(category['monthly_budget'], 200.0);
      print('✅ User 2 created their own category');
    });
  });
}
