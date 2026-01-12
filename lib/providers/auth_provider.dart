import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthState {
  final bool isAuthenticated;
  final String? userId;
  final String? userName;
  final String? userEmail;

  AuthState({
    this.isAuthenticated = false,
    this.userId,
    this.userName,
    this.userEmail,
  });
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    return AuthState();
  }

  void loginWithGoogle() {
    // Mocking Google Login
    state = AuthState(
      isAuthenticated: true,
      userId: 'user123',
      userName: 'User Test',
      userEmail: 'user@test.com',
    );
  }

  void logout() {
    state = AuthState();
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});
