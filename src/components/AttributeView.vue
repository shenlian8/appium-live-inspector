<template>
  <q-input
    v-model="xcodeText"
    filled
    readonly
    type="textarea"
    rows="4"
  />
  <q-scroll-area class="col q-pa-sm">
    <q-table
      :rows="attrs"
      row-key="key"
      hide-header
      hide-bottom
      :rows-per-page-options="[0]"
      wrap-cells
      style="width: 100%"
    />
  </q-scroll-area>
</template>

<script>
const columns = [
  { name: 'key', label: 'Key', style: 'width: 100px'},
  { name: 'value', label: 'Value'}
]

export default {
  name: 'Attributeview',
  setup () {
    return {
      columns
    }
  },
  data() {
    return {
      xcodeText: "",
      attrs: []
    }
  },
  methods: {
    updateAttrs: function (id) {
      if (this.oriElements[id] != null) {
        this.attrs = this.oriElements[id].attr;
      }
    }
  },
  created: function() {
    window.myApi.receive("updateElementView", (data) => {
      this.oriElements = data;
    });

    window.mitt.on('Element selected', (elementId) => {
      this.updateAttrs(elementId);
    });
  }
    };
</script>
