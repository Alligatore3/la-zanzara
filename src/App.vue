<template>
  <section id="app">
    <div class="container is-widescreen">
      <SearchBar />
      <div class="p-1 mb-3">
        <Spinner :show="spinnerVisibility" />
        <GridAudios
          v-if="filteredAudiosByTerm.length"
          :audiosAsProp="filteredAudiosByTerm"
        />
        <EmptyResults v-else />
      </div>
    </div>
    <Toaster />
    <Footer />
  </section>
</template>

<script>
import { EMPTY_VALUE } from "@/constants/index";
import { mapMutations } from "vuex";

import AudiosHandler from "@/mixins/AudiosHandler";

export default {
  name: "app",
  mixins: [AudiosHandler],
  components: {
    EmptyResults: () => import("@/components/EmptyResults"),
    GridAudios: () => import("@/components/GridAudios")
  },
  data() {
    return {
      audios: require("@/assets/audios/asJSON/audios.json"),
      spinnerVisibility: true,
      generalError: null
    };
  },
  mounted() {
    this.audios && this.setAudiosInState(this.audios);
    setTimeout(this.hideSpinner, 1500);
  },
  methods: {
    ...mapMutations("audios", ["setAudiosInState"]),
    hideSpinner() {
      return (this.spinnerVisibility = false);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
