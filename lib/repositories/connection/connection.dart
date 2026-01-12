import 'package:drift/drift.dart';
import 'unsupported.dart'
    if (dart.library.io) 'native.dart'
    if (dart.library.html) 'web.dart';

QueryExecutor connect() => openConnection();
