const audios = {
  /**
   * @description By default, actions, mutations and getters inside modules
   * are still registered under the global namespace
   * this allows multiple modules to react to the same mutation/action type.
   * If you want your modules to be more self-contained or reusable,
   * you can mark it as namespaced with namespaced: true.
   * @see https://vuex.vuejs.org/guide/modules.html#namespacing
   */
  namespaced: true,
  state: {
    audios: [],
    searchObject: null
  },
  getters: {
    getAudiosFromState: state => state.audios,
    getSearchTermFromState: state => state.searchObject
  },
  mutations: {
    /**
     * @see https://vuex.vuejs.org/guide/mutations.html#commit-with-payload
     * @param {Object} state
     * @param {Array} payload Audios
     */
    setAudiosInState: (state, payload) => (state.audios = payload),
    setSearchObject: (state, payload) => (state.searchObject = payload)
  }
};

export default audios;
