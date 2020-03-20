import { EMPTY_VALUE } from "@/constants/index";

export default {
  computed: {
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
  }
};
