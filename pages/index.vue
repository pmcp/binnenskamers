<template>
  <div class="container">
    <page-with-blob></page-with-blob>
  </div>
</template>

<script>
import pageWithBlob from "~/components/PageWithBlob";
export default {
  components: {
    pageWithBlob
  },
  methods: {
    goTo(path) {
      this.$router.push({
        path: 'about'
      })
    }
  },
}
</script>

<style lang="scss">
.container {
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  display:inline-block;
  z-index: 1;
}


</style>
