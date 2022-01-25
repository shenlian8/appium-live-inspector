const { net } = require('electron');
const events = require('events');
const https = require("https");
const http = require("http");

const eventEmitter = new events.EventEmitter();

const getImageFile = function(res, ) {

  const chunks = [];

  if(res.statusCode == 200) {
    res.on("data", function (chunk) {
      chunks.push(chunk);
      //console.log(chunk.toString());
    });

    res.on("end", function() {
      const body = Buffer.concat(chunks);
      const objResult = JSON.parse(body);
      // console.log(objResult);

      eventEmitter.emit('loadImageFinish', objResult);
    });
  } else {
    eventEmitter.emit('networkError', 'Network error');
  }
};

const getImage = function (appiumUrl) {
  const imageUrl = new URL(appiumUrl + "/screenshot");

  let req;
  try {
    if (imageUrl.protocol === "http:") {

      req = http.get(imageUrl, getImageFile);

    } else if (imageUrl.protocol === "https:") {

      req = https.get(imageUrl, getImageFile);

    }

    req.end();
  } catch (e) {
    eventEmitter.emit('generalError', 'Network error');
  }
};

const appiumRequester = {
  requestAppium: function (appiumUrl,
                           callbackUpdateImage,
                           callbackUpdateElementView,
                           callbackUpdateTreeView,
                           callbackOnError) {

    // console.log(appiumUrl);

    getImage(appiumUrl);

    eventEmitter.removeAllListeners();

    eventEmitter.on('loadImageFinish', function (result) {
      // start request page source
    })

    // all call backs to render
    eventEmitter.on('loadImageFinish', function (result) {
      // console.log(result);
      callbackUpdateImage(result);
    })

    eventEmitter.on('updateElementView', function (result) {
      //console.log(result);
      callbackUpdateElementView(result);
    })

    eventEmitter.on('updateTreeView', function (result) {
      //console.log(result);
      callbackUpdateTreeView(result);
    })

    eventEmitter.on('generalError', function (errorMessage) {
      callbackOnError(errorMessage);
    });
  }
};

module.exports = appiumRequester;
