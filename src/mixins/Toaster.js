import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations("toaster", ["setToasterVisibility", "setToasterBody"]),
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
