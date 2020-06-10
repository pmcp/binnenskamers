<template>
  <section
    class="blobs"
    id="blobs"
  >
    <canvas
      class="blobs__canvas"
      id="canvas"
    ></canvas>
  </section>
</template>

<script>
import OrbGL from "./js/OrbGL";
import EventBus from "~/utils/event-bus";

export default {
  name: "artwork",
  props: {
    id: {
      type: Number,
      default: 0
    },
    settings: {
        type: Array,
        default: () => ({})
    }
  },
  mounted() {
    // Add the orbs

    // This is  where we include the props for the orb, so we need to pass the data here
    if (!this.OrbGL)
      this.OrbGL = new OrbGL({
        orbSettings: this.settings
      });

    // EventBus.$emit("TRANSITION", this.$route.name);

    // EventBus.$on("MOUSEOVER", data => {});
  },

  watch: {
    // "$route.name": function(_new, _old) {
      // EventBus.$emit("TRANSITION", _new);
    // }
  },
  destroyed() {},
  methods: {}
};
</script>
