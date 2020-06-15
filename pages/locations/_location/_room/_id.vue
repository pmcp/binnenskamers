<template>
  <div>
    <div class="container">
      <div class="breadcrumbs" v-if="activeLocation">
        <a href="/">Inleiding</a> - <a href="/map">Plattegrond</a> - <a :href="`/locations/${location}`">Blok {{ activeLocation.name }}</a> - {{ activeRoom.name }}
      </div>
      <div
        class="map"
        :class="cursorClass"
        @mouseleave="setActive(null)"
      >
        <orbs
          v-if="orbSettings"
          :settings="orbSettings"
        />
        <div
          class="map__img"
          v-if="activeRoom"
        >
          <img
            :src="image"
            :alt="activeRoom.img.alt"
          />
        </div>
      </div>

      <div class="room__description" v-if="activeRoom && activeRoom.name == 'Secretariaat - Bureau Ellen'">
        <br>INFO:
          <br>°telefoon 02 217 77 00
          <br>°mail : <a href="mailto:info@sintlukas.brussels">info@sintlukas.brussels</a>
        <br>INSCHRIJVINGEN:
        <br>°basisschool: <a href="http://www.sintlukasbasisschool.be/" target="_blank">sintlukasbasisschool.be</a>
        <br>°humaniora: <a href="http://blog.sintlukaskunsthumaniora.be/" target="_blank">blog.sintlukaskunsthumaniora.be</a>
        <br>°academie: <a href="https://sintlukasacademie.brussels/" target="_blank">sintlukasacademie.brussels</a>
      </div>
      <div class="links">
        <a
          v-for="(l, key) in itemsOfRoom"
          :key="key"
          :href="l.link"
          target="_blank"
          class="link"
          :class="[{'link--active' : (activeLink  !== null && key === activeLink), 'link--nonActive': activeLink === null}]"
          :style="{'color': getColor(l.orb.type) }"
          @mouseover="setActive(key)"
          @mouseleave="setActive(null)"
        > <span v-if="l.division !== 'academie'">{{ l.year }} {{l.course }}</span><span v-if="l.year !== '' && l.course !== ''">: </span> {{ l.descr }} <span v-if="key < (itemsOfRoom.length-1)">/ </span></a>
      </div>
    </div>
    <!-- <iframe :src="activeLink" style="width:100%;height:100vh;"></iframe> -->
  </div>
</template>

<script>
import { locations, items, orbTypes } from "~/static/data.json";
import EventBus from "~/utils/event-bus";
import orbs from "~/components/Orb";
export default {
  components: {
    orbs
  },
  computed: {
    image() {
      if (!this.activeLocation) return;
      return require(`@/assets/squares/compressed/${this.activeRoom.img.base}`);
    },
    itemsOfRoom() {
      if (!this.location) return null;
      const filteredLinks = this.items.filter(i => i.room === this.room);
      return filteredLinks.sort((a, b) => a.year - b.year);
    },

    activeRoom() {
      if (!this.location || !this.room) return null;
      return this.locations[this.location].rooms[this.room];
    },
    activeLocation() {
      if (!this.room) return null;
      return this.locations[this.location];
    },
    orbSettings() {
      if (!this.itemsOfRoom) return null;
      let settings = this.itemsOfRoom.map((i, index) => {
        const orbMeta = {
          location: i.location,
          room: i.room,
          index: index,
          type: "link"
        };
        const orbType = orbTypes[i.orb.type];
        const orbTypeOverride = { ...orbType, ...i.orb.overrides };
        return {
          perlin: orbTypeOverride,
          position: i.orb.position,
          meta: orbMeta
        };
      });
      return settings;
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      room: null,
      location: null,
      activeLink: null,
      cursorClass: null,
      activeLink: null,
      orbTypes: orbTypes
    };
  },

  methods: {
    getColor(id) {
      const type = this.orbTypes[id];
      const r = type.rcolor * 255;
      const g = type.gcolor * 255;
      const b = type.bcolor * 255;
      return `rgb(${r},${g},${b})`;
    },
    setActive(id) {
      if (id === this.activeLink) return;
      if (id === null) {
        EventBus.$emit("DEACTIVATEORB", { room: null, link: id });
        return;
      }
      if (id === this.activeLink) return;
      EventBus.$emit("ACTIVATEORB", { room: null, link: id });
      this.activeLink = id;
    }
  },
  mounted() {
    this.room = this.$route.params.id;
    this.location = this.$route.params.location;
    // This event is coming from the threejs instance, when hovering over on an orb.
    EventBus.$on("MOUSEOVERORB", data => {
      // add a class so the cursor changes into a pointer
      if (data !== null) {
        this.cursorClass = "cursor";
        this.setActive(data.index);
      } else {
        this.cursorClass = null;
        this.setActive(null);
      }
    });
    // This event is coming from the threejs instance, when clicked on an orb. When clicked -> go to page
    EventBus.$on("MOUSEDOWNONORB", data => {
      if (data.type === "room") return;
      this.activeLink = this.itemsOfRoom[data.index].link;
       window.open(
        this.itemsOfRoom[data.index].link,
        '_blank' // <- This is what makes it open in a new window.
      );
    });
  }
};
</script>
