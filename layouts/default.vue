<template>
  <div>
    <!-- <helper></helper> -->
    <button @click="openModal = !openModal" class="underlined modal__button">Bekijk hier alle info over de rondleidingen op zaterdag 27 juni en zondag 28 juni.</button>
      
    <div
      class="modal"
      v-if="openModal"
    ><div class="modal__content">
      <button @click="openModal = !openModal" class="modal__button underlined">Sluiten</button>
      <p>Holy cow! Dit weekend, 27 en 28 juni, houden we online eindejaarstentoonstelling én infomoment. Kom dus binnenklikken! </p>
      <p>Kijk je ogen uit, spits je oren, stel je vragen en dwaal daarna digitaal over onze campus. Er valt véél te ontdekken!</p>

      <p>ZATERDAG én ZONDAG kan je dezelfde rondleidingen volgen:</p>
      <br>
      <br>14u: Humaniora 1e graad
      <br>14u: Academie -18 jaar
      <br>
      <br>15u: Humaniora 2e graad (BAK, AO, BAV, AVV)
      <br>15u: Academie +18 jaar
      <br>
      <br>16u: Humaniora 3e graad (VBK, AO, TBK, ABK, AV, BV, AVV)
      <br>16u: Academie drop-in info (inschrijvingen, administratie, praktische zaken…)

      <br>
      <br>17u: Humaniora drop-in info (inschrijvingen, administratie, praktische zaken…)

      <p>Elke rondleiding duurt ongeveer een uur.</p>

      <p>zoom-links vind je hier: <a
          href="https://drive.google.com/drive/folders/17avHQSazHyJr_94SWOayffJH27oNHLwE?usp=sharing"
          target="_blank"
        >https://drive.google.com/drive/folders/17avHQSazHyJr_94SWOayffJH27oNHLwE?usp=sharing</a></p>
    </div>
    </div>
    <nuxt />

    <!-- <orbs/> -->
  </div>
</template>

<script>
// import orbs from "~/components/Orb";
export default {
  data() {
    return {
      openModal: false
    };
  },
  components: {
    // orbs
  }
};
</script>

<style>
</style>
