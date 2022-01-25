<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-14">
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
                <p v-for="n in 15" :key="n">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
                <router-view />
              </q-scroll-area>
            </div>
          </div>
          <div class="col q-ma-md" style="min-width: 300px">
            <div class="column full-height">
              <div>aaa</div>
              <q-scroll-area class="col q-pa-sm">
                <p v-for="n in 15" :key="n">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
                <router-view />
              </q-scroll-area>
            </div>
          </div>
          <div class="col q-ma-md" style="min-width: 300px">
            <div class="column full-height">
              <q-scroll-area class="col q-pa-sm">
                <p v-for="n in 15" :key="n">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
                <router-view />
              </q-scroll-area>
            </div>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Searchbar from "components/SearchBar/SearchBar";
import { Notify } from 'quasar';
export default {
  components: {Searchbar}
}
window.myApi.receive("generalError", (data) => {
  console.log(data);
  Notify.create({
    message: data,
    color: "orange"
  });
});
</script>
