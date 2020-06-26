<template>
  <div>
    <div class="container">
      <navbar v-if="activeRoom" :photos="activeRoom.photos" :path="`${location}/${room}`">
        <div class="breadcrumbs">
          <nuxt-link class="underlined" to="/">Inleiding</nuxt-link> - <nuxt-link class="underlined" to="/map">Plattegrond</nuxt-link> - <nuxt-link class="underlined" :to="`/locations/${location}`">Blok {{ activeLocation.name }}</nuxt-link> - {{ activeRoom.name }}
        </div>
      </navbar>
      <div
        class="map"
        :class="cursorClass"
        @mouseleave="setActive(null)"
      ><template v-if="!loadOrbs">
        <nuxt-link
          v-for="(orb, key) in orbSettings"
          :key="'orb'+key"
          class="fallbackOrb"
          :class="[{'fallbackOrb--active' : (activeLink  !== null && orb.meta.index === activeLink)}]"
          :style="setStyle(orb)"
          :to="itemsOfRoom[orb.meta.index].link"
          target="_blank"

        >
        <div 
          class="grid__actions"
          @mouseover="setActive(orb.meta.index)"
          @mouseleave="setActive(null)"
        ></div></nuxt-link>
      </template>
      <orbs
          v-if="orbSettings && loadOrbs"
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
          <br>°mail : <nuxt-link to="mailto:info@sintlukas.brussels">info@sintlukas.brussels</nuxt-link>
        <br>INSCHRIJVINGEN:
        <br>°basisschool: <nuxt-link to="http://www.sintlukasbasisschool.be/" target="_blank">sintlukasbasisschool.be</nuxt-link>
        <br>°humaniora: <nuxt-link to="http://blog.sintlukaskunsthumaniora.be/" target="_blank">blog.sintlukaskunsthumaniora.be</nuxt-link>
        <br>°academie: <nuxt-link to="https://sintlukasacademie.brussels/" target="_blank">sintlukasacademie.brussels</nuxt-link>
      </div>
      <div class="legend links">
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
        ><span v-if="l.division !== 'academie'">{{l.course }}</span><span v-if="(l.year !== '' && l.course !== '' && l.division !== 'academie') && l.descr !== ''">: </span> {{ l.descr }}<span v-if="key < (itemsOfRoom.length-1)"> / </span>
        </a>
      </div>
    </div>
    <!-- <iframe :src="activeLink" style="width:100%;height:100vh;"></iframe> -->
  </div>
</template>

<script>
function webglAvailable() {
  try {
    var canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function hasTouch() {
  return (
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}


import { locations, items, orbTypes } from "~/static/data.json";
import EventBus from "~/utils/event-bus";
import navbar from "~/components/Navbar";

import orbs from "~/components/Orb";
export default {
  components: {
    orbs,
    navbar
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
      cursorClass: null,
      activeLink: null,
      orbTypes: orbTypes,
      loadOrbs: false
    };
  },

  methods: {
    setStyle(orb) {
      const color = `rgb(${orb.perlin.rcolor * 255}, ${orb.perlin.gcolor *
        255}, ${orb.perlin.bcolor * 255})`;
      const gradient = `radial-gradient(circle, ${color} 24%, rgb(255,255,255) 52%);`;
      const left = (orb.position.x + 0.9) / 0.02 + "%";
      const top = 100 - (orb.position.y + 1.1) / 0.02 + "%";
      return {
        left: left,
        top: top,
        background: `radial-gradient(${color}, #fff)`
      };
    },
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
        this.activeLink = id;
        return;
      }
      if (id === this.activeLink) return;
      
      EventBus.$emit("ACTIVATEORB", { room: null, link: id, index: id });
      this.activeLink = id;
    }
  },
  mounted() {
    this.room = this.$route.params.id;
    this.location = this.$route.params.location;


    // Check if the browser can handle the threejs and if we are on a touch device
    // if (webglAvailable() && !hasTouch()) {
      if (webglAvailable()) {
      this.loadOrbs = true;
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
      const link = this.itemsOfRoom[data.index].link
      if(link === this.activeLink) return
      this.activeLink = this.itemsOfRoom[data.index].link;
      window.open(
        link,
        '_blank' // <- This is what makes it open in a new window.
      );
      
      
    });
    }


  }
};
</script>
