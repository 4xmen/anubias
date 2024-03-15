// import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// import 'package:smart_select/smart_select.dart';
import 'dart:convert';

mixin Alianable {
  String align = 'center';
  bool _isTextAlign = false;

  getAlign() {
    if (this.align == 'null') {
      return this._isTextAlign ? TextAlign.start : null;
    }
    switch (this.align) {
      case 'center':
        return this._isTextAlign ? TextAlign.center : Alignment.center;
      case 'left':
        return this._isTextAlign ? TextAlign.left : Alignment.centerLeft;
      case 'right':
        return this._isTextAlign ? TextAlign.right : Alignment.centerRight;
      case 'justify':
        return this._isTextAlign ? TextAlign.justify : Alignment.centerRight;
      default:
        return null;
    }
  }
}

mixin AlianableChildren {
  String align = 'center';

  getAlignCross() {
    switch (this.align) {
      case 'center':
        return CrossAxisAlignment.center;
      case 'left':
        return CrossAxisAlignment.start;
      case 'right':
        return CrossAxisAlignment.end;
      default:
        return CrossAxisAlignment.center;
    }
  }

  getAlignMain() {
    switch (this.align) {
      case 'center':
        return MainAxisAlignment.center;
      case 'left':
        return MainAxisAlignment.start;
      case 'right':
        return MainAxisAlignment.end;
      default:
        return MainAxisAlignment.center;
    }
  }
}

mixin Radiusable {
  String borderRadius = '5';

  getBorderRadius() {
    if (this.borderRadius.indexOf(',') == -1) {
      return BorderRadius.only(
        topLeft: Radius.circular(double.parse(this.borderRadius)),
        topRight: Radius.circular(double.parse(this.borderRadius)),
        bottomRight: Radius.circular(double.parse(this.borderRadius)),
        bottomLeft: Radius.circular(double.parse(this.borderRadius)),
      );
    }
    var raid = this.borderRadius.split(',');
    switch (raid.length) {
      case 2:
        return BorderRadius.only(
          topLeft: Radius.circular(double.parse(raid[0])),
          topRight: Radius.circular(double.parse(raid[1])),
          bottomRight: Radius.circular(double.parse(raid[0])),
          bottomLeft: Radius.circular(double.parse(raid[1])),
        );
      case 3:
        return BorderRadius.only(
          topLeft: Radius.circular(double.parse(raid[0])),
          topRight: Radius.circular(double.parse(raid[2])),
          bottomRight: Radius.circular(double.parse(raid[1])),
          bottomLeft: Radius.circular(double.parse(raid[1])),
        );
      case 4:
        return BorderRadius.only(
          topLeft: Radius.circular(double.parse(raid[0])),
          topRight: Radius.circular(double.parse(raid[2])),
          bottomRight: Radius.circular(double.parse(raid[1])),
          bottomLeft: Radius.circular(double.parse(raid[3])),
        );
    }
  }
}

mixin Widthable {
  String width = '';
  late BuildContext context;

  double getWidth() {
    if (this.width == 'null') {
      return MediaQuery.of(this.context).size.width;
    }
    if (this.width[this.width.length - 1] == '%') {
      return MediaQuery.of(this.context).size.width *
          (double.parse(this.width.substring(0, this.width.length - 1))) /
          100;
    }
    return double.parse(this.width);
  }
}
mixin Heightable {
  String height = '';
  late BuildContext context;

  double? getHeight() {
    if (this.height == 'null') {
      return null;
    }
    if (this.height[this.height.length - 1] == '%') {
      return MediaQuery.of(this.context).size.height *
          double.parse(this.height.substring(0, this.height.length - 1)) /
          100;
    }
    return double.parse(this.height);
  }
}

