import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthState {
  final bool isAuthenticated;
  final String? userId;
  final String? userName;
  final String? userEmail;
  final String? householdId;
  final String? token;

  AuthState({
    this.isAuthenticated = false,
    this.userId,
    this.userName,
    this.userEmail,
    this.householdId,
    this.token,
  });
}

class AuthNotifier extends Notifier<AuthState> {
  static const String _googleClientId = String.fromEnvironment('GOOGLE_CLIENT_ID');

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: _googleClientId.isNotEmpty ? _googleClientId : null,
    scopes: ['email', 'profile'],
  );

  @override
  AuthState build() {
    return AuthState();
  }

  Future<void> loginWithGoogle() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return;

      final googleAuth = await googleUser.authentication;
      final idToken = googleAuth.idToken;
      final accessToken = googleAuth.accessToken;

      if (idToken == null && accessToken == null) {
        throw Exception('Failed to get any token from Google');
      }

      // Authenticate with backend
      // TODO: Use actual base URL from config
      final response = await http.post(
        Uri.parse('http://localhost:8090/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id_token': idToken,
          'access_token': accessToken,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = data['user'];
        
        state = AuthState(
          isAuthenticated: true,
          userId: user['id'],
          userName: user['name'],
          userEmail: user['email'],
          householdId: data['household_id'],
          token: data['token'],
        );
      } else {
        throw Exception('Backend authentication failed: ${response.statusCode}');
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  Future<void> logout() async {
    await _googleSignIn.signOut();
    state = AuthState();
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});
