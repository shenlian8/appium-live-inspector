<template>
  <q-scroll-area class="col q-pa-sm"
                 @dragover.prevent
                 @drop.prevent="handleDrop">
    <img id="screen-image" :src="'data:image/png;base64, ' + imgData.value" style="width: 100%; object-fit: scale-down;" alt=""/>
    <div id="element-overlay" style="width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;">
      <div v-for="element in elements"
           :id="element.id"
           :key="element.id"
           :style="element.boundStyle"
           v-on:click="triggerElementSelected"
           class="element-frame">
      </div>
    </div>
  </q-scroll-area>
</template>
<style>
.element-frame {
  position: absolute;
  border: 1px dashed rgba(0,255,0,.5);
}
.element-frame:hover {
  border: 1px solid rgba(0,255,0,1);
}
.element-frame-selected {
  position: absolute;
  border: 1px solid green;
  background-color: rgba(154,205,50,.3);
}
</style>
<script>
import mitt from 'mitt'
import * as parser from 'fast-xml-parser'
import { Notify } from 'quasar'
window.mitt = window.mitt || new mitt()

const base64Jpeg = {"sessionId":"","value":"R0lGODlhAQABAAAAACwAAAAAAQABAAA="};
let localTickedList = [];

export default {
  name: "ScreenView",
  data() {
    return {
      imgData: base64Jpeg,
      elements: [],
      oriElements: [],
      selectedId: null
    }
  },
  methods: {
    parseXmlToData: function(xmlText) {
      const options = {
        attributeNamePrefix: "",
        attrNodeName: "attr",
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true
      };

      if (parser.validate(xmlText) !== true) {
        return { elements: [], treeView: [] };
      }

      const jsonObj = parser.parse(xmlText, options);

      let elementId = 0;
      const elementList = [];
      const buildTree = (node, treeNode, nodeName, parentId) => {
        let key;
        treeNode.label = nodeName;

        let oneAttr = {};
        if ("attr" in node) {
          const elementAttr = [];
          for (key in node.attr) {
            elementAttr.push({
              key: key,
              value: node.attr[key]
            });
          }

          const boundStyle = "";

          if ("bounds" in node.attr) {
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
              id: elementId,
              boundStyle: boundStyle,
              attr: elementAttr,
              left: bLeft,
              top: bTop,
              width: bWidth,
              height: bHeight
            };
          } else if ("x" in node.attr) {
            oneAttr = {
              id: elementId,
              boundStyle: boundStyle,
              attr: elementAttr,
              left: node.attr.x,
              top: node.attr.y,
              width: node.attr.width,
              height: node.attr.height
            };
          }

          if ("class" in node.attr) {
            treeNode.label = node.attr.class;
          } else if ("type" in node.attr) {
            treeNode.label = node.attr.type;
          }
          if ("label" in node.attr) {
            treeNode.label = node.attr.label === "" ? treeNode.label : node.attr.label;
          }
          if ("name" in node.attr) {
            treeNode.label = node.attr.name === "" ? treeNode.label : node.attr.name;
          }
          if ("value" in node.attr) {
            treeNode.label = node.attr.value === "" ? treeNode.label : node.attr.value;
          }
          if ("text" in node.attr) {
            treeNode.label = node.attr.text === "" ? treeNode.label : node.attr.text;
          }
        }
        elementList.push(oneAttr);

        treeNode.id = elementId;
        treeNode.parentId = parentId;
        elementId++;

        const children = [];
        for (key in node) {
          if (key !== "attr" && key !== "__proto__" && isNaN(key)) {
            if (node[key].length > 0) {
              for (let index = 0; index < node[key].length; index++) {
                children.push({});
                buildTree(node[key][index], children[children.length - 1], key, treeNode.id);
              }
            } else {
              children.push({});
              buildTree(node[key], children[children.length - 1], key, treeNode.id);
            }
          }
        }

        if (children.length > 0) {
          treeNode.children = children;
        }
      };

      let treeView = [];
      let treeData = {};

      if ("hierarchy" in jsonObj) {
        const hierarchyData = jsonObj.hierarchy;
        const hierarchyInfo = hierarchyData.attr;
        buildTree(hierarchyData, treeData, hierarchyInfo.class, null);
        treeView = [treeData];
      } else if ("AppiumAUT" in jsonObj && jsonObj.AppiumAUT.XCUIElementTypeApplication) {
        const hierarchyData = jsonObj.AppiumAUT.XCUIElementTypeApplication;
        const hierarchyInfo = hierarchyData.attr;
        buildTree(hierarchyData, treeData, hierarchyInfo.type, null);
        treeView = [treeData];
      }

      return { elements: elementList, treeView };
    },
    handleDrop: function(event) {
      const files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : [];
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];
      if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || '');
          const base64Index = result.indexOf('base64,');
          const base64 = base64Index >= 0 ? result.slice(base64Index + 7) : '';
          if (base64) {
            this.imgData = { sessionId: 'local', value: base64 };
            this.oriElements = [];
            this.elements = [];
            window.mitt.emit('Element view data', []);
            window.mitt.emit('Tree view data', []);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      if (file.name && file.name.toLowerCase().endsWith('.xml')) {
        const reader = new FileReader();
        reader.onload = () => {
          const xmlText = String(reader.result || '');
          const parsed = this.parseXmlToData(xmlText);
          if (parsed.elements.length === 0 || parsed.treeView.length === 0) {
            Notify.create({
              message: 'XML format not recognized',
              color: 'orange'
            });
            return;
          }
          this.oriElements = parsed.elements;
          this.renderElements();
          window.mitt.emit('Element view data', parsed.elements);
          window.mitt.emit('Tree view data', parsed.treeView);
        };
        reader.readAsText(file);
        return;
      }
    },
    renderElements: function() {
      this.elements = JSON.parse(JSON.stringify(this.oriElements));

      const imgClientWidth = document.getElementById("screen-image").clientWidth;
      let imgNaturalWidth = document.getElementById("screen-image").naturalWidth;

      if(this.elements.length > 0) {
        if("width" in this.elements[0]) {
          imgNaturalWidth = this.elements[0].width
        }
      }
      for(let index = 0; index < this.elements.length; index ++) {
        let oneElement;
        oneElement = this.elements[index];
        if(localTickedList.length === 0 || localTickedList.includes(oneElement.id)) {
          oneElement.left = oneElement.left * imgClientWidth / imgNaturalWidth;
          oneElement.top = oneElement.top * imgClientWidth / imgNaturalWidth;
          oneElement.width = oneElement.width * imgClientWidth / imgNaturalWidth;
          oneElement.height = oneElement.height * imgClientWidth / imgNaturalWidth;
          oneElement.boundStyle = "left:" + oneElement.left + "px;top:" + oneElement.top + "px;width:" + oneElement.width + "px;height:" + oneElement.height + "px;";
        } else {
          oneElement.left = 0;
          oneElement.top = 0;
          oneElement.width = 0;
          oneElement.height = 0;
          oneElement.boundStyle = "";
        }
      }
    },
    triggerElementSelected: function(event) {
      window.mitt.emit("Element selected", event.currentTarget.id);
    },
    markElement: function(id) {
      if(this.selectedId != null) {
        if(document.getElementById(this.selectedId) != null) {
          document.getElementById(this.selectedId).className = "element-frame";
        }
      }
      if(document.getElementById(id) != null) {
        document.getElementById(id).className = "element-frame-selected";
      }
      this.selectedId = id;
    }
  },
  created: function() {
    window.addEventListener("resize", this.renderElements);
    this._dragoverHandler = (event) => event.preventDefault();
    this._dropHandler = (event) => event.preventDefault();
    window.addEventListener("dragover", this._dragoverHandler);
    window.addEventListener("drop", this._dropHandler);

    window.myApi.receive("updateImage", (data) => {
      this.imgData = data;
    });

    window.myApi.receive("updateElementView", (data) => {
      localTickedList = [];
      this.oriElements = data;
      this.renderElements();
      window.mitt.emit('Element view data', data);
    });

    window.mitt.on('Element selected', (elementId) => {
      this.markElement(elementId);
    });

    window.mitt.on('Tree ticked', (allTickedList) => {
      localTickedList = allTickedList;
      this.renderElements();
      localTickedList = [];
    });
  },
  beforeUnmount: function() {
    window.removeEventListener("resize", this.renderElements);
    if (this._dragoverHandler) {
      window.removeEventListener("dragover", this._dragoverHandler);
    }
    if (this._dropHandler) {
      window.removeEventListener("drop", this._dropHandler);
    }
  }
}
</script>
