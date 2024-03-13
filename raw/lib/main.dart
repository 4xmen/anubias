import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import './inc/application.dart';
import './inc/general.dart';


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
        brightness: application.isDark ? Brightness.dark : Brightness.light,
      ),
      home: MyHomePage(
          title: 'Flutter Demo Home Page', application: application),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage(
      {super.key, required this.title, required this.application});

  final String title;
  final Application application;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () {
              // widget.changeAppData(newLanf = "IR",newCoutry= "");
              setState(() {
                // widget.application.lang = "fa";
                // widget.application.country = "IR";
                widget.application.isDark = !widget.application.isDark;
                widget.application.lang = "en";
                widget.application.country = "US";
                widget.application.color = Colors.amber;
              });

            },
            tooltip: 'Toggle Theme',
            child: Icon(Icons.brightness_6),
          ),
        ],
      ),
    );
  }
}
