const toaster = {
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
    show: false,
    body: null
  },
  getters: {
    getToasterVisibility: state => state.show,
    getToasterBody: state => state.body
  },
  mutations: {
    setToasterVisibility: (state, show) => (state.show = show),
    setToasterBody: (state, body) => (state.body = body)
  }
};

export default toaster;
