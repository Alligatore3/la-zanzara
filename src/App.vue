<template>
  <section id="app">
    <div class="container is-widescreen">
      <SearchBar />
      <div class="p-1">
        <Spinner :show="spinnerVisibility" />
        <div
          v-if="filteredAudiosByTerm.length"
          id="audio-container"
          class="columns is-multiline is-mobile"
        >
          <div class="column is-12 py-0">
            <p class="has-text-right">
              Risultati: {{ filteredAudiosByTerm.length }}
            </p>
          </div>
          <div
            :id="`${audio.name}-${index}`"
            v-for="(audio, index) in filteredAudiosByTerm"
            :key="index"
            class="column is-one-third-desktop is-half-tablet is-one-third-widescreen"
          >
            <div class="audio box">
              <div class="columns is-vcentered is-mobile is-multiline">
                <div class="column is-10">
                  <p
                    class="is-capitalized has-text-left truncate-text max-w-200"
                  >
                    {{ audio.description }}
                  </p>
                </div>
                <div
                  @click="copyAudioReference(audio.description)"
                  class="column is-2 has-text-right pointer"
                >
                  <img
                    class="share-icon"
                    src="/share-icon.png"
                    alt="share icon"
                  />
                </div>
                <div class="column is-9">
                  <p class="is-size-7 has-text-left truncate-text">
                    by {{ audio.artist }}
                  </p>
                </div>
                <div class="column is-3">
                  <p class="is-size-7 has-text-right">
                    {{ audio.year }}
                  </p>
                </div>
              </div>
              <div class="has-text-centered">
                <audio controls :src="audio.path">
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="has-text-centered is-size-3">
          Nada zia ¯\_(ツ)_/¯
        </p>
      </div>
    </div>
    <Toaster />
    <Footer />
  </section>
</template>

<script>
import { EMPTY_VALUE } from "./constants/index";
import { mapGetters, mapMutations } from "vuex";

import Footer from "./components/global/Footer";

export default {
  name: "app",
  components: { Footer },
  data() {
    return {
      audios: require("./assets/audios/asJSON/audios.json"),
      spinnerVisibility: true,
      generalError: null
    };
  },
  mounted() {
    this.audios && this.setAudiosInState(this.audios);
    setTimeout(this.hideSpinner, 1500);
  },
  computed: {
    ...mapGetters("audios", ["getAudiosFromState", "getSearchTermFromState"]),
    /**
     * @name elaboratedAudios
     * @description Due to webpack require rules
     * @see https://github.com/vuejs-templates/webpack/issues/126#issuecomment-326570953
     * @returns {Array}
     */
    elaboratedAudios() {
      return this.getAudiosFromState.map(a => ({
        description: this.checkForComments(a),
        name: a.name.replace(/\.[^/.]+$/, ""),
        year: String(a.metadata.year) || EMPTY_VALUE,
        artist: a.metadata.artist || EMPTY_VALUE,
        path: require(`@/assets/audios/${a.name}`)
      }));
    },
    filteredAudiosByTerm() {
      const { byWhat, term } = this.getSearchTermFromState || {};

      return !this.getSearchTermFromState || (!byWhat && !term.length)
        ? this.elaboratedAudios
        : this.elaboratedAudios.filter(audio =>
            this.matchWithsearch(audio, byWhat, term)
          );
    }
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
}

.py-0 {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.p-1 {
  padding: 1rem;
}

.mb-1 {
  margin-bottom: 1rem;
}

.h-100 {
  height: 100%;
}

.max-w-200 {
  max-width: 200px;
}

.share-icon {
  max-width: 17px;
  margin-top: 7px;
}

.pointer {
  cursor: pointer;
}

.truncate-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
