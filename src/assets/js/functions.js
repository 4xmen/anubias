var html2canvas = require('html2canvas');
var getScreenshotOfElement = function (element, posX, posY, width, height, callback) {
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

var takeScreenShot = function (id, w, h, x = 0, y = 0) {
    getScreenshotOfElement(document.querySelector(id), x, y, w, h, function (data) {
        // in the data variable there is the base64 image
        // exmaple for displaying the image in an <img>
        return "data:image/png;base64," + data;
    });
};

var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

var fnc = {
    clone,
    takeScreenShot
}
export {
    fnc
}
