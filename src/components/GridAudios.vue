<template>
  <div id="audio-container" class="columns is-multiline is-mobile">
    <div class="column is-12 py-0">
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
export default {
  props: {
    audiosAsProp: {
      type: Array,
      default: () => []
    }
  }
};
</script>
