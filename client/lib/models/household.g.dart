// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'household.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Household _$HouseholdFromJson(Map<String, dynamic> json) => Household(
  id: json['id'] as String,
  name: json['name'] as String,
  timezone: json['timezone'] as String,
  createdByUserId: json['createdByUserId'] as String,
);

Map<String, dynamic> _$HouseholdToJson(Household instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'timezone': instance.timezone,
  'createdByUserId': instance.createdByUserId,
};
