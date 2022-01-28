<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue-3">
        <q-btn
          flat
          dense
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <searchbar></searchbar>
      </q-toolbar>
    </q-header>

    <!--
    using this: https://forum.quasar-framework.org/topic/3756/best-practice-setting-up-q-scroll-area/5
    -->
    <q-page-container>
        <q-page class="row no-scroll no-wrap">
          <div class="col q-ma-md" style="min-width: 300px">
            <div class="column full-height">
              <q-scroll-area class="col q-pa-sm">

              </q-scroll-area>
            </div>
          </div>
          <div class="col q-ma-md" style="min-width: 300px">
            <div class="column full-height">
              <q-scroll-area class="col q-pa-sm">
                <screen-view></screen-view>
              </q-scroll-area>
            </div>
          </div>
          <div class="col q-ma-md" style="min-width: 300px">
            <div class="column full-height">
              <q-scroll-area class="col q-pa-sm">

              </q-scroll-area>
            </div>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Searchbar from "components/SearchBar";
import { Notify } from 'quasar';
import ScreenImage from "components/ScreenView";
import ScreenView from "components/ScreenView";
export default {
  components: {ScreenView, Searchbar}
}
window.myApi.receive("generalError", (data) => {
  // console.log(data);
  Notify.create({
    message: data,
    color: "orange"
  });
});
</script>
