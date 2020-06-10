<template>
  <div class="container">
    <div class="map">
      <div class="map__img" >
        <a class="img" href="/map">
          <img src="@/assets/squares/img14.png">
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
    </div>  
  </div>
</template>

<script>
export default {
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
