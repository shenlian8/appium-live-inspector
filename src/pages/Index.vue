<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <breadcrumbs
          :absolutePath="selectedFolder"
          @selected="onSelectedFolder"
        />

        <q-btn
          flat
          dense
          round
          :icon="listType === 'grid' ? 'format_list_bulleted' : 'border_all'"
          aria-label="toggle between grid and list modes"
          @click="toggleListType"
        />

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
