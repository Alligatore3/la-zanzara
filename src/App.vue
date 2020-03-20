<template>
  <section id="app">
    <div class="container is-widescreen">
      <SearchBar />
      <div class="p-1">
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
import { mapGetters, mapMutations } from "vuex";

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
  computed: {
    ...mapGetters("audios", ["getAudiosFromState", "getSearchTermFromState"])
  },
  methods: {
    ...mapMutations("audios", ["setAudiosInState"]),
    ...mapMutations("toaster", ["setToasterVisibility", "setToasterBody"]),
    hideSpinner() {
      return (this.spinnerVisibility = false);
    },
    /**
     * @description By a give audio {} we check if comments inside
     * metadata are present. For some reason comments are array.
     * No reason why VLC textarea is an array.
     * @returns {String}
     */
    checkForComments(audio) {
      const {
        metadata: { comment }
      } = audio;
      return (comment && comment.length && comment[0]) || EMPTY_VALUE;
    },
    /**
     * @name matchWithsearch
     * @param {Object} item Purchase instance coming from firebase.
     * @param {String} filter.
     * @param {String} term.
     * @see https://stackoverflow.com/a/14940323
     * @returns {Boolean}
     */
    matchWithsearch(item, byWhat = "description", term) {
      const regex = new RegExp(term, "ig");
      return item[byWhat].search(regex) >= 0;
    },
    /**
     * @description Ctrl + C helper: since navigator.clipboard's API are
     * not yet supported for Safari iOS we have
     * to provide a fallback.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
     */
    copyAudioReference(description) {
      const audioPath = this.generateURLForSharing(description);

      return navigator.clipboard
        ? navigator.clipboard.writeText(audioPath).then(
            () => this.handleToaster({ show: true, body: "Link copiato ✅" }),
            e =>
              this.handleToaster({
                show: true,
                body: `Oops: errore durante la copia ${e} ⛔️`
              })
          )
        : this.fallbackCopyTextToClipboard(audioPath);
    },
    /**
     * @description Due to the level of browser support for the new Async Clipboard API
     * you will likely want to fallback to the document.execCommand('copy')
     * method to get good browser coverage
     * @see https://stackoverflow.com/a/30810322
     */
    fallbackCopyTextToClipboard(toCopy) {
      const textArea = document.createElement("textarea");
      textArea.value = toCopy;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        this.handleToaster({ show: true, body: "Link copiato ✅" });
      } catch (error) {
        this.handleToaster({
          show: true,
          body: `Oops: errore durante la copia ${error} ⛔️`
        });
      }

      document.body.removeChild(textArea);
    },
    /**
     * @description The built-in URL class provides a convenient
     * interface for creating and parsing URLs.
     * @see https://javascript.info/url#creating-a-url
     * @returns {String}
     */
    generateURLForSharing(description) {
      const { protocol, host } = location;
      const URLAsObject = new URL(
        `${protocol}//${host}/sharing/${description}`
      );

      return URLAsObject.href;
    },
    /**
     * @description Hide the message after 1.5 seconds
     * @param {Boolean} show
     * @param {String} body
     */
    handleToaster({ show, body }) {
      this.setToasterVisibility(show);
      this.setToasterBody(body);

      setTimeout(() => this.setToasterVisibility(false), 1500);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .share-icon {
    max-width: 17px;
    margin-top: 7px;
  }
}
</style>
