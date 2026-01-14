// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expense.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expense _$ExpenseFromJson(Map<String, dynamic> json) => Expense(
  id: json['id'] as String,
  date: DateTime.parse(json['date'] as String),
  categoryId: json['category_id'] as String,
  accountId: json['account_id'] as String,
  userId: json['user_id'] as String?,
  user: json['user'] == null
      ? null
      : User.fromJson(json['user'] as Map<String, dynamic>),
  amount: (json['amount'] as num).toDouble(),
  note: json['note'] as String?,
);

Map<String, dynamic> _$ExpenseToJson(Expense instance) => <String, dynamic>{
  'id': instance.id,
  'date': instance.date.toIso8601String(),
  'category_id': instance.categoryId,
  'account_id': instance.accountId,
  'user_id': instance.userId,
  'user': instance.user,
  'amount': instance.amount,
  'note': instance.note,
};
