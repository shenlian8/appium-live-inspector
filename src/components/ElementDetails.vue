<template>
  <div></div>
</template>

<script>

export default {
  name: "ElementDetails",
  data() {
    return {
    }
  },
  methods: {

  },
  created: function() {
    window.myApi.receive("updateElementView", (data) => {
      //this.oriElements = data;
    });
  }
}
</script>
