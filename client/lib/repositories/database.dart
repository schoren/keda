import 'package:drift/drift.dart';
import 'connection/connection.dart';

part 'database.g.dart';

@DataClassName('CategoryEntity')
class Categories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  RealColumn get monthlyBudget => real()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('AccountEntity')
class FinanceAccounts extends Table {
  TextColumn get id => text()();
  TextColumn get type => text()(); // cash, card
  TextColumn get name => text()();
  TextColumn get brand => text().nullable()();
  TextColumn get bank => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('ExpenseEntity')
class Expenses extends Table {
  TextColumn get id => text()();
  DateTimeColumn get date => dateTime()();
  TextColumn get categoryId => text()();
  TextColumn get accountId => text()();
  RealColumn get amount => real()();
  TextColumn get note => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [Categories, FinanceAccounts, Expenses])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(connect());

  @override
  int get schemaVersion => 1;
}
