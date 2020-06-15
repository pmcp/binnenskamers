<template>
  <div class="container">
    <div class="breadcrumbs">
      <a href="/">Inleiding</a> - Plattegrond
    </div>
    <div class="map">
      <div class="map__img">
        <img
          src="@/assets/squares/compressed/img12.jpg"
          alt="tekening van de hele plattegrond van het Sint Lukas-gebouw"
        />
      </div>

      <div
        class="grid"
      >
        <a
          v-for="(loc, key) in locations"
          :key="key"
          :style="locStyle(loc.gridPos, loc.hoverImg)"
          class="grid__item"
          :class="[{'grid__item--active' : (activeLocationId  !== null && key === activeLocationId)}]"
          :href="`/locations/${key}`"
          @mouseover="setActive(key)"
        >

        </a>
      </div>
    </div>
    <div class="legend">
      <div v-if="allRooms">
        Lokalen: <a
          v-for="(i, key) in allRooms"
          :key="`activeItems_${key}`"
          :href="`locations/${i.location}/rooms/${i.id}`"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && i.location === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive(i.location)"
          @mouseleave="setActive(null)"
        >{{ i.name }}<span v-if="key < (Object.keys(allRooms).length - 1)"> / </span>
        </a>
      </div>

      <div>
        Basisschool: <a
          href="locations/g/rooms/g104"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && 'g' === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive('g')"
          @mouseleave="setActive(null)"
        >Algemene Info /</a>
      </div>
      <div>
        Kunsthumaniora: <a
          href="locations/g/rooms/g104"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && 'g' === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive('g')"
          @mouseleave="setActive(null)"
        >Algemene Info / </a>
        <a
          v-for="(i, key, index) in secundaryCourses"
          :key="`activeItems_${key}`"
          :href="`locations/${i.location}/rooms/${i.room}`"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && i.location === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive(i.location)"
          @mouseleave="setActive(null)"
        >{{ i.name }}<span v-if="index < (Object.keys(secundaryCourses).length - 1)"> / </span>
        </a>
      </div>

      <div>
        Academie: <a
          href="locations/g/rooms/g104"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && 'g' === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive('g')"
          @mouseleave="setActive(null)"
        >Algemene Info /</a>
        <a
          v-for="(i, key, index) in academyCourses"
          :key="`activeItems_${key}`"
          :href="`locations/${i.location}/rooms/${i.room}`"
          class="link"
          :class="[{'link--active' : (activeLocationId  !== null && i.location === activeLocationId), 'link--nonActive': activeLocationId === null}]"
          @mouseover="setActive(i.location)"
          @mouseleave="setActive(null)"
        >{{ i.name }}<span v-if="index < (Object.keys(academyCourses).length - 1)"> / </span>
        </a>
      </div>
    </div>
  </div>

</template>

<script>
import { locations, items, orbTypes } from "~/static/data.json";
export default {
  computed: {
    allRooms() {
      let allRooms = [];
      if (!this.locations) return;
      for (let loc of Object.keys(this.locations)) {
        const rooms = this.locations[loc].rooms;
        if (!rooms) return;
        for (let room of Object.keys(rooms)) {
          const roomToPush = { ...rooms[room], id: room };
          allRooms = [...allRooms, roomToPush];
        }
      }
      // Alfabetical sorting (doesn't work with capitalised)
      allRooms.sort((a, b) => a.id.localeCompare(b.id));
      return allRooms;
    },
    activeRooms() {
      if (this.activeLocation === null || this.activeLocation === undefined)
        return null;
      if (this.activeLocation.rooms.length === 0) return null;
      return this.activeLocation.rooms;
    },
    academyCourses() {
      const filteredItems = this.items.filter(
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
    secundaryCourses() {
      const filteredItems = this.items.filter(
        i => i.cat === "secundary" && i.type === "class"
      );
      const reducedItems = filteredItems.reduce((prevValue, i) => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g, "");
        const item = {
          name: yearCourse,
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
    activeAcademy() {
      if (this.activeItems === null) return null;
      if (this.activeItems.length < 1) return null;
      const academyItems = this.activeItems.filter(
        i => i.division === "academie"
      );
      return academyItems;
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
      activeLocationId: "5"
    };
  },
  methods: {
    locStyle(pos, img) {
      const image = require(`@/assets/letters/${img}`);
      const style = {
        gridArea: pos,
        background: `url(${image}) no-repeat center center`
      }
      return style;
    },
    setActive(id) {
      console.log(id);
      this.activeLocationId = id;
    }
  }
};
</script>
