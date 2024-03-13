import 'package:flutter/material.dart';

/**
 * main app class
 * needUpdate to bypass recursive run
 */
class Application {
  bool _isDark = false;
  String _lang = "en";
  String _country = "US";
  MaterialColor _color = Colors.green;

  bool get isDark => _isDark;
  String get lang => _lang;
  String get country => _country;
  MaterialColor get color => _color;

  set isDark(bool value) {
    bool needUpdate = false;
    if (value != _isDark){
      needUpdate = true;
    }
    _isDark = value;
    if (needUpdate){
      updating();
    }
  }

  set color(MaterialColor value) {
    bool needUpdate = false;
    if (value != _color){
      needUpdate = true;
    }
    _color = value;
    if (needUpdate){
      updating();
    }
  }


  set lang(String value) {
    bool needUpdate = false;
    if (value != _lang){
      needUpdate = true;
    }
    _lang = value;
    if (needUpdate){
      updating();
    }
  }

  set country(String value) {
    bool needUpdate = false;
    if (value != _country){
      needUpdate = true;
    }
    _country = value;
    if (needUpdate){
      updating();
    }
  }

  Function updating;
  Application({required this.updating });
}