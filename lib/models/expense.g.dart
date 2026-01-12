// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expense.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expense _$ExpenseFromJson(Map<String, dynamic> json) => Expense(
  id: json['id'] as String,
  date: DateTime.parse(json['date'] as String),
  categoryId: json['categoryId'] as String,
  accountId: json['accountId'] as String,
  amount: (json['amount'] as num).toDouble(),
  note: json['note'] as String?,
);

Map<String, dynamic> _$ExpenseToJson(Expense instance) => <String, dynamic>{
  'id': instance.id,
  'date': instance.date.toIso8601String(),
  'categoryId': instance.categoryId,
  'accountId': instance.accountId,
  'amount': instance.amount,
  'note': instance.note,
};
