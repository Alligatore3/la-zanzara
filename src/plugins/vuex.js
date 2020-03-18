import audios from "../store/audios";
import toaster from "../store/toaster";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    audios,
    toaster
  }
});
