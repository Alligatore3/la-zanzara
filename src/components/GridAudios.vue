<template>
  <div id="audio-container" class="columns is-multiline is-mobile">
    <div class="column is-12 py-0 mt-1">
      <p class="has-text-right">Risultati: {{ audiosAsProp.length }}</p>
    </div>
    <div
      :id="`${audio.name}-${index}`"
      v-for="(audio, index) in audiosAsProp"
      :key="index"
      class="column is-one-third-desktop is-half-tablet is-one-third-widescreen"
    >
      <div class="audio box">
        <div class="columns is-vcentered is-mobile is-multiline">
          <div class="column is-10">
            <p class="is-capitalized has-text-left truncate-text max-w-200">
              {{ audio.description }}
            </p>
          </div>
          <div
            @click="copyAudioReference(audio.description)"
            class="column is-2 has-text-right pointer"
          >
            <img class="share-icon" src="/share-icon.png" alt="share icon" />
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
</template>

<script>
import ToasterHandler from "@/mixins/Toaster";

export default {
  mixins: [ToasterHandler],
  props: {
    audiosAsProp: {
      type: Array,
      default: () => []
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss">
#audio-container {
  .share-icon {
    max-width: 17px;
    margin-top: 7px;
  }
}
</style>
