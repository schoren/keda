import 'package:json_annotation/json_annotation.dart';

part 'expense.g.dart';

@JsonSerializable()
class Expense {
  final String id;
  final DateTime date;
  final String categoryId;
  final String accountId;
  final double amount;
  final String? note;

  Expense({
    required this.id,
    required this.date,
    required this.categoryId,
    required this.accountId,
    required this.amount,
    this.note,
  });

  factory Expense.fromJson(Map<String, dynamic> json) => _$ExpenseFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseToJson(this);
}
