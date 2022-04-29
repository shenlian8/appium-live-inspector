<template>
  <div class="q-pa-md">
    <q-checkbox @click="toggleTick" v-model="toShowTick" />
    <q-btn round size="sm" color="deep-orange" icon="directions" @click="sendTickedList" />
  </div>
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
      v-model:ticked="ticked"
      v-model:tick-strategy="tickStrategy"
    />
  </q-scroll-area>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Treeview',
  setup () {
    return {
      selected: ref(null),
      ticked: ref(null),
      tickStrategy: ref('none'),
    }
  },
  data() {
    return {
      treeData: [],
      toShowTick: false,
      allTicked: []
    }
  },
  methods: {
    triggerNodeSelected: function() {
      window.mitt.emit("Element selected", this.selected);
    },
    toggleTick: function() {
      if(this.toShowTick === true) {
        this.tickStrategy = "leaf";
      } else {
        this.tickStrategy = "none";
      }
    },
    sendTickedList: function() {
      this.allTicked = [];
      if(this.ticked && this.toShowTick) {
        for (const tickedId of this.ticked) {
          this.getAllTickedList(tickedId);
        }
      }
      // console.log(this.allTicked);
      window.mitt.emit("Tree ticked", this.allTicked);
    },
    getAllTickedList: function(currentNodeId) {
      if(! this.allTicked.includes(currentNodeId)) {
        // console.log(currentNodeId);
        // get the current node
        const currentNode = this.$refs.tree.getNodeByKey(currentNodeId);
        // console.log(currentNode);

        if(currentNode) {
          // push the id to the all ticked array
          this.allTicked.push(currentNodeId);

          // find the parent
          // console.log(currentNode.parentId);
          const parentNode = this.$refs.tree.getNodeByKey(currentNode.parentId);

          if(parentNode) {
            // call function recursive
            this.getAllTickedList(parentNode.id);
          }
        }
      }
    }
  },
  created: function() {
    window.myApi.receive("updateTreeView", (data) => {
      this.treeData = data;
      this.$nextTick(()=>{this.$refs.tree.expandAll()})
    });

    window.mitt.on('Element selected', (elementId) => {
      this.selected = Number(elementId);
    });
  }
    };
</script>
