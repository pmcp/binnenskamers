<template>
  <div>
    <div class="nav">
      <input type="image" class="backButton" @click="goBack" :src="require(`../assets/ui/arrow.png`)"  alt="Toon afbeeldingen" >
      <slot></slot>
      <div class="photos__toggle">
        <input type="image"  v-if="photos.length > 0"  :src="require(`../assets/ui/kodak_small.jpg`)"  alt="Toon afbeeldingen" @click="show = !show">
      </div>
    </div>
    <div class="photos__container" v-if="show" @click.self.prevent="show = !show">
      <img v-for="i in photos" :key="i" :src="require(`../assets/photos/${path}/${i}.jpg`)" >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  props: {
    path: {
      type: String,
      default: ''
    },
    photos: {
      type: Array,
      default: function () { return [] }
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  },
}
</script>

<style>

</style>