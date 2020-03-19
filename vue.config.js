/**
 * @description Vue-cli allows to modify its configuration by creating a vue.config.js
 * file at the root of the project that exports an object with several configuration options.
 * @see https://css-tricks.com/how-to-import-a-sass-file-into-every-vue-component-in-an-app/
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
