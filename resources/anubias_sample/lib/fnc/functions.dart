import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:fluttertoast/fluttertoast.dart';

class App {
  BuildContext context;

  App(this.context);

  pageLoad(StatefulWidget pageName) {
    Navigator.of(this.context).push(new MaterialPageRoute<dynamic>(
      builder: (BuildContext context) {
        return pageName;
      },
    ));
  }

  pageBack() {
    Navigator.of(this.context).pop();
  }

  mainColor() {
    return Theme.of(this.context).accentColor;
  }

  colorOrMainColor(var clr) {
    return clr == null ? this.mainColor() : clr;
  }

  isDark() {
    return Theme.of(this.context).brightness == Brightness.dark;
  }


}

class toast {
  static const POS_CENTER = ToastGravity.CENTER;
  static const POS_CENTER_LEFT = ToastGravity.CENTER_LEFT;
  static const POS_CENTER_RIGHT = ToastGravity.CENTER_RIGHT;
  static const POS_TOP = ToastGravity.TOP;
  static const POS_TOP_LEFT = ToastGravity.TOP_LEFT;
  static const POS_TOP_RIGHT = ToastGravity.TOP_RIGHT;
  static const POS_BOTTOM = ToastGravity.BOTTOM;
  static const POS_BOTTOM_LEFT = ToastGravity.BOTTOM_LEFT;
  static const POS_BOTTOM_RIGHT = ToastGravity.BOTTOM_RIGHT;

  static const LENGTH_SHORT = Toast.LENGTH_SHORT;
  static const LENGTH_LONG = Toast.LENGTH_LONG;

  static show(Map<String, dynamic> data) {

    Map<String, dynamic> def = {
      'text': 'toast sample',
      'bgColor': Colors.black38,
      'txtColor': Colors.white,
      'fontSize': 16.0,
      'pos': ToastGravity.CENTER,
      'length': Toast.LENGTH_SHORT,
    };

    data.forEach((key, value) {
      def[key] = value;
    });
    Fluttertoast.showToast(
      msg: def['text'],
      toastLength: def['length'],
      gravity: def['pos'],
      // timeInSecForIosWeb: 1,
      backgroundColor: def['bgColor'],
      textColor: def['txtColor'],
      fontSize: def['fontSize'],
    );

  }


}
