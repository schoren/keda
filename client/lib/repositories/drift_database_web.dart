import 'package:drift/drift.dart';
import 'package:drift/web.dart';

QueryExecutor openConnection() {
  print('Drift: Opening WebDatabase (IndexedDB)...');
  return WebDatabase('family_finance_db', logStatements: true);
}
