<template>
  <q-input
    class="bg-lime-3"
    type="url"
    filled
    placeholder="http://"
    v-model="appiumUrl"
    v-on:keyup.enter="startRequest"
    style="min-width: 500px"
  />
  <q-input
    class="bg-amber-3"
    filled
    placeholder="session id"
    v-model="sessionId"
    v-on:keyup.enter="startRequest"
    style="min-width: 400px"
  >
    <template v-slot:after>
      <q-btn @click="startRequest" class="bg-deep-orange-4" icon="update" />
    </template>
  </q-input>
</template>

<script>

export default {
  name: 'Searchbar',
  data() {
    return {
      appiumUrl: "",
      sessionId: ""
    }
  },
  mounted: function() {
    this.appiumUrl = localStorage.appiumUrl;
  },
  methods: {
    startRequest: function() {
      if (this.appiumUrl.trim() !== '' &&
            this.sessionId.trim() !== '') {
        localStorage.setItem("appiumUrl", this.appiumUrl);
        window.myApi.requestAppium(this.appiumUrl + '/session/' + this.sessionId);
      }
    }
  }
};
</script>
