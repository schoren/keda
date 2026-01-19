import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:keda/main.dart' as app;
import 'package:keda/models/account_type.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = true;

  group('E2E Account Management', () {
    testWidgets('Verify cash account rules and create/delete custom account', (tester) async {
      app.main();
      
      // Wait for the app to load and find Dashboard (using a longer timeout for initial load)
      await tester.pumpAndSettle(const Duration(seconds: 5));
      
      // Find Dashboard with a bit more patience
      bool dashboardFound = false;
      for (int i = 0; i < 5; i++) {
        if (find.text('Dashboard').evaluate().isNotEmpty) {
          dashboardFound = true;
          break;
        }
        await tester.pump(const Duration(milliseconds: 500));
      }
      
      expect(dashboardFound, isTrue, reason: 'Dashboard was not found after initial load');

      // 2. Navigate to Accounts tab
      final accountsTab = find.byIcon(Icons.account_balance_outlined);
      await tester.tap(accountsTab);
      await tester.pumpAndSettle();

      expect(find.text('Manage Accounts'), findsOneWidget);

      // 3. Verify cash account rules (cannot delete/edit)
      // The cash account should be seeded by the backend in TEST_MODE
      final cashListTile = find.ancestor(
        of: find.text('Cash'),
        matching: find.byType(ListTile),
      );
      expect(cashListTile, findsAtLeastNWidgets(1));

      // Find edit and delete icons within the cash tile
      // In manage_accounts_screen.dart, buttons are null for cash
      final editButton = find.descendant(
        of: cashListTile.first,
        matching: find.byIcon(Icons.edit),
      );
      final deleteButton = find.descendant(
        of: cashListTile.first,
        matching: find.byIcon(Icons.delete),
      );

      // Verify they are present but their onPressed is null (implicitly tested by trying to tap or checking color)
      // Better: check that they are grey as per code: color: account.type == AccountType.cash ? Colors.grey : Colors.blue
      final IconButton editIconButton = tester.widget(find.ancestor(of: editButton, matching: find.byType(IconButton)));
      final IconButton deleteIconButton = tester.widget(find.ancestor(of: deleteButton, matching: find.byType(IconButton)));
      
      expect(editIconButton.onPressed, isNull);
      expect(deleteIconButton.onPressed, isNull);

      // 4. Create a custom account
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();

      expect(find.text('New Account'), findsOneWidget);

      // Fill name for Bank account (default is card, let's switch to Bank)
      await tester.tap(find.text('Card')); // Open type dropdown
      await tester.pumpAndSettle();
      await tester.tap(find.text('Bank Account').last); // Select bank
      await tester.pumpAndSettle();

      final nameField = find.widgetWithText(TextFormField, 'Account Name');
      await tester.enterText(nameField, 'E2E Bank');
      await tester.pumpAndSettle();

      await tester.tap(find.text('SAVE'));
      await tester.pumpAndSettle();

      // 5. Verify it appears in the list
      expect(find.text('E2E Bank'), findsOneWidget);

      // 6. Delete it
      final bankListTile = find.ancestor(
        of: find.text('E2E Bank'),
        matching: find.byType(ListTile),
      );
      
      final bankDeleteButton = find.descendant(
        of: bankListTile,
        matching: find.byIcon(Icons.delete),
      );
      
      await tester.tap(bankDeleteButton);
      await tester.pumpAndSettle();

      // 7. Confirm deletion
      expect(find.text('Delete Account'), findsOneWidget);
      await tester.tap(find.text('DELETE').last); // There might be multiple 'DELETE' texts (one in button, one in dialog title? no, title is Delete Account)
      await tester.pumpAndSettle();

      // 8. Verify it's gone
      expect(find.text('E2E Bank'), findsNothing);
    });
  });
}