mixin Borderable {
  String border = '0';
  Color borderColor = Colors.black;

  getBorder() {
    if (this.border.indexOf(',') == -1) {
      return [
        // to make elevation
        BoxShadow(
          color: this.borderColor,
          offset: Offset(0, double.parse(this.border) * -1),
        ),
        // to make the coloured border
        BoxShadow(
          color: this.borderColor,
          offset: Offset(double.parse(this.border), 0),
        ),
        BoxShadow(
          color: this.borderColor,
          offset: Offset(0, double.parse(this.border)),
        ),
        BoxShadow(
          color: this.borderColor,
          offset: Offset(double.parse(this.border) * -1, 0),
        ),
      ];
    }
    var bor = this.border.split(',');
    switch (bor.length) {
      case 2:
        return [
          // to make elevation
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[0]) * -1),
            spreadRadius: -1.0,
            blurRadius: 1.0,
          ),
          // to make the coloured border
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[1]), 0),
            spreadRadius: -1.0,
            blurRadius: 1.0,
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[0])),
            spreadRadius: -1.0,
            blurRadius: 1.0,
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[1]) * -1, 0),
            spreadRadius: -1.0,
            blurRadius: 1.0,
          ),
        ];
      case 3:
        return [
          // to make elevation
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[0]) * -1),
          ),
          // to make the coloured border
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[1]), 0),
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[2])),
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[1]) * -1, 0),
          ),
        ];
      case 4:
        return [
          // to make elevation
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[0]) * -1),
          ),
          // to make the coloured border
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[1]), 0),
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(0, double.parse(bor[2])),
          ),
          BoxShadow(
            color: this.borderColor,
            offset: Offset(double.parse(bor[3]) * -1, 0),
          ),
        ];
    }
  }
}
mixin Paddinable {
  String padding = '15';

  getPadding() {
    if (this.padding.indexOf(',') == -1) {
      return EdgeInsets.all(double.parse(this.padding));
    }
    var pad = this.padding.split(',');
    switch (pad.length) {
      case 2:
        return EdgeInsets.only(
          top: double.parse(pad[0]),
          bottom: double.parse(pad[0]),
          left: double.parse(pad[1]),
          right: double.parse(pad[1]),
        );
      case 3:
        return EdgeInsets.only(
          top: double.parse(pad[0]),
          bottom: double.parse(pad[2]),
          left: double.parse(pad[1]),
          right: double.parse(pad[1]),
        );
      case 4:
        return EdgeInsets.only(
          top: double.parse(pad[0]),
          bottom: double.parse(pad[2]),
          left: double.parse(pad[3]),
          right: double.parse(pad[1]),
        );
    }
  }
}


mixin Marginable {
  String margin = '15';

  getMargin() {
    if (this.margin.indexOf(',') == -1) {
      return EdgeInsets.all(double.parse(this.margin));
    }
    var marg = this.margin.split(',');
    switch (marg.length) {
      case 2:
        return EdgeInsets.only(
          top: double.parse(marg[0]),
          bottom: double.parse(marg[0]),
          left: double.parse(marg[1]),
          right: double.parse(marg[1]),
        );
      case 3:
        return EdgeInsets.only(
          top: double.parse(marg[0]),
          bottom: double.parse(marg[2]),
          left: double.parse(marg[1]),
          right: double.parse(marg[1]),
        );
      case 4:
        return EdgeInsets.only(
          top: double.parse(marg[0]),
          bottom: double.parse(marg[2]),
          left: double.parse(marg[3]),
          right: double.parse(marg[1]),
        );
    }
  }
}

mixin ColorFixer{
  late BuildContext context;
  Color fixColor(Color? color){
    if (color == null){
      return  Theme.of(context).colorScheme.primary;
    }else{
      return color;
    }
  }
}

class AnubiasPreloader with Paddinable, Alianable, Widthable, Heightable, ColorFixer {

  late BuildContext context;
  String width;

  String height;
  String align;
  Color? color;
  bool visible;


  AnubiasPreloader({
    this.width = "150",
    this.height = "150",
    this.align = 'center',
    this.visible = true,
    this.color = null,
    required this.context,
  });
  

  Offstage toWidget() {
    
    return Offstage(
      offstage: !visible,
      child: Container(
        alignment: getAlign(),
        padding: getPadding(),
        child: SizedBox(
          width: getWidth(),
          height: getHeight(),
          child:  CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(fixColor(color)),
            strokeWidth: getWidth() / 10,
          ),
        ),
      ),
    );
  }
}
