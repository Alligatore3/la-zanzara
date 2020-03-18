<template>
  <transition name="fade">
    <div v-if="getToasterVisibility" id="toaster-container">
      <div class="container h-100">
        <div class="columns h-100 is-multiline is-vcentered is-mobile">
          <div class="column has-text-centered">
            <div class="pl-2 pr-2 box is-inline-block">
              <p class="has-text-centered">
                {{ getToasterBody }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("toaster", ["getToasterVisibility", "getToasterBody"])
  }
};
</script>

<style lang="sass" scoped>
#toaster-container
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 200
  background-color: rgba(255, 255, 255, 0.7)
  .box
    margin-left: 0
    margin-right: 0

.fade-enter-active,
.fade-leave-active
  transform-origin: center
  transform: scale(1)
  transition: all .3s ease

.fade-enter,
.fade-leave-to
  transform-origin: center
  transform: scale(0)
</style>
