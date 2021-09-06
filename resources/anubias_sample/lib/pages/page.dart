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

  NavProp nnn = NavProp(
    color: null,
    bgColor: null,
    index: 0,
    unselectedItemColor: Colors.grey,
    items: <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.call),
        label: 'Calls',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.camera),
        label: 'Camera',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.chat),
        label: 'Chats',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.timeline_sharp),
        label: 'Chart',
      ),
    ],
  );


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
      /*appbar**/
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

      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: nnn.bgColor,
        unselectedItemColor: nnn.unselectedItemColor,
        currentIndex: nnn.index,
        selectedItemColor: null,
        type: BottomNavigationBarType.fixed,
        onTap: (index){
          setState(() {
            nnn.index = index;
          });
        },
        items: nnn.items,
      ),
    );
  }
}
