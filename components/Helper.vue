<template>
  <div class="helper">
    {{ mouseCoordinates}}
    <br>
    "x": {{ normalisedX }}, "y": {{ normalisedY }}, "z": -100
  </div>
</template>

<script>
import EventBus from "~/utils/event-bus";
export default {
  data() {
    return {
      mouseCoordinates: {
        x: null,
        y: null
      }
    }
  },
  computed: {
    normalisedX() {
      return this.data 
    },
    normalisedY() {
      return this.data 
    }
  },
  mounted(){
// This event is coming from the threejs instance, when right clickingon the canvas.
    EventBus.$on("RIGHTCLICK", data => {
      this.mouseCoordinates = {
        x: data.x,
        y: data.y 
      };
      
    });
  }
}
</script>

<style>
.helper {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
}
</style>