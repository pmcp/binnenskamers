<template>
  <div class="container">
    <navbar v-if="activeLocation" :photos="activeLocation.photos" :path="location">
      <div
        class="breadcrumbs"
      >
        <nuxt-link class="underlined" to="/">Inleiding</nuxt-link> - <nuxt-link class="underlined" to="/map">Plattegrond</nuxt-link> - Blok {{ activeLocation.name }}
        </div>
    </navbar>
    <div
      class="map"
      :class="cursorClass"
      @mouseleave="setActive(null)"
      v-if="activeLocation"
    >
      <template v-if="!loadOrbs">
        <nuxt-link
          v-for="(orb, key) in orbSettings"
          :key="'orb'+key"
          class="fallbackOrb"
          :class="[{'fallbackOrb--active' : (activeRoom  !== null && orb.meta.room === activeRoom)}]"
          :style="setStyle(orb)"
          :to="`/locations/${orb.meta.location}/rooms/${orb.meta.room}`"
          @mouseover="setActive(orb.meta)"
          @mouseleave="setActive(null)"
        ></nuxt-link>
      </template>
      <orbs
        v-if="orbSettings && loadOrbs"
        :settings="orbSettings"
      />
      <div class="map__img">
        <img
          :src="image"
          :alt="activeLocation.img.alt"
        />
      </div>
    </div>
    <div class="legend">
      <div v-if="activeLocation">
        <div class="legend__columns">
          <div v-if="activeLocation.rooms">
            Lokalen: <nuxt-link
              v-for="(i, key, index) in activeLocation.rooms"
              :key="`activeItems_${key}`"
              :to="`/locations/${i.location}/rooms/${key}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && key === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(key)"
              @mouseleave="setActive(null)"
            > 
              {{ i.name }} <span v-if="index < (Object.keys(activeLocation.rooms).length-1)">/</span>
            </nuxt-link>
          </div>
          <!-- TODO: Fix this when more basisschool -->
          <div v-if="activeLocation.name === 'G'">Basisschool: <nuxt-link
              to="g/rooms/g104"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'g104' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('g104')"
              @mouseleave="setActive(null)"
            >Bureau Wim</nuxt-link>
          </div>
          <div v-if="secundaryCourses || activeLocation.name === 'G'">
            Kunsthumaniora:
            <nuxt-link
              to="g/rooms/g104"
              class="link"
              v-if="activeLocation.name === 'G'"
              :class="[{'link--active' : (activeRoom  !== null && 'g104' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('g104')"
              @mouseleave="setActive(null)"
            >Bureau Kris</nuxt-link>
            <nuxt-link
              v-for="(i, key, index) in secundaryCourses"
              :key="`activeItems_${key}`"
              :to="`${i.location}/rooms/${i.room}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && i.room === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(i.room)"
              @mouseleave="setActive(null)"
            > {{ i.name }} <span v-if="index < (Object.keys(secundaryCourses).length-1)">/</span>
            </nuxt-link>
          </div>
          <div v-if="academyCourses">
            <!-- TODO: Add these specific links programmatically -->
            Academie: <nuxt-link
              v-if="activeLocation.name === 'G'"
              to="g/rooms/secretariaat"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'secretariaat' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('secretariaat')"
              @mouseleave="setActive(null)"
            >Bureau Ellen <span v-if="(Object.keys(academyCourses).length > 0)"> / </span></nuxt-link>
            <nuxt-link
              v-for="(i, key, index) in academyCourses"
              :key="`activeItems_${key}`"
              :to="`${i.location}/rooms/${i.room}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && i.room === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(i.room)"
              @mouseleave="setActive(null)"
            >
              {{ i.name }} <span v-if="index < Object.keys(academyCourses).length - 1">/</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
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

import navbar from "~/components/Navbar";
import orbs from "~/components/Orb";
import EventBus from "~/utils/event-bus";
import { locations, items, orbTypes } from "~/static/data.json";
export default {
  components: {
    orbs,
    navbar
  },
  computed: {
    orbSettings() {
      if (!this.activeLocation) return null;
      const object = this.activeLocation.rooms;

      // Make an array of the object
      const rooms = Object.keys(object).map(key => {
        return { ...object[key], room: key };
      });
      
      let settings = rooms.map((i,index) => {
        
        const orbMeta = {
          location: i.location,
          index: i.room,
          room: i.room,
          type: "room"
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
    },
    image() {
      if (!this.activeLocation) return;

      return require(`@/assets/squares/compressed/${this.activeLocation.img.base}`);
    },
    activeLocation() {
      if (!this.location) return;
      return this.locations[this.location];
    },
    activeItems() {
      const activeItems = this.items.filter(i => i.location === this.location);
      return activeItems.map(i => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g, "");
        return {
          ...i,
          yearCourse: yearCourse,
          yearCourseTrimmed: yearCourseTrimmed
        };
      });
    },
    secundaryCourses() {
      if (this.activeItems.length < 1) return;

      const filteredItems = this.activeItems.filter(
        i => {
          if(i.hideOnLocation === true ) return;
          if(i.cat === "secundary" && i.type === "class") return i
        }
      );

      const reducedItems = filteredItems.reduce((prevValue, i) => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g, "");
        const key = i.course.replace(/ /g, "");
        const item = {
          name: i.course,
          room: i.room,
          location: i.location,
          key: key
        };
        if (prevValue[item.key]) {
          // prevValue[yearCourseTrimmed].total++;
        } else {
          prevValue[item.key] = { ...item };
        }
        return prevValue;
      }, {});
      return reducedItems;
    },
    academyCourses() {
      if (this.activeItems.length < 1) return;
      const filteredItems = this.activeItems.filter(
        i => i.cat === "academy" && i.type === "class"
      );
      const reducedItems = filteredItems.reduce((prevValue, i) => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g, "");
        const item = {
          name: i.course,
          room: i.room,
          location: i.location,
          key: yearCourseTrimmed
        };
        if (prevValue[item.key]) {
          prevValue[yearCourseTrimmed].total++;
        } else {
          prevValue[item.key] = { ...item, total: 1 };
        }
        return prevValue;
      }, {});
      return reducedItems;
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeRoom: null,
      location: null,
      cursorClass: null,
      loadOrbs: false
    };
  },
  methods: {
    setStyle(orb) {
      // console.log(orb);
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
    setActive(id) {

      if (id === null) {
        EventBus.$emit("DEACTIVATEORB", { room: id, link: null });
        this.activeRoom = id;
        return;
      }
      if (id === this.activeRoom) return;
      EventBus.$emit("ACTIVATEORB", { room: id, link: null, index: id });
      this.activeRoom = id;
    }
  },
  mounted() {
    this.location = this.$route.params.id;

    // Check if the browser can handle the threejs and if we are on a touch device
    // if (webglAvailable() && !hasTouch()) {
    if (webglAvailable()) {
      this.loadOrbs = true;
      EventBus.$on("MOUSEOVERORB", data => {
        
        // add a class so the cursor changes into a pointer
        if (data !== null) {
          this.cursorClass = "cursor";
          this.setActive(data.room);
        } else {
          this.cursorClass = null;
          this.setActive(null);
        }
      });
      // This event is coming from the threejs instance, when clicked on an orb. When clicked -> go to page
      EventBus.$on("MOUSEDOWNONORB", data => {
        if (data.type === "link") return;
        this.$router.push({
          path: `${data.location}/rooms/${data.room}`
        });
      });
    }
  }
};
</script>