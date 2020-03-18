import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import App from "@/App.vue";

import store from "./plugins/vuex";
import router from "./plugins/router";

/**
 * @description Import main.scss into your main.js
 * @see https://github.com/neovive/bulma-vuecli#import-mainscss-into-your-mainjs
 */
import "./assets/sass/main.scss";

(function registerComponents() {
  const requireComponent = require.context("@/components/global", true);

  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);

    const componentName = upperFirst(
      camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1"))
    );

    Vue.component(componentName, componentConfig.default || componentConfig);
  });
})();

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
