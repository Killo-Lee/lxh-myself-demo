<template>
  <div class="home">
    <v-Head></v-Head>
    <gd></gd>
    <div class="main">
      <mains></mains>
      <div class="main-z">
        <mainzl></mainzl>
        <mainzz></mainzz>
        <mainzr></mainzr>
      </div>
      <div class="main-x">
        <mainxl></mainxl>
        <mainxr></mainxr>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "../components/header";
import gd from "./gd.vue";
import mains from "./mains.vue";
import mainzl from "./mainzl.vue";
import mainzz from "./mainzz.vue";
import mainzr from "./mainzr.vue";
import mainxl from "./mainxl.vue";
import mainxr from "./mainxr.vue";
export default {
  name: "index",
  components: {
    vHead,
    gd,
    mains,
    mainzl,
    mainzz,
    mainzr,
    mainxl,
    mainxr
  },
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>
