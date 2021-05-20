let html2canvas = require('html2canvas');
let getScreenshotOfElement = function (element, posX, posY, width, height, callback) {
    html2canvas(element, {
        onrendered: function (canvas) {
            var context = canvas.getContext('2d');
            var imageData = context.getImageData(posX, posY, width, height).data;
            var outputCanvas = document.createElement('canvas');
            var outputContext = outputCanvas.getContext('2d');
            outputCanvas.width = width;
            outputCanvas.height = height;

            var idata = outputContext.createImageData(width, height);
            idata.data.set(imageData);
            outputContext.putImageData(idata, 0, 0);
            callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        },
        width: width,
        height: height,
        useCORS: true,
        taintTest: false,
        allowTaint: false
    });
}

let takeScreenShot = function (id, w, h, x = 0, y = 0) {
    getScreenshotOfElement(document.querySelector(id), x, y, w, h, function (data) {
        // in the data variable there is the base64 image
        // exmaple for displaying the image in an <img>
        return "data:image/png;base64," + data;
    });
};

/**
 * clone new object for reuse variable
 * @param obj
 * @returns {any}
 */
let clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * get color from color list array
 * @param color
 * @returns {string|*}
 */
let getColor = function (color) {
    for( const clr of window.colors) {
      if (clr.value === color){
          return clr.color;
      }
    }
    return '#000000';

};
/**
 * convert flutter color to web color
 * @param color
 * @param isActiveWidget
 * @returns {string|*}
 */
let color2web = function (color,isActiveWidget = true) {
  if( color === 'default' ){
      if ( isActiveWidget){
          return getColor(window.appData.project.xColor);
      } else {
          if (window.appData.project.isDark){
              return "#222222";
          }
      }
      return getColor(window.appData.project.xColor);
  }else{
      return getColor(color);
  }
};

let calcPadding = function (paddingValue,scale = 1,invert = false) {
  let calced = paddingValue.split(',');
  let result ='';
  for( const c of calced) {
    result += (parseFloat(c)*scale*(invert?-1:1)).toString()+'px ';
  }
  return result;
}

/**
 * for export
 */
let fnc = {
    clone,
    takeScreenShot,
    color2web,
    calcPadding
}
export {
    fnc
}
