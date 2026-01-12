import 'package:json_annotation/json_annotation.dart';

part 'household.g.dart';

@JsonSerializable()
class Household {
  final String id;
  final String name;
  final String timezone;
  final String createdByUserId;

  Household({
    required this.id,
    required this.name,
    required this.timezone,
    required this.createdByUserId,
  });

  factory Household.fromJson(Map<String, dynamic> json) => _$HouseholdFromJson(json);
  Map<String, dynamic> toJson() => _$HouseholdToJson(this);
}
