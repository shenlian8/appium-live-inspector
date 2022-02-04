const events = require('events');
const https = require("https");
const http = require("http");
const parser = require('fast-xml-parser');

let elementList = [];
let hierarchyInfo = {};
let elementId = 0;

const eventEmitter = new events.EventEmitter();

// ########## screenshot ##########
const getImageFile = function(res, ) {

  const chunks = [];

  if(res.statusCode === 200) {
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
    eventEmitter.emit('generalError', 'Network error');
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
// ########## end screenshot ##########

// ########## tree view and element view ##########
const getPageSource = function (appiumUrl) {
  const pageSourceUrl = new URL(appiumUrl + "/source");

  let req;
  try {
    if (pageSourceUrl.protocol === "http:") {

      req = http.get(pageSourceUrl, readPageSource);

    } else if (pageSourceUrl.protocol === "https:") {

      req = https.get(pageSourceUrl, readPageSource);

    }

    req.end();
  } catch (e) {
    eventEmitter.emit('generalError', 'Network error');
  }

  req.end();
}

const convertXmlToJson = function(xmlData) {
  const options = {
    attributeNamePrefix: "",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true
  };
  let jsonObj = {};

  if( parser.validate(xmlData) === true) {
    jsonObj = parser.parse(xmlData, options);
  } else {
    eventEmitter.emit('generalError', 'Not valid XML');
  }

  return jsonObj;
};
const getElementView = function(node, treeNode, nodeName) {

  let key;
  treeNode.label = nodeName;

  let oneAttr = {};
  if("attr" in node) {

    const elementAttr = [];
    for(key in node.attr) {
      elementAttr.push({
        "key": key,
        "value": node.attr[key]
      });
    }

    // const boundStyle = "left:" + bLeft + "px;top:" + bTop + "px;width:" + bWidth + "px;height:" + bHeight + "px;"
    const boundStyle = "";
    // console.log(boundStyle);

    if("bounds" in node.attr) {
      // android
      let boundsValue = node.attr.bounds;
      boundsValue = boundsValue.replace("][", ",");
      boundsValue = boundsValue.replace("[", "");
      boundsValue = boundsValue.replace("]", "");
      const boundsArray = boundsValue.split(",");
      const bLeft = boundsArray[0];
      const bTop = boundsArray[1];
      const bWidth = boundsArray[2] - boundsArray[0] - 1;
      const bHeight = boundsArray[3] - boundsArray[1] - 1;

      oneAttr = {
        "id": elementId,
        "boundStyle": boundStyle,
        "attr": elementAttr,
        "left": bLeft,
        "top": bTop,
        "width": bWidth,
        "height": bHeight
      };
    } else if("x" in node.attr) {
      // ios
      oneAttr = {
        "id": elementId,
        "boundStyle": boundStyle,
        "attr": elementAttr,
        "left": node.attr.x,
        "top": node.attr.y,
        "width": node.attr.width,
        "height": node.attr.height
      };
    }

    if("class" in node.attr) {
      treeNode.label = node.attr.class;
    } else if("type" in node.attr) {
      treeNode.label = node.attr.type;
    }
    if("label" in node.attr) {
      treeNode.label = node.attr.label === "" ? treeNode.label : node.attr.label;
    }
    if("name" in node.attr) {
      treeNode.label = node.attr.name === "" ? treeNode.label : node.attr.name;
    }
    if("value" in node.attr) {
      treeNode.label = node.attr.value === "" ? treeNode.label : node.attr.value;
    }
    if("text" in node.attr) {
      treeNode.label = node.attr.text === "" ? treeNode.label : node.attr.text;
    }
  }
  elementList.push(oneAttr);

  treeNode.id = elementId;
  elementId ++;

  const children = [];
  for(key in node) {
    if(key !== "attr" && key !== "__proto__" && isNaN(key)) {

      if(node[key].length > 0) {
        for(let index = 0; index < node[key].length; index ++) {
          children.push({});
          getElementView(node[key][index], children[children.length - 1], key);
        }
      } else {
        children.push({});
        getElementView(node[key], children[children.length - 1], key);
      }
    }
  }

  if(children.length > 0) {
    treeNode.children = children;
  }
};
const readPageSource = function(res) {

  const chunks = [];

  if(res.statusCode === 200) {
    res.on("data", function (chunk) {
      chunks.push(chunk);
      // console.log(chunk.toString());
    });

    res.on("end", function() {
      let treeData;
      let treeView;
      let hierarchyData;
      const body = Buffer.concat(chunks);
      const objResult = JSON.parse(body);

      const oriPageSource = convertXmlToJson(objResult.value);
      // console.dir(oriPageSource, {depth: null, colors: true})

      // android
      if("hierarchy" in oriPageSource) {
        hierarchyData = oriPageSource.hierarchy;
        hierarchyInfo = hierarchyData.attr;

        treeView = [];
        treeData = {};
        getElementView(hierarchyData, treeData, hierarchyInfo.class);
        treeView.push(treeData);
      }

      // ios
      if("AppiumAUT" in oriPageSource) {
        hierarchyData = oriPageSource.AppiumAUT.XCUIElementTypeApplication;
        hierarchyInfo = hierarchyData.attr;

        treeView = [];
        treeData = {};

        getElementView(hierarchyData, treeData, hierarchyInfo.type);
        treeView.push(treeData);
      }

      eventEmitter.emit('loadElementViewFinish', elementList);
      eventEmitter.emit('loadTreeVieewFinish', treeView);
    });
  } else {
    eventEmitter.emit('generalError', 'Network error');
  }
}

// ########## end tree view and element view ##########
const appiumRequester = {
  requestAppium: function (appiumUrl,
                           callbackUpdateImage,
                           callbackUpdateElementView,
                           callbackUpdateTreeView,
                           callbackOnError) {

    elementList = [];
    hierarchyInfo = {};
    elementId = 0;

    // start first loading the screenshot. We need the image first be rendered.
    // after render the image, we know the width of the image and the elements can be scaled to fit the image.
    getImage(appiumUrl);

    eventEmitter.removeAllListeners();

    // after the screenshot image is loaded
    eventEmitter.on('loadImageFinish', function () {
      // start request page source
      getPageSource(appiumUrl);
    })

    // all call backs to render

    // after the screenshot image is loaded
    eventEmitter.on('loadImageFinish', function (result) {
      // console.log(result);
      callbackUpdateImage(result);
    })

    // after element view is finished
    eventEmitter.on('loadElementViewFinish', function (result) {
      // console.dir(result, {depth: null, colors: true})
      callbackUpdateElementView(result);
    })

    // after tree view is finished
    eventEmitter.on('loadTreeVieewFinish', function (result) {
      // console.dir(result, {depth: null, colors: true})
      callbackUpdateTreeView(result);
    })

    // on any error
    eventEmitter.on('generalError', function (errorMessage) {
      callbackOnError(errorMessage);
    });
  }
};

module.exports = appiumRequester;
