import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import './inc/application.dart';

/*** import all pages ***/
import './pages/page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  late Application application;
  @override
  void initState() {
    super.initState();
    application = Application(updating: updateApp);
    application.lang = "fa";
    application.country = "IR";
    application.isDark = true;
    application.color = Colors.red;
  }

  void updateApp(){
    setState(() {
      // need update after application properties update
      application.isDark = application.isDark;
      application.lang = application.lang;
      application.country = application.country;
      application.color = application.color;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hello world',
      localizationsDelegates: const [
        GlobalCupertinoLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      supportedLocales: [
        Locale(application.lang, application.country),
      ],
      locale: Locale(application.lang, application.country),
      theme: ThemeData(
        primarySwatch: application.color,
        primaryColorDark: application.color,
        primaryColor: application.color,
        colorScheme: ColorScheme.fromSwatch(
          accentColor: application.color,
          primarySwatch: application.color,
          brightness: application.isDark ? Brightness.dark : Brightness.light,
        ),
        brightness: application.isDark ? Brightness.dark : Brightness.light,
      ),
      home: RawPage(application: application),
    );
  }
}
