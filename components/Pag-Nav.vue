<template>
  <div>
    <img src="~assets/images/inkom.png" />
    <div class="grid">
      <div class="link" @click="goTo('/about')"></div>
  
    </div>
  </div>
</template>
<script>
import Orb from "~/components/Orb";

export default {
  components: {
    Orb,
  },
}
</script>
<style lang="scss" scoped>
.grid {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

img {
  height: 50vw;
  width: auto;
}

.link {
  /* background-color: blue; */
  position: relative;
  z-index: 10;
  height: 100%;
  width: 100%;
  grid-area: 2 / 2 / 3 / 3;
  &:hover {
    background: radial-gradient(38% 38% at 50% 55.5%, #7000FF 0%, rgba(196, 196, 196, 0) 100%);
  }
} 


</style>