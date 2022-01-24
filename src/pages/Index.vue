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
        <q-input class="bg-lime-3" type="url" filled placeholder="http://" v-model="text" style="min-width: 500px">
          <template v-slot:append>
            <q-btn no-caps color="primary" label="/session/" />
          </template>
        </q-input>
        <q-select class="bg-amber-3" v-model="model" :options="options" style="min-width: 400px">
          <template v-slot:after>
            <q-btn class="bg-deep-orange-4" icon="update" />
          </template>
        </q-select>
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
//import { defineComponent } from 'vue';

</script>
