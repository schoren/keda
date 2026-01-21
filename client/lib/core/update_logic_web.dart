// ignore: avoid_web_libraries_in_flutter
import 'dart:js' as js; // ignore: deprecated_member_use

void forceReload() {
  try {
    // Unregister service workers first
    js.context.callMethod('eval', [
      'if ("serviceWorker" in navigator) {'
      '  navigator.serviceWorker.getRegistrations().then(function(registrations) {'
      '    var promises = registrations.map(function(r) { return r.unregister(); });'
      '    Promise.all(promises).then(function() {'
      '      var url = new URL(window.location.href);'
      '      url.searchParams.set("u", Date.now());'
      '      window.location.replace(url.href);'
      '    });'
      '  });'
      '} else {'
      '  var url = new URL(window.location.href);'
      '  url.searchParams.set("u", Date.now());'
      '  window.location.replace(url.href);'
      '}'
    ]);
  } catch (e) {
    // Fallback if JS interop fails
    js.context['location']?.callMethod('reload', [true]);
  }
}
