<template>
  <div class="container">
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
    <div class="map">
      <div class="map__img" >
        <a class="img" href="/map">
          <img src="@/assets/squares/compressed/img14.jpg">
        </a>
      </div>
    </div>
    <div class="legend">
      <p>De Sint-Lukas Kunstschool (Academie, Basisschool en Humaniora) is gesitueerd in de Brabantwijk in Schaarbeek, pal naast de Hogeschool LUCA School of Arts.</p>
      <p>De Brabantwijk bevindt zich in hartje Brussel aan het station Brussel-Noord en is een interessant knooppunt tussen verschillende ‘gebruikers’. Er is een levendige winkelstraat, ze herbergt vele nationaliteiten en is een transitzone voor ambtenaren en studenten.</p>
      <p>Onze studenten komen van overal: overdag brengen ouders die in de buurt wonen hun jonge kinderen naar de Sint-Lukas Basisschool, jongeren komen uit Brussel en Vlaanderen met het openbaar vervoer naar de Sint-Lukas Kunsthumaniora en nadien sluiten kinderen uit de buurt en volwassenen, vooral uit het centrum en de Brusselse rand, aan om in hun vrije tijd de beeldende kunsten te verkennen in de Sint-Lukas Academie.</p>
      <p>Externe organisaties gebruiken ’s avonds de gebouwen voor allerhande doeleinden en activiteiten, in samenwerking met onze Brede School Noord.  Op dinsdagavond schuift iedereen aan aan de gemeenschappelijke tafel bij de Buurtkeuken.</p>
      <p>De ateliers vormen de centrale spil van dit alles, als blik-opener en als labo, waarin we de verbeelding, de goesting van het doen en het creëren stimuleren.</p>
      <p>Deze drie scholen op één plaats, samen met de geografische ligging zorgt voor een meervoudig kruispunt van veel culturen, leeftijden, socio-economische achtergronden en artistieke processen.</p>
      <p>Via deze site kan je binnenkijken in onze locatie,  waarin de drie scholen organisch door elkaar lopen in een uniek pedagogisch project!</p>
      <p>Ga naar <nuxt-link to="/map">het grondplan</nuxt-link>.</p>
    </div>  
  </div>
</template>

<script>
export default {
  data() {
    return {
          openModal: false
    }
  },
  methods: {
    setActive(id) {
      this.activeLocationId = id;
    },
    goTo(path) {
      this.$router.push({
        path: path
      });
    }
  }
};
</script>

<style lang="scss">
</style>
