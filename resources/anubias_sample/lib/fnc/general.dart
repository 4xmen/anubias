import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:smart_select/smart_select.dart';
import 'dart:convert';

mixin Alignator {
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

mixin AlignatorChildren {
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

mixin Radidusator {
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

mixin Widthator {
  String width = '';
  BuildContext context;

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
mixin Heightator {
  String height = '';
  BuildContext context;

  double getHeight() {
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

mixin Borderator {
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
mixin Paddinator {
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

mixin Marginator {
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

class PreloaderProps with Paddinator, Alignator, Widthator, Heightator {
  PreloaderProps(
      {this.align,
      this.color,
      this.padding,
      this.hide,
      this.height,
      this.width,
      this.context});

  BuildContext context;
  String width = '50';
  String height = '50';
  String align = 'center';
  Color color = null;
  bool hide = false;
  String padding = '15';
  Color tempColor = Colors.green;
}

class AppBarProps {
  String title = 'center';
  List<Widget> actions = [];
  Color color = null;
  Color textColor = null;
  bool back = false;
  bool hide = false;
  var menu = null;
  BuildContext context;

  AppBarProps({
    this.context,
    this.title,
    this.color,
    this.textColor,
    this.hide,
    this.back,
    this.actions,
    this.menu,
  });

// List<Widget> getActions (){
//   List<Widget> lst ;
//   this.actions.forEach((act) {
//     lst.add(
//       IconButton(
//         icon: const Icon(Icons.add_alert),
//         tooltip: act['tooltip'].toString(),
//         onPressed: () {
//           eval(act['onPressed'])
//         },
//       ),
//     );
//   });
//   return  lst;
// }

}

class TextProps with Alignator {
  TextProps({
    this.text,
    this.align,
    this.size,
    this.height,
    this.overflow,
    this.maxLine,
    this.color,
    this.font,
    this.hide,
    this.weight,
    this.softWrap,
    this.context,
  });

  BuildContext context;
  String text = 'center';
  String align = 'center';
  double size = 13.0;
  double height = 1.2;
  int maxLine = 0;
  String overflow = null;
  Color color = null;
  bool hide = false;
  String weight = null;
  var font = null;
  bool softWrap = true;
  bool _isTextAlign = true;

  getOverflow() {
    switch (this.overflow) {
      case 'clip':
        return TextOverflow.clip;
      case 'fade':
        return TextOverflow.fade;
      case 'visible':
        return TextOverflow.visible;
      case 'ellipsis':
        return TextOverflow.ellipsis;
      default:
        return null;
    }
  }

  getWeight() {
    switch (this.weight) {
      case 'normal':
        return FontWeight.normal;
      case 'bold':
        return FontWeight.bold;
      case 'w100':
        return FontWeight.w100;
      case 'w200':
        return FontWeight.w200;
      case 'w300':
        return FontWeight.w300;
      case 'w400':
        return FontWeight.w400;
      case 'w500':
        return FontWeight.w500;
      case 'w600':
        return FontWeight.w600;
      case 'w700':
        return FontWeight.w700;
      case 'w800':
        return FontWeight.w800;
      case 'w900':
        return FontWeight.w900;
      default:
        return FontWeight.normal;
    }
  }

  getMaxLine() {
    if (this.maxLine > 0) {
      return this.maxLine;
    } else {
      return null;
    }
  }
}

class IconProp with Alignator, Paddinator {
  IconProp({
    this.hide,
    this.align,
    this.size,
    this.color,
    this.icon,
    this.padding,
    this.context,
  });

  BuildContext context;
  String padding = '15';
  String align = null;
  double size = 24.0;
  bool hide = false;
  Color color = null;
  IconData icon = Icons.settings;
}

class ImageProp with Alignator, Paddinator, Widthator, Heightator {
  ImageProp({
    this.hide,
    this.padding,
    this.width,
    this.height,
    this.align,
    this.image,
    this.isOnline,
    this.fit,
    this.context,
  });

  BuildContext context;
  String padding = '0';
  String width = '100%';
  String height = 'null';
  String align = null;
  bool isOnline = false;
  bool hide = false;
  String fit = 'null';
  var image = null;

  getImage() {
    var temp = this.image.split(';base64,');
    return Base64Decoder().convert(temp[1]);
  }

  getFit() {
    switch (this.fit) {
      case 'none':
        return BoxFit.none;
        break;
      case 'cover':
        return BoxFit.cover;
        break;
      case 'contain':
        return BoxFit.contain;
        break;
      case 'scaleDown':
        return BoxFit.scaleDown;
        break;
      case 'fill':
        return BoxFit.fill;
      case 'fitWidth':
        return BoxFit.fitWidth;
        break;
      case 'fitHeight':
        return BoxFit.fitHeight;
        break;
      default:
        return null;
    }
  }
}

class ButtonProp
    with Paddinator, Radidusator, Widthator, Heightator, Marginator {
  ButtonProp({
    this.height,
    this.width,
    this.padding,
    this.hide,
    this.color,
    this.size,
    this.icon,
    this.text,
    this.bgColor,
    this.borderRadius,
    this.noIcon,
    this.noText,
    this.context,
    this.margin,
  });

  BuildContext context;
  String padding = '0';
  String margin = '0';
  String width = '120';
  String height = 'null';
  IconData icon = Icons.home;
  String text = 'Click me';
  Color color = null;
  Color bgColor = null;
  String borderRadius = '5';
  bool noText = false;
  bool noIcon = false;
  double size = 15;
  bool hide = false;
}

class RowProp
    with
        Paddinator,
        Marginator,
        Widthator,
        Heightator,
        Radidusator,
        Borderator {
  bool hide = false;
  bool scrollable = true;
  String padding = '0';
  String margin = '0';
  String width = '100%';
  String height = 'null';
  String borderRadius = '0';
  String border = '0';
  Color borderColor = null;

  Color bgColor = Colors.transparent;
  MainAxisAlignment axis;
  BuildContext context;

  List<Widget> children;

  RowProp({
    this.hide,
    this.axis,
    this.children,
    this.scrollable,
    this.context,
    this.bgColor,
    this.padding,
    this.margin,
    this.width,
    this.height,
    this.borderColor,
    this.border,
    this.borderRadius,
  });
}

class GridProp with Paddinator, Marginator, Radidusator, Borderator {
  bool hide = false;
  String padding = '0';
  String margin = '0';
  String borderRadius = '0';
  String border = '0';
  Color borderColor = null;
  int column = 2;

  Color bgColor = Colors.transparent;
  BuildContext context;

  List<Widget> children;

  GridProp({
    this.hide,
    this.children,
    this.context,
    this.bgColor,
    this.padding,
    this.margin,
    this.borderColor,
    this.border,
    this.borderRadius,
    this.column,
  });
}

class ColumnProp
    with
        Paddinator,
        Marginator,
        Widthator,
        Heightator,
        Radidusator,
        AlignatorChildren,
        Borderator {
  bool hide = false;
  String padding = '0';
  String margin = '0';
  String width = '100%';
  String height = 'null';
  String borderRadius = '0';
  String border = '0';
  Color borderColor = null;
  String align = 'null';

  Color bgColor = Colors.transparent;
  MainAxisAlignment axis;
  BuildContext context;

  List<Widget> children;

  ColumnProp({
    this.hide,
    this.axis,
    this.children,
    this.align,
    this.context,
    this.bgColor,
    this.padding,
    this.margin,
    this.width,
    this.height,
    this.borderColor,
    this.border,
    this.borderRadius,
  });
}

class CircleButtonProp with Paddinator, Radidusator {
  CircleButtonProp({
    this.padding,
    this.hide,
    this.color,
    this.size,
    this.icon,
    this.bgColor,
    this.borderRadius,
    this.context,
  });

  BuildContext context;
  String padding = '0';
  IconData icon = Icons.home;
  Color color = null;
  Color bgColor = null;
  String borderRadius = '5';
  double size = 15;
  bool hide = false;
}

class ContainerProp
    with
        Paddinator,
        Radidusator,
        Marginator,
        Widthator,
        Heightator,
        Borderator {
  String borderRadius = '5';
  String width = '100%';
  String height = 'null';
  bool hide = false;
  String padding = '0';
  String margin = '0';
  String border = '0';
  Color borderColor = null;
  Color bgColor = null;
  BuildContext context;

  ContainerProp({
    this.borderRadius,
    this.width,
    this.height,
    this.bgColor,
    this.hide,
    this.padding,
    this.border,
    this.borderColor,
    this.margin,
    this.context,
  });
}

class InputProp with Alignator, Marginator {
  InputProp(
      {this.align,
      this.size,
      this.maxLine,
      this.color,
      this.font,
      this.hide = false,
      this.weight,
      this.borderColor,
      this.bgColor,
      this.icon,
      this.autocorrect,
      this.borderDisableColor,
      this.borderFocusedColor,
      this.cursorColor,
      this.enabled,
      this.hintText,
      this.iconColor,
      this.iconSize,
      this.labelSize,
      this.maxLength,
      this.outlined = false,
      this.password = false,
      this.prefix,
      this.prefixColor,
      this.readOnly = false,
      this.suffix,
      this.suffixColor,
      this.suffixSize,
      this.keyboardType,
      this.margin,
      this.labelText,
      this.prefixSize,
      this.labelColor,
      this.onBlur,
      this.onFocus,
      this.context}) {
    focusnode.addListener(() async {
      if (focusnode.hasFocus) {
        await this.onFocus();
      } else {
        await this.onBlur();
      }
    });
  }

  TextEditingController controller = new TextEditingController();
  FocusNode focusnode = new FocusNode();
  BuildContext context;
  String _text = '';
  String margin = '0';
  String labelText = '';
  String hintText = '';
  String align = 'null';
  String prefix = '';
  String suffix = '';
  double size = 13.0;
  double labelSize = 13.0;
  double prefixSize = 13.0;
  double suffixSize = 13.0;
  double iconSize = 25;
  Color color = null;
  Color prefixColor = null;
  Color suffixColor = null;
  Color bgColor = null;
  Color labelColor = null;
  Color iconColor = null;
  Color cursorColor = null;
  Color borderColor = null;
  Color borderFocusedColor = null;
  Color borderDisableColor = null;
  bool outlined = false;
  bool readOnly = false;
  bool password = false;
  bool autocorrect = false;
  bool enabled = true;
  bool hide = false;
  String value = null;
  List<String> values = [];
  TextInputType keyboardType = null;
  IconData icon = null;
  int maxLength = null;
  int maxLine = null;
  String weight = null;
  var font = null;
  bool _isTextAlign = true;
  Function onBlur;
  Function onFocus;

  void set text(String val) {
    this._text = val;
    this.controller.text = val;
  }

  String get text {
    return this._text;
  }

  getWeight() {
    switch (this.weight) {
      case 'normal':
        return FontWeight.normal;
      case 'bold':
        return FontWeight.bold;
      case 'w100':
        return FontWeight.w100;
      case 'w200':
        return FontWeight.w200;
      case 'w300':
        return FontWeight.w300;
      case 'w400':
        return FontWeight.w400;
      case 'w500':
        return FontWeight.w500;
      case 'w600':
        return FontWeight.w600;
      case 'w700':
        return FontWeight.w700;
      case 'w800':
        return FontWeight.w800;
      case 'w900':
        return FontWeight.w900;
      default:
        return FontWeight.normal;
    }
  }
}

class DividerProp {
  Color color = null;
  double height = 16;
  double thickness = 1;
  double indent = 0;
  double endIndent = 0;
  bool hide = false;
  BuildContext context;

  DividerProp({
    this.color,
    this.hide,
    this.height,
    this.endIndent,
    this.indent,
    this.thickness,
    this.context,
  });
}

class ToggleProp with Paddinator {
  Color color = null;
  Color bgColor = null;
  Color activeColor = null;
  String text = "Toggle text";
  double size = 14.0;
  int maxLine = 1;
  bool state = false;
  bool hide = false;
  bool enabled = false;
  Function onChanged;
  String padding;
  BuildContext context;

  ToggleProp({
    this.color,
    this.hide,
    this.state,
    this.text,
    this.maxLine,
    this.size,
    this.bgColor,
    this.enabled,
    this.padding,
    this.activeColor,
    this.onChanged,
    this.context,
  });
}

class NavProp {
  Color bgColor = null;
  Color color = null;
  Color unselectedItemColor = Colors.grey;
  int index = 0;
  BuildContext context;
  List<BottomNavigationBarItem> items = [];
  bool hide = false;

  NavProp({
    this.bgColor,
    this.color,
    this.index,
    this.unselectedItemColor,
    this.items,
    this.hide,
    this.context,
  });
}

class DropdownProp with Paddinator {
  Color color = null;
  Color iconColor = null;
  Color trailingColor = null;
  Color modalColor = null;
  Color modalBgColor = null;
  String padding = "0";
  String title = "Title";
  String hint = "";
  String modalTitle = "Modal title";
  String placeholder = "Choose";
  bool hide = false;
  bool enabled = false;
  bool isLoading = false;
  bool isTwoLine = false;
  bool multiple = false;
  bool searchable = false;
  Function onChanged;
  List<Map> options = [];
  double iconSize = 24;
  var value = null;
  List<String> values = [];

  double trailingSize = 24;

  double width = null;

  IconData icon = Icons.person;
  IconData trailing = Icons.arrow_forward_ios;

  List<S2Choice<String>> getOptions() {
    List<S2Choice<String>> result = [];
    this.options.forEach((item) {
      result.add(
        S2Choice<String>(
          value: item['value'],
          title: item['title'],
        ),
      );
    });
    return result;
  }

  BuildContext context;

  DropdownProp({
    this.options,
    this.enabled,
    this.color,
    this.hide,
    this.onChanged,
    this.padding,
    this.multiple,
    this.title,
    this.width,
    this.icon,
    this.iconSize,
    this.iconColor,
    this.hint,
    this.isLoading,
    this.isTwoLine,
    this.modalBgColor,
    this.modalColor,
    this.modalTitle,
    this.placeholder,
    this.searchable,
    this.trailing,
    this.trailingColor,
    this.trailingSize,
    this.value,
    this.values,
    this.context,
  });
}
