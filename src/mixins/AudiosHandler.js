import { EMPTY_VALUE } from "@/constants/index";
import { mapGetters } from "vuex";

export default {
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
    /**
     * @description By a give audio {} we check if comments inside
     * metadata are present. For some reason comments are array.
     * No idea why VLC textarea is an array.
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
    }
  }
};
