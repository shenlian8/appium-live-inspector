<template>
  <q-scroll-area class="col q-pa-sm">
    <q-tree
      :nodes="treeData"
      dense
      node-key="id"
      default-expand-all
      :duration="0"
      ref="tree"
      v-model:selected="selected"
      selected-color="green"
      no-selection-unset
      @update:selected="triggerNodeSelected"
    />
  </q-scroll-area>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Treeview',
  setup () {
    return {
      selected: ref(null)
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  methods: {
    triggerNodeSelected: function() {
      window.mitt.emit("Element selected", this.selected);
    },
  },
  created: function() {
    window.myApi.receive("updateTreeView", (data) => {
      this.treeData = data;
      this.$nextTick(()=>{this.$refs.tree.expandAll()})
    });

    window.mitt.on('Element selected', (elementId) => {
      //this.selected = ;
    });
  }
    };
</script>
