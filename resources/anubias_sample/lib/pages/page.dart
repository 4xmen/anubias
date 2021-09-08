import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:smart_select/smart_select.dart';
import '../fnc/general.dart';
import '../fnc/functions.dart';

/***allpages***/

class /**name*/ MyHomePage /*name**/ extends StatefulWidget {
  // MyHomePage({Key key, this.title}) : super(key: key);
  //
  //
  // final String title;

  @override
  /**nameState*/ _MyHomePageState /*nameState**/ createState() =>
      /**nameState*/ _MyHomePageState /*nameState**/ ();
}

class /**nameState*/ _MyHomePageState /*nameState**/
    extends State< /**name*/ MyHomePage /*name**/ > {
  App app;

  /***property-class***/

  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _asyncMethod();
    });
  }

  _asyncMethod() async {
    /**onPageShow*/
    // toast.show(text: "hello world 2", pos: ToastGravity.BOTTOM_LEFT);
    /*onPageShow**/
    setState(() {
      /***defineVars2***/
    });
  }

  @override
  Widget build(BuildContext context) {
    app = new App(context);
    /***lastDefine***/
    return Scaffold(
      /**appbar*/
      // app bar her
      appBar: AppBar(
        title: Text('appbar'),
      ),
      /*appbar**/
      /**drawer*/
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Text(
                'Drawer Header',
                style: TextStyle(
                  fontSize: 25,
                ),
              ),
              decoration: BoxDecoration(
                  color: null,
                  image: false
                      ? null
                      : DecorationImage(
                          image: AssetImage("assets/images/sample.jpg"),
                          fit: BoxFit.cover)),
            ),
            ListTile(
              leading: Icon(Icons.message),
              title: Text('Messages'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.account_circle),
              title: Text('Profile'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text('Settings'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      /*drawer**/
      body: /**body*/ Container(
        alignment: Alignment.topRight,
        padding: EdgeInsets.only(
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  width: MediaQuery.of(context).size.width,
                  child: Text(
                    'text',
                    textAlign: null,
                  ),
                ),

                // MaterialButton(
                //   shape: CircleBorder(),
                //   padding: EdgeInsets.all(10),
                //   color: Colors.red,
                //   child: Icon(
                //     Icons.home,
                //     size: 90,
                //   ),
                //   onPressed: () {},
                //   onLongPress: () {},
                // ),
              ],
            ),
          ),
        ),
      ), // This trail
      /*body**/
      // ,
      // floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat
      // ,
      // floatingActionButton: FloatingActionButton(
      //   child: Icon(Icons.add),
      //   onPressed: () {
      //     i++;
      //     setState(() {
      //
      //     });
      //   },
      // ),
      /**navbar*/
      /*navbar**/
    );
  }
}
