import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../views/home_screen.dart';
import '../views/login_screen.dart';
import '../views/new_expense_screen.dart';
import '../views/category_detail_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final loggingIn = state.matchedLocation == '/login';
      if (!authState.isAuthenticated) {
        return loggingIn ? null : '/login';
      }
      if (loggingIn) {
        return '/';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/category/:categoryId',
        builder: (context, state) {
          final categoryId = state.pathParameters['categoryId']!;
          return CategoryDetailScreen(categoryId: categoryId);
        },
      ),
      GoRoute(
        path: '/new-expense/:categoryId',
        builder: (context, state) {
          final categoryId = state.pathParameters['categoryId']!;
          return NewExpenseScreen(categoryId: categoryId);
        },
      ),
    ],
  );
});
