<template>
  <div id="app">
    <router-view class="router-view" keep-alive></router-view>
    <!-- <router-view class="image-overlay" name="imageOverlay"></router-view> -->
  </div>
</template>

<script>
import headerbar from './header';
export default {
  components: {
    headerbar
  }
};
</script>

<style lang="scss">
@import '../styles/_imports.scss';

body {
  margin: 0px;
  padding: 0px;
  background: map-get($greys, 50);
  font-family: $text-font;
}

.header {
  width: 100%;
  position: sticky;
}
</style>
