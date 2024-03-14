import 'package:flutter/material.dart';
import '../inc/application.dart';
import '../inc/general.dart';

/*** start import all pages ***/

/*** end import all pages ***/

class RawPage extends StatefulWidget {
  const RawPage({super.key, required this.application});

  final Application application;

  @override
  State<RawPage> createState() => _RawPageState();
}

class _RawPageState extends State<RawPage> {

  late AnubiasPreloader preloader1 ;


  @override
  void initState() {
    super.initState();
    preloader1 = AnubiasPreloader(context: context);
    preloader1.width = "250";
    preloader1.height = "250";
    // preloader1.color =
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text("anubias app"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            preloader1.generate(),
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
          FloatingActionButton(
            onPressed: () {
              // widget.changeAppData(newLanf = "IR",newCoutry= "");
              setState(() {
                preloader1.color = Colors.lightBlue;

              });
            },
            tooltip: 'Toggle Theme',
            child: Icon(Icons.toggle_on),
          ),
        ],
      ),
    );
  }
}
