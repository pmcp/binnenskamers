<template>
  <div>
    <nuxt />
    <!-- <orbs :settings="settings" /> -->
  </div>
</template>

<script>  
import orbs from "~/components/Orb";
export default {
  components: {
    orbs
  },
  // data() {
  //   return {
  //     settings: [
  //       {
  //         position: { x: 0.9, y: 0.8, z: 1 },
  //         perlin: {
  //           speed: 0.2,
  //           size: 30,
  //           perlins: 90.0,
  //           decay: 1.2,
  //           displace: 1.0,
  //           complex: 1.5,
  //           waves: 10.7,
  //           eqcolor: 100,
  //           rcolor: 0.5,
  //           gcolor: 0,
  //           bcolor: 0.9,
  //           fragment: true,
  //           points: false,
  //           redhell: true
  //         }
  //       },
  //       {
  //         position: { x: 0.2, y: 0.1, z: 1 },
  //         perlin: {
  //           speed: 0.2,
  //           size: 20,
  //           perlins: 90.0,
  //           decay: 1.2,
  //           displace: 1.0,
  //           complex: 1.5,
  //           waves: 10.7,
  //           eqcolor: 100,
  //           rcolor: 0.5,
  //           gcolor: 0,
  //           bcolor: 0.9,
  //           fragment: true,
  //           points: false,
  //           redhell: true
  //         }
  //       }
  //     ]
  //   }
  // },
}
</script>

<style>
</style>
