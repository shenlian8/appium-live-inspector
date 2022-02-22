<template>
  <q-scroll-area class="col q-pa-sm">
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
window.mitt = window.mitt || new mitt()

const base64Jpeg = {"sessionId":"","value":"R0lGODlhAQABAAAAACwAAAAAAQABAAA="};

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
        oneElement.left = oneElement.left * imgClientWidth / imgNaturalWidth;
        oneElement.top = oneElement.top * imgClientWidth / imgNaturalWidth;
        oneElement.width = oneElement.width * imgClientWidth / imgNaturalWidth;
        oneElement.height = oneElement.height * imgClientWidth / imgNaturalWidth;
        oneElement.boundStyle = "left:" + oneElement.left + "px;top:" + oneElement.top + "px;width:" + oneElement.width + "px;height:" + oneElement.height + "px;";
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

    window.myApi.receive("updateImage", (data) => {
      this.imgData = data;
    });

    window.myApi.receive("updateElementView", (data) => {
      this.oriElements = data;
      this.renderElements();
    });

    window.mitt.on('Element selected', (elementId) => {
      this.markElement(elementId);
    });
  }
}
</script>
