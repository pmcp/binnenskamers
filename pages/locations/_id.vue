<template>
  <div class="container">
    <div
      class="breadcrumbs"
      v-if="activeLocation"
    >
      <a href="/">Inleiding</a> - <a href="/map">Plattegrond</a> - Blok {{ activeLocation.name }}
    </div>
    <div
      class="map"
      :class="cursorClass"
      @mouseleave="setActive(null)"
      v-if="activeLocation"
    >
      <orbs
        v-if="orbSettings"
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
            Lokalen: <a
              v-for="(i, key, index) in activeLocation.rooms"
              :key="`activeItems_${key}`"
              :href="`/locations/${i.location}/rooms/${key}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && key === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(key)"
              @mouseleave="setActive(null)"
            >
              {{ i.name }} <span v-if="index < (Object.keys(activeLocation.rooms).length-1)">/</span>
            </a>
          </div>
          <!-- TODO: Fix this when more basisschool -->
          <div v-if="activeLocation.name === 'G'">Basisschool: <a
              href="g/rooms/g104"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'g104' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('g104')"
              @mouseleave="setActive(null)"
            >Bureau Wim</a>
          </div>
          <div v-if="secundaryCourses || activeLocation.name === 'G'">
            Kunsthumaniora: <a
              href="g/rooms/g104"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'g104' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('g104')"
              @mouseleave="setActive(null)"
            >Bureau Kris</a>
            <a
              v-for="(i, key, index) in secundaryCourses"
              :key="`activeItems_${key}`"
              :href="`${i.location}/rooms/${i.room}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && i.room === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(i.room)"
              @mouseleave="setActive(null)"
            > {{ i.name }} <span v-if="index < (Object.keys(secundaryCourses).length-1)">/</span>

            </a>
          </div>
          <div v-if="academyCourses">
            <!-- TODO: Add these specific links programmatically -->
            Academie: <a
              v-if="activeLocation.name === 'G'"
              href="g/rooms/secretariaat"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'secretariaat' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('secretariaat')"
              @mouseleave="setActive(null)"
            >Bureau Ellen <span v-if="(Object.keys(academyCourses).length > 0)"> / </span></a>
            <a
              v-if="activeLocation.name === 'H'"
              href="h/rooms/leraarskamer"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && 'leraarskamer' === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive('leraarskamer')"
              @mouseleave="setActive(null)"
            >Leraarskamer<span v-if="Object.keys(academyCourses).length > 0 > 0"> / </span></a>
            <a
              v-for="(i, key, index) in academyCourses"
              :key="`activeItems_${key}`"
              :href="`${i.location}/rooms/${i.room}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && i.room === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(i.room)"
              @mouseleave="setActive(null)"
            >
              {{ i.name }} <span v-if="index < Object.keys(academyCourses).length - 1">/</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orbs from "~/components/Orb";
import EventBus from "~/utils/event-bus";
import { locations, items, orbTypes } from "~/static/data.json";
export default {
  components: {
    orbs
  },
  computed: {
    orbSettings() {
      if (!this.activeLocation) return null;
      const object = this.activeLocation.rooms;

      // Make an array of the object
      const rooms = Object.keys(object).map(key => {
        return { ...object[key], room: key };
      });
      let settings = rooms.map(i => {
        const orbMeta = {
          location: i.location,
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

      return require(`@/assets/squares/${this.activeLocation.img.base}`);
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
        i => i.cat === "secundary" && i.type === "class"
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
    },

  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeRoom: null,
      location: null,
      cursorClass: null
    };
  },
  methods: {
    setActive(id) {
      // if(this.activeRoom = id;)
      if (id === null) {
        EventBus.$emit("DEACTIVATEORB", { room: id, link: null });
        return;
      }
      if (id === this.activeRoom) return;
      EventBus.$emit("ACTIVATEORB", { room: id, link: null });
      this.activeRoom = id;
    }
  },
  mounted() {
    this.location = this.$route.params.id;
    // This event is coming from the threejs instance, when hovering over on an orb.
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
};
</script>