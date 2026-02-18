import 'package:json_annotation/json_annotation.dart';

part 'monthly_summary.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake)
class CategorySummary {
  final String id;
  final String name;
  final double budget;
  final double spent;
  final double remaining;

  CategorySummary({
    required this.id,
    required this.name,
    required this.budget,
    required this.spent,
    required this.remaining,
  });

  factory CategorySummary.fromJson(Map<String, dynamic> json) => _$CategorySummaryFromJson(json);
  Map<String, dynamic> toJson() => _$CategorySummaryToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake)
class MonthlySummary {
  final String month;
  final double totalBudget;
  final double totalSpent;
  final List<CategorySummary> categories;

  MonthlySummary({
    required this.month,
    required this.totalBudget,
    required this.totalSpent,
    required this.categories,
  });

  factory MonthlySummary.fromJson(Map<String, dynamic> json) => _$MonthlySummaryFromJson(json);
  Map<String, dynamic> toJson() => _$MonthlySummaryToJson(this);
}
