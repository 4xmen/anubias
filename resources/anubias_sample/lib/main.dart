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
        Locale(/**app.lang*/"en"/*app.lang**/, /**app.country*/"US"/*app.country**/),
      ],
      locale: Locale(/**app.lang*/"en"/*app.lang**/, /**app.country*/"US"/*app.country**/),
      theme: ThemeData(
        // primaryTextTheme: TextTheme(
        //   bodyText2: TextStyle(
        //     color: Colors.blue,
        //   ),
        // ),
        primarySwatch: /**app.appColor*/Colors.blue/*app.appColor**/,
        primaryColorDark:  /**app.appColor*/Colors.blue/*app.appColor**/,
        accentColor:  /**app.appColor*/Colors.blue/*app.appColor**/,
        primaryColor:  /**app.appColor*/Colors.blue/*app.appColor**/,
      ),
      /**app.isDark*/
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColorDark:  /**app.appColor*/Colors.blue/*app.appColor**/,
        // primaryColor: /**app.appColor*/Colors.blue/*app.appColor**/,
        accentColor: /**app.appColor*/ Colors.blue /*app.appColor**/,
        // buttonColor: /**app.appColor*/ Colors.blue /*app.appColor**/,
      ),
      /*app.isDark**/
      home: Directionality( // add this
        textDirection: TextDirection./**app.isRTL*/ltr/*app.isRTL**/, // set this property
        child: /**app.mainPage*/ MyHomePage()/*app.mainPage**/,
      ),
    );
  }
}
