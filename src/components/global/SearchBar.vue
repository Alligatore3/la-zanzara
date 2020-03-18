<template>
  <nav class="navbar" :class="stickySearchClass">
    <div class="columns wrap is-vcentered fix-nav-child-width">
      <div class="column is-full">
        <input
          class="input"
          type="text"
          v-model="searchBar"
          @input="searchingBy"
          placeholder="🔍"
        />
      </div>
    </div>
  </nav>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "SearchBar",
  data: () => ({
    searchBar: "",
    stickySearchClass: ""
  }),
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    if (!this.isSharing) return;

    this.searchBar = this.getSharedAudio;
    this.searchingBy(this.searchBar);
  },
  computed: {
    /**
     * @description Utility in case we are sharing URL
     * @returns {Boolean}
     */
    isSharing() {
      const hasParams = Object.keys(this.$route.params).length;
      return Boolean(hasParams && this.$route.params.audio);
    },
    getSharedAudio() {
      return this.isSharing && this.$route.params.audio;
    }
  },
  methods: {
    ...mapMutations("audios", ["setSearchObject"]),
    /**
     * @function
     * @name handleScroll
     * @returns {Void}
     */
    handleScroll() {
      this.stickySearchClass =
        document.documentElement.scrollTop >= 300
          ? "is-fixed-top box box-fix"
          : "";
    },
    /**
     * @description This is the constrain => FILTER:TERM
     */
    searchingBy() {
      let term;
      const splitted = this.searchBar.split(":");

      switch (splitted[0].toLowerCase()) {
        case "artista":
        case "autore":
        case "artist":
          term = (splitted[1] && splitted[1].trim()) || this.searchBar;
          return this.setSearchObject({ byWhat: "artist", term });

        case "anno":
        case "year":
          term = (splitted[1] && splitted[1].trim()) || this.searchBar;
          return this.setSearchObject({ byWhat: "year", term });

        default:
          return this.setSearchObject({
            byWhat: undefined,
            term: this.searchBar
          });
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.box-fix
  max-width: 95%
  margin: 5px auto

.is-fixed-top
  .fix-nav-child-width
    margin-bottom: 0

.fix-nav-child-width
  width: 100%
  margin: 0 auto 20px
</style>
