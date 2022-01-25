const { net } = require('electron');
const events = require('events');
const https = require("https");
const http = require("http");

const eventEmitter = new events.EventEmitter();

function readSessionIds(res, ) {
  const chunks = [];

  if(res.statusCode === 200) {
    try {
      res.on("data", function (chunk) {
        chunks.push(chunk);
        //console.log(chunk.toString());
      });

      res.on("end", function() {
        const body = Buffer.concat(chunks);
        const objResult = JSON.parse(body);
        // console.log(objResult);

        const valueArray = objResult.value;
        const sessionArray = [];
        for (let i = 0; i < valueArray.length; i++) {
          const oneSession = valueArray[i];
          sessionArray.push(oneSession.id);
        }

        if(valueArray.length === 0) {
          eventEmitter.emit('generalError', 'No session found');
        }
        eventEmitter.emit('updateSessionIds', sessionArray);
      });
    }
    catch (e) {
      eventEmitter.emit('generalError', 'No session found');
    }

  } else {
    eventEmitter.emit('generalError', 'Network error');
  }
}

function requestSessionIds(appiumUrl) {
  if(appiumUrl.endsWith("/")) {
    appiumUrl = appiumUrl.slice(0, -1);
  }

  const imageUrl = new URL(appiumUrl + "/sessions");

  let req;
  try {
    if(imageUrl.protocol === "http:") {
      req = http.get(imageUrl, readSessionIds);
    } else if(imageUrl.protocol === "https:") {
      req = https.get(imageUrl, readSessionIds);
    }

    req.end();
  } catch (e) {
    eventEmitter.emit('generalError', 'Network error');
  }

}

const sessionReader = {
  getSessionIds: function (appiumUrl,
                           updateSessionIds,
                           callbackOnError) {
    //console.log(appiumUrl);
    requestSessionIds(appiumUrl);

    eventEmitter.removeAllListeners();

    eventEmitter.on('updateSessionIds', function (result) {
      //console.log(result);
      updateSessionIds(result);
    })

    eventEmitter.on('generalError', function (errorMessage) {
      callbackOnError(errorMessage);
    });
  }
};

module.exports = sessionReader;
