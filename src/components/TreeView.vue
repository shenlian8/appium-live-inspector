<template>
  <q-scroll-area class="col q-pa-sm">

  </q-scroll-area>
</template>

<script>

export default {
  name: 'Treeview',
  setup () {
    return {
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
  created: function() {
    window.myApi.receive("updateElementView", (data) => {
    });

    window.mitt.on('Element selected', (elementId) => {
    });
  }
    };
</script>
