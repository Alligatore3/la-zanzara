/**
 * @description Vue-cli allows to modify its configuration by creating a vue.config.js
 * file at the root of the project that exports an object with several configuration options.
 * @see https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/
 */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/main.scss";`
      }
    }
  }
};
