import 'package:flutter/material.dart';
import '../fnc/general.dart';
class Page2 extends StatefulWidget {
  // MyHomePage({Key key, this.title}) : super(key: key);
  //
  //
  // final String title;

  @override
  _Page2State createState() => _Page2State();
}


AppBarProps appbar = new AppBarProps(
  title: 'test',
  color: null,
  textColor: null,
  hide: false,
  back: false,
  actions: [],
  menu: [],
);
TextProps text1 = new TextProps(
    text:
    'Hello world, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus amet ea expedita itaque minima minus, modi quae quas recusandae saepe velit, vero. Aliquam at consequuntur facere inventore numquam vero voluptatibus.',
    height: 1.5,
    color: null,
    hide: false,
    softWrap: true,
    align: null,
    font: null,
    maxLine: 0,
    overflow: null,
    size: 15,
    weight: 'normal');
bool testbool = true;
ImageProp image1 = new ImageProp(
  padding: '15,90',
  hide: false,
  align: 'center',
  width: null,
  height: null,
  isOnline: true,
  fit: 'cover',
  image:
  'https://avatars.githubusercontent.com/u/9222481',
);
ButtonProp button1 = new ButtonProp(
  height: null,
  width: null,
  size: 15,
  icon: Icons.mood,
  text: 'Hello world',
  padding: '0',
  hide: false,
  color: null,
  bgColor: null,
  borderRadius: '15,2,15,15',
  noIcon: false,
  noText: false,
);

ContainerProp cont1 = ContainerProp(
    hide: false,
    borderRadius: '7,75',
    border: '5',
    bgColor: Colors.amber,
    borderColor: Colors.green,
    padding: '15,20',
    width: null,
    height: 150,
    margin: '15,20'
);

RowProp row1 = new RowProp(
    hide: false,
    scrollable: false,
    axis: MainAxisAlignment.spaceAround,
    children: [
      Text('txt1'),
      Text('txt2'),
      Text('txt2'),
      Text('txt4'),
    ]

);


/***property-class***/
DividerProp divider1 = new DividerProp(
  color: Colors.white,
  hide: false,
  thickness: 1,
  height: 16,
  endIndent: 0,
  indent: 0,
);

ToggleProp toggle1 = new ToggleProp(
  hide: false,
  color: Colors.red,
  activeColor: Colors.yellow,
  bgColor: Colors.blue,
  maxLine: 1,
  text: "hello",
  padding: "0",
  size: 14,
  enabled: true,
  state: false,
);

DropdownProp dropdown1 = new DropdownProp(
  trailingSize: 14,
  trailingColor: Colors.red,
  title: "title her",
  placeholder: "ch",
  padding: "0",
  modalTitle: "modal",
  hint: "",
  hide: false,
  isTwoLine: false,
  searchable: false,
  multiple: false,
  isLoading: false,
  enabled: true,
  modalColor: Colors.white,
  modalBgColor: null,
  iconColor: Colors.orange,
  color: Colors.blue,
  iconSize: 24,
  options: [
    {"title": "title1", "value": "1"},
    {"title": "title2", "value": "2"},
    {"title": "title3", "value": "3"},
    {"title": "title4", "value": "4"},
  ],
  width: null,
  trailing: Icons.arrow_forward_ios,
  icon: Icons.person,
  value: null,
  values: [],
);

