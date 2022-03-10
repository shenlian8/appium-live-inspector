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
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="8px" round @click="props.expand = !props.expand" icon="content_copy" />
          </q-td>
          <q-td auto-width>
            <q-btn size="8px" round @click="props.expand = !props.expand" icon="drag_handle" />
          </q-td>
          <q-td auto-width>
            <q-btn size="8px" round @click="props.expand = !props.expand" icon="save_alt" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
