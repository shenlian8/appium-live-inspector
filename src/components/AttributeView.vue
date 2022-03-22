<template>
  <q-input
    v-model="xpathText"
    filled
    readonly
    type="textarea"
    rows="3"
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
          <q-td>
              <q-btn size="8px" round @click="copyAttributeValue(props.row)" icon="content_copy" />
          </q-td>
          <q-td>
            <q-btn size="8px" round @click="setEqualText(props.row)" icon="drag_handle" />
          </q-td>
          <q-td>
            <q-btn size="8px" round @click="setContainText(props.row)" icon="save_alt" />
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
import {copyToClipboard, Notify} from 'quasar'

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
      xpathText: "",
      attrs: []
    }
  },
  methods: {
    updateAttrs: function (id) {
      if (this.oriElements[id] != null) {
        this.attrs = this.oriElements[id].attr;
      }
    },
    copyString: function(stringValue) {
      copyToClipboard(stringValue)
        .then(() => {
          Notify.create({
            message: "Copied",
            color: "green"
          });
        })
        .catch(() => {
          Notify.create({
            message: "Copy failed",
            color: "orange"
          });
        })
    },
    setEqualText: function(row) {
      // console.log(scope);
      // console.log("//*[@" + scope.row.key + "='" + scope.row.value + "']");
      this.xpathText = "//*[@" + row.key + "='" + row.value + "']"
      this.copyString(this.xpathText);
    },
    setContainText: function(row) {
      // console.log(scope);
      let valueString = row.value;
      if(row.key === "resource-id") {
        valueString = valueString.replace(/^(.*):id/g, ':id');
      }
      this.xpathText = "//*[contains(@" + row.key + ",'" + valueString + "')]"
      this.copyString(this.xpathText);
    },
    copyAttributeValue: function(row) {
      this.xpathText = row.value;
      this.copyString(this.xpathText);
    },
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
