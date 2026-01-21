import 'package:flutter/foundation.dart';
import 'package:drift/drift.dart';
import 'package:drift/web.dart'; // ignore: deprecated_member_use

QueryExecutor openConnection() {
  debugPrint('Drift: Opening WebDatabase (IndexedDB)...');
  return WebDatabase('keda_db', logStatements: true);
}