class _Page2State extends State<Page2> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'hello world',
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.only(
            top: 25,
            right: 26,
            bottom: 27,
            left: 28,
          ),
          child: Column(
            children: [
              /*start-preloader1*/
              Offstage(
                offstage: preloader1.hide,
                child: Container(
                  alignment: Alignment.center,
                  padding: preloader1.getPadding(),
                  child: SizedBox(
                    height: preloader1.width,
                    width: preloader1.height,
                    child: CircularProgressIndicator(
                      valueColor:
                          AlwaysStoppedAnimation<Color>(preloader1.color),
                    ),
                  ),
                ),
              ),
              /*end-preloader1*/
              Offstage(
                offstage: dropdown1.hide,
                child: Container(
                  padding: dropdown1.getPadding(),
                  width: MediaQuery.of(context).size.width,
                  child: dropdown1.multiple
                      ? SmartSelect<String>.multiple(
                    placeholder: dropdown1.placeholder,
                    title: dropdown1.title,
                    value: dropdown1.values,
                    modalTitle: dropdown1.value,
                    modalStyle: S2ModalStyle(
                      backgroundColor: dropdown1.modalBgColor == null
                          ? app.isDark()
                          ? Colors.grey
                          : null
                          : dropdown1.modalBgColor,
                    ),
                    modalFilter: dropdown1.searchable,
                    modalHeaderStyle: S2ModalHeaderStyle(
                      backgroundColor: Theme.of(context).primaryColor,
                      textStyle: TextStyle(
                        color: dropdown1.modalColor,
                      ),
                      actionsIconTheme: IconThemeData(
                        color: dropdown1.modalColor,
                      ),
                      iconTheme: IconThemeData(
                        color: dropdown1.modalColor,
                      ),
                    ),
                    choiceItems: dropdown1.getOptions(),
                    onChange: (state) => setState(() {
                      dropdown1.values = state.value;
                    }),
                    tileBuilder: (context, state) {
                      return S2Tile.fromState(
                        state,
                        isTwoLine: dropdown1.isTwoLine,
                        isLoading: dropdown1.isLoading,
                        trailing: Icon(
                          dropdown1.trailing,
                          color: dropdown1.trailingColor,
                          size: dropdown1.trailingSize,
                        ),
                        title: Text(
                          dropdown1.title,
                          style: TextStyle(color: dropdown1.color),
                        ),
                        enabled: dropdown1.enabled,
                        body: dropdown1.hint.trim().length == 0
                            ? null
                            : Text(dropdown1.hint),
                        leading: Icon(
                          dropdown1.icon,
                          size: dropdown1.iconSize,
                          color: dropdown1.iconColor,
                        ),
                      );
                    },
                  )
                      : SmartSelect<String>.single(
                    placeholder: dropdown1.placeholder,
                    title: dropdown1.title,
                    value: dropdown1.value,
                    modalTitle: dropdown1.value,
                    modalStyle: S2ModalStyle(
                      backgroundColor: dropdown1.modalBgColor == null
                          ? app.isDark()
                          ? Colors.grey
                          : null
                          : dropdown1.modalBgColor,
                    ),
                    modalFilter: dropdown1.searchable,
                    modalHeaderStyle: S2ModalHeaderStyle(
                      backgroundColor: Theme.of(context).primaryColor,
                      textStyle: TextStyle(
                        color: dropdown1.modalColor,
                      ),
                      actionsIconTheme: IconThemeData(
                        color: dropdown1.modalColor,
                      ),
                      iconTheme: IconThemeData(
                        color: dropdown1.modalColor,
                      ),
                    ),
                    choiceItems: dropdown1.getOptions(),
                    onChange: (state) => setState(() {
                      dropdown1.value = state.value;
                    }),
                    tileBuilder: (context, state) {
                      return S2Tile.fromState(
                        state,
                        isTwoLine: dropdown1.isTwoLine,
                        isLoading: dropdown1.isLoading,
                        trailing: Icon(
                          dropdown1.trailing,
                          color: dropdown1.trailingColor,
                          size: dropdown1.trailingSize,
                        ),
                        title: Text(
                          dropdown1.title,
                          style: TextStyle(color: dropdown1.color),
                        ),
                        enabled: dropdown1.enabled,
                        body: dropdown1.hint.trim().length == 0
                            ? null
                            : Text(dropdown1.hint),
                        leading: Icon(
                          dropdown1.icon,
                          size: dropdown1.iconSize,
                          color: dropdown1.iconColor,
                        ),
                      );
                    },
                  ),
                ),
              ),
              Offstage(
                offstage: toggle1.hide,
                child: Container(
                  padding: toggle1.getPadding(),
                  color: toggle1.bgColor,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        toggle1.text,
                        maxLines: toggle1.maxLine,
                        style: TextStyle(
                          color: toggle1.color,
                          fontSize: toggle1.size,
                        ),
                      ),
                      Switch(
                        // activeColor: Colors.yellow,
                          value: toggle1.state,
                          onChanged: (state) {
                            setState(() {
                              if (toggle1.enabled) {
                                toggle1.state = state;
                              }
                            });
                          })
                    ],
                  ),
                ),
              ),
              Offstage(
                offstage: text1.hide,
                child: Text(
                  text1.text,
                  textAlign: text1.getAlign(),
                  maxLines: text1.getMaxLine(),
                  overflow: text1.getOverflow(),
                  softWrap: text1.softWrap,
                  style: TextStyle(
                    fontSize: text1.size,
                    color: text1.color,
                    height: text1.height,
                    fontWeight: text1.getWeight(),
                  ),
                ),
              ),
              Offstage(
                offstage: image1.hide,
                child: Container(
                  alignment: image1.getAlign(),
                  padding: image1.getPadding(),
                  child: !image1.isOnline
                      ? Image.memory(
                    image1.getImage(),
                    width: image1.width,
                    height: image1.height,
                    fit: image1.getFit(),
                  )
                      : Image.network(
                    'https://avatars.githubusercontent.com/u/9222481',
                    width: image1.width,
                    height: image1.height,
                    fit: image1.getFit(),
                  ),
                ),
              ),
              Offstage(
                offstage: icon1.hide,
                child: Container(
                  alignment: icon1.getAlign(),
                  padding: icon1.getPadding(),
                  child: Icon(
                    icon1.icon,
                    size: icon1.size,
                    color: icon1.color,
                  ),
                ),
              ),
              Offstage(
                offstage: button1.hide,
                child: ElevatedButton(
                  style: ButtonStyle(
                    shape: MaterialStateProperty.all(
                      RoundedRectangleBorder(
                        borderRadius: button1.getBorderRadius(),
                      ),
                    ),
                    backgroundColor:
                    MaterialStateProperty.all<Color>(button1.bgColor),
                    padding: MaterialStateProperty.all<EdgeInsets>(
                        button1.getPadding()),
                  ),
                  child: Container(
                      width: button1.width,
                      height: button1.height,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            button1.icon,
                            size: button1.size * 1.4,
                            color: button1.color,
                          ),
                          Text(
                            button1.text,
                            style: TextStyle(
                              color: button1.color,
                              fontSize: button1.size,
                            ),
                          ),
                        ],
                      )),
                  onPressed: () {
                    //
                  },
                  onLongPress: () {
                    //
                  },
                ),
              ),
              Text('Hello world'),
              Offstage(
                offstage: cont1.hide,
                child: Container(
                  width: cont1.width == null? MediaQuery.of(context).size.width: cont1.width,
                  height: cont1.height,
                  padding: cont1.getPadding(),
                  margin: cont1.getMargin(),
                  decoration: BoxDecoration(
                    border: cont1.border.indexOf(',') == -1?
                    Border.all(
                      color: cont1.borderColor,
                      width: double.parse(cont1.border),
                    ):null,
                    color: Colors.orange,
                    boxShadow:cont1.border.indexOf(',') == -1? null: cont1.getBorder(),
                    borderRadius: cont1.getBorderRadius(),
                  ),
                  child: Text('text'),
                ),
              ),
              Offstage(
                offstage: row1.hide,
                child: SingleChildScrollView(
                  scrollDirection: row1.scrollable ? Axis.horizontal : Axis.vertical,
                  child: Row(
                    mainAxisAlignment: row1.axis,
                    children: row1.children ,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

