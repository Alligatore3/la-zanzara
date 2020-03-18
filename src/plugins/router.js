import Vue from "vue";
import VueRouter from "vue-router";
import App from "@/App.vue";

Vue.use(VueRouter);

export default new VueRouter({
  /**
   * @description The default mode for vue-router is hash mode
   * it uses the URL hash to simulate a full URL so that
   * the page won't be reloaded when the URL changes.
   * @see https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
   */
  mode: "history",
  routes: [
    { path: "/", component: App },
    { path: "/sharing/:audio", name: "sharing", component: App }
  ]
});
