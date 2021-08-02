import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
/**import*/
import "pages/page.dart";
/*import**/


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      localizationsDelegates: [
        GlobalCupertinoLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      supportedLocales: [
        Locale(/**app.lang*/"en"/**app.lang*/, /**app.country*/"US"/**app.country*/),
      ],
      locale: Locale(/**app.lang*/"en"/**app.lang*/, /**app.country*/"US"/**app.country*/),
      theme: ThemeData(
        // primaryTextTheme: TextTheme(
        //   bodyText2: TextStyle(
        //     color: Colors.blue,
        //   ),
        // ),
        primarySwatch: /**app.xColor*/Colors.blue/*app.xColor**/,
        primaryColorDark:  /**app.xColor*/Colors.blue/*app.xColor**/,
        accentColor:  /**app.xColor*/Colors.blue/*app.xColor**/,
        primaryColor:  /**app.xColor*/Colors.blue/*app.xColor**/,
      ),
      /**app.isDark*/
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColorDark:  /**app.xColor*/Colors.blue/*app.xColor**/,
        // primaryColor: /**app.xColor*/Colors.blue/*app.xColor**/,
        accentColor: /**app.xColor*/ Colors.blue /*app.xColor**/,
        // buttonColor: /**app.xColor*/ Colors.blue /*app.xColor**/,
      ),
      /*app.isDark**/
      home: Directionality( // add this
        textDirection: TextDirection./**app.isRTL*/ltr/*app.isRTL**/, // set this property
        child: /**app.mainPage*/ MyHomePage()/*app.mainPage**/,
      ),
    );
  }
}
