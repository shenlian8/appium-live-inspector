<template>
  <img id="screen-image" :src="'data:image/png;base64, ' + imgData.value" style="width: 100%; object-fit: scale-down;"/>

</template>

<script>
const base64Jpeg = {"sessionId":"","value":"R0lGODlhAQABAAAAACwAAAAAAQABAAA="};

export default {
  name: "ScreenView",
  data() {
    return {
      imgData: base64Jpeg
    }
  },
  mounted: function() {
    window.myApi.receive("updateImage", (data) => {
      this.imgData = data;
    });
  }
}
</script>

<style scoped>

</style>
