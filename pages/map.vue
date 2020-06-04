<template>
  <div class="container">
    <div class="img">
      <img
        src="@/assets/images/map.png"
        alt="tekening van de hele plattegrond van het Sint Lukas-gebouw"
      />    
    </div>
    <div
      class="grid"
      @mouseleave="setActive(null)"
    >
      <a
        v-for="(loc, id) in locations"
        :key="id"
        :style="{ gridArea: loc.gridPos, backgroundColor:loc.color}"
        class="grid__item"
        :href="`locations/${id}`"
        @mouseover="setActive(id)"
      > 
      </a>
    </div>
    <div v-if="activeLocation">
      {{ activeLocation.name }}
    </div>

    <div class="legend__columns">
      <div v-if="activeRooms">
        <h2>Lokalen</h2>
        <div
          v-for="(i, key) in activeRooms"
          :key="`activeItems_${key}`"
        >
          {{ i.name }}
        </div>
      </div>
      <div v-if="activeCourses">
        <h2>Richtingen</h2>
        <div
          v-for="(i, key) in activeCourses"
          :key="`activeItems_${key}`"
        >
          {{ i }}
        </div>
      </div>
      <!-- <div>
        <h2>Academie</h2>
        <div v-for="(i, key) in activeAcademy" :key="`activeItems_${key}`">
          {{ i.year }} {{ i.cours }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { locations, items } from "~/static/data.json";
export default {
  computed: {
    activeRooms() {
      if (this.activeLocation === null || this.activeLocation === undefined)
        return null;
      if (this.activeLocation.rooms.length === 0) return null;
      return this.activeLocation.rooms;
    },
    activeCourses() {
      if (this.activeItems === null) return null;
      const courses = this.activeItems.map(i => `${i.year} ${i.course}`);
      const uniqueCourses = courses.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        []
      );
      console.log(uniqueCourses);
      if (uniqueCourses.length === 0) return null;
      return uniqueCourses;
    },
    activeItems() {
      return this.items.filter(i => i.location === this.activeLocationId);
    },
    activeLocation() {
      if (this.activeLocationId === null) return null;
      return this.locations[this.activeLocationId];
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeLocationId: null
    };
  },
  components: {
    // pageWithBlob
  },
  methods: {
    setActive(id) {
      this.activeLocationId = id;
    }
  }
};
</script>
