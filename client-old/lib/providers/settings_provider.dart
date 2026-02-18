import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/runtime_config.dart';

final settingsProvider = NotifierProvider<SettingsNotifier, AppSettings>(() {
  return SettingsNotifier();
});

class AppSettings {
  final Locale? locale;
  final String serverUrl;

  AppSettings({this.locale, required this.serverUrl});

  AppSettings copyWith({
    Locale? locale,
    bool clearLocale = false,
    String? serverUrl,
  }) {
    return AppSettings(
      locale: clearLocale ? null : (locale ?? this.locale),
      serverUrl: serverUrl ?? this.serverUrl,
    );
  }
}

class SettingsNotifier extends Notifier<AppSettings> {
  static const _languageKey = 'selected_language';
  static const _serverUrlKey = 'server_url';
  late SharedPreferences _prefs;

  @override
  AppSettings build() {
    _init();
    return AppSettings(serverUrl: RuntimeConfig.apiUrl);
  }

  Future<void> _init() async {
    _prefs = await SharedPreferences.getInstance();
    final languageCode = _prefs.getString(_languageKey);
    final serverUrl = _prefs.getString(_serverUrlKey);
    
    var newState = state;
    if (languageCode != null) {
      newState = newState.copyWith(locale: Locale(languageCode));
    }
    if (serverUrl != null) {
      newState = newState.copyWith(serverUrl: serverUrl);
    }
    state = newState;
  }

  Future<void> setLanguage(String? languageCode) async {
    if (languageCode == null) {
      await _prefs.remove(_languageKey);
      state = state.copyWith(clearLocale: true);
    } else {
      await _prefs.setString(_languageKey, languageCode);
      state = state.copyWith(locale: Locale(languageCode));
    }
  }

  Future<void> setServerUrl(String url) async {
    await _prefs.setString(_serverUrlKey, url);
    state = state.copyWith(serverUrl: url);
  }
}
