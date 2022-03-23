<template>
  <q-scroll-area class="col q-pa-sm">
    <q-tree
      :nodes="treeData"
      dense
      node-key="id"
      default-expand-all
      :duration="0"
      ref="tree"
      :selected="selected"
      @update:selected="triggerNodeSelected"
    />
  </q-scroll-area>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Treeview',
  data() {
    return {
      treeData: [],
      selected: []
    }
  },
  methods: {
    triggerNodeSelected: function(event) {
      window.mitt.emit("Element selected", event);
    },
  },
  created: function() {
    window.myApi.receive("updateTreeView", (data) => {
      this.treeData = data;
      this.$nextTick(()=>{this.$refs.tree.expandAll()})
    });

    window.mitt.on('Element selected', (elementId) => {

    });
  }
    };
</script>
