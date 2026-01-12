import 'package:freezed_annotation/freezed_annotation.dart';

part 'account.freezed.dart';
part 'account.g.dart';

enum AccountType { cash, card }

@freezed
class Account with _$Account {
  const factory Account({
    required String id,
    required AccountType type,
    required String name,
    String? brand,
    String? bank,
  }) = _Account;

  factory Account.fromJson(Map<String, dynamic> json) => _$AccountFromJson(json);
}
