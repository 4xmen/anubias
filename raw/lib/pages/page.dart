import 'package:flutter/material.dart';
import '../inc/application.dart';
import '../inc/general.dart';

/*** import all pages ***/


class RawPage extends StatefulWidget {
  const RawPage({super.key, required this.application});

  final Application application;

  @override
  State<RawPage> createState() => _RawPageState();
}

class _RawPageState extends State<RawPage> with Paddinable, Alianable {

  /*** define anubias class ***/

  @override
  void initState() {
    super.initState();
    /** initial anubias object & declare default value **/
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /*** render header ***/
      // appBar: AppBar(
      //   backgroundColor: Theme.of(context).colorScheme.primary,
      //   title: Text("anubias app"),
      // ),
      body: SingleChildScrollView(
        child: Container(
          padding: getPadding(),
          alignment: getAlign(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              /*** render objects in page ***/
            ],
          ),
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          /*** render footer ***/
          FloatingActionButton.extended(
            onPressed: () {
              // Add your onPressed code here!
              setState(() {
              });
            },
            label: const Text('Add'),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }
}
