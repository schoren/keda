import 'package:json_annotation/json_annotation.dart';
import 'user.dart';

part 'expense.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake)
class Expense {
  final String id;
  final DateTime date;
  final String categoryId;
  final String accountId;
  final String? userId;
  final User? user;
  final double amount;
  final String? note;

  Expense({
    required this.id,
    required this.date,
    required this.categoryId,
    required this.accountId,
    this.userId,
    this.user,
    required this.amount,
    this.note,
  });

  factory Expense.fromJson(Map<String, dynamic> json) => _$ExpenseFromJson(json);
  Map<String, dynamic> toJson() {
    final map = _$ExpenseToJson(this);
    map['date'] = date.toUtc().toIso8601String();
    return map;
  }
}
