<template>
  <q-input class="bg-lime-3"
           type="url"
           filled
           placeholder="http://"
           v-model="appiumUrl"
           v-on:keyup.enter="getSessionIds"
           style="min-width: 500px">
    <template v-slot:append>
      <q-btn @click="getSessionIds" no-caps color="primary" label="/session/" />
    </template>
  </q-input>
  <q-select class="bg-amber-3" v-model="sessionId" :options="sessionIds" style="min-width: 400px">
    <template v-slot:after>
      <q-btn @click="startRequest" class="bg-deep-orange-4" icon="update" />
    </template>
  </q-select>
</template>

<script>
import {Notify} from "quasar";

export default {
  name: 'Searchbar',
  data() {
    return {
      appiumUrl: "",
      sessionId: null,
      sessionIds: []
    }
  },
  mounted: function() {
    this.appiumUrl = localStorage.appiumUrl;
  },
  methods: {
    getSessionIds: function() {
      // console.info(this.searchText);
      if (this.appiumUrl.trim() !== '') {
        localStorage.setItem("appiumUrl", this.appiumUrl);
        window.myApi.getSessionIds(this.appiumUrl);
      }
      window.myApi.receive("updateSessionIds", (data) => {
        //console.log(data);
        this.sessionId = null;
        this.sessionIds = data;
        if (this.sessionIds.length > 0) {
          this.sessionId = data[data.length - 1];
        }
      });
    },
    startRequest: function() {
      if (this.appiumUrl.trim() !== '' &&
            this.sessionId !== '') {
        window.myApi.requestAppium(this.appiumUrl + '/session/' + this.sessionId);
      }
    }
  }
};
</script>
