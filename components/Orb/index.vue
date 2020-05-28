<template>
  <section class="blobs" id="blobs">
    <canvas  class="blobs__canvas" ref="canvas"></canvas>
    {{ testName }}
  </section>
</template>

<script>
import ArtworkGL from "./js/ArtworkGL";
import EventBus from "~/utils/event-bus";

export default {
  name: 'artwork',
  data () {
    return {
      testName: 'null'
    }
  },
  mounted () {
    if(!this.artworkGL) this.artworkGL = new ArtworkGL({
      $canvas: this.$refs.canvas
    });

    EventBus.$emit("TRANSITION", this.$route.name);

    EventBus.$on('MOUSEOVER', (data) => {
      console.log('HERE', data)
      this.testName = data
      console.log(this.testName)
    })
  },

  watch: {
    "$route.name": function(_new, _old){
      EventBus.$emit("TRANSITION", _new);
    }
  },
  destroyed(){
  },
  methods: {
  }
};
</script>
<style>
  .blobs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

