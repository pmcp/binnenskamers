<template>
  <div class="container">
    <div class="map">
      <div class="map__img" >
        <img
          src="@/assets/squares/img12.png"
          alt="tekening van de hele plattegrond van het Sint Lukas-gebouw"
        />    
      </div>

      <div class="grid" :style="{ backgroundImage:`url('${colorImage}')`}">
        <a
          v-for="(loc, key) in locations"
          :key="key"
          :style="{ gridArea: loc.gridPos, backgroundColor:loc.color}"
          class="grid__item"
          :class="[{'grid__item--active' : (activeLocationId  !== null && key === activeLocationId)}]"
          :href="`locations/${key}`"
          @mouseover="setActive(key)"
        > 
        
        </a>
      </div>
    </div>
    <div class="legend">
      <div v-if="activeLocation">
        <!-- {{ activeLocation.name }} -->
      </div>

    <div class="legend__columns">
        <!-- <div v-if="allRooms">
          Lokalen: <a
            v-for="(i, key, index) in allRooms"
            :key="`activeItems_${key}`"
            :href="`locations/${i.location}/rooms/${key}`"
            
          >
            {{ i }} <span v-if="index < (Object.keys(activeRooms).length-1)">-</span>
          </a>
        </div> -->
        <div v-if="activeCourses">  
          Richtingen: <a
            v-for="(i, key, index) in activeCourses"
            :key="`activeItems_${key}`"
            :href="`locations/${i.location}/rooms/${i.room}`"
          > {{ i.name }} <span v-if="index < (Object.keys(activeCourses).length-1)">-</span>
            
          </a>
        </div>
        <div v-if="activeAcademy">
         Academie: <a v-for="(i, key) in activeAcademy" :key="`activeItems_${key}`" :href="`locations/${i.location}/rooms/${i.room}`">
            {{ i.year }} {{ i.course }} <span v-if="key < (activeAcademy.length-1)">-</span>
          </a>
        </div>
      </div>


      <!-- <div class="legend__columns">
        <div v-if="activeRooms">
          Lokalen: <a
            v-for="(i, key, index) in activeRooms"
            :key="`activeItems_${key}`"
            :href="`locations/${i.location}/rooms/${key}`"
          >
            {{ i.name }} <span v-if="index < (Object.keys(activeRooms).length-1)">-</span>
          </a>
        </div>
        <div v-if="activeCourses">  
          Richtingen: <a
            v-for="(i, key, index) in activeCourses"
            :key="`activeItems_${key}`"
            :href="`locations/${i.location}/rooms/${i.room}`"
          > {{ i.name }} <span v-if="index < (Object.keys(activeCourses).length-1)">-</span> 
          </a>
        </div>
        <div v-if="activeAcademy">
         Academie: <a v-for="(i, key) in activeAcademy" :key="`activeItems_${key}`" :href="`locations/${i.location}/rooms/${i.room}`">
            {{ i.year }} {{ i.course }} <span v-if="key < (activeAcademy.length-1)">-</span>
          </a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { locations, items, orbTypes } from "~/static/data.json";
export default {
  computed: {
    colorImage() {
      return require(`~/assets/squares/colors.png`)
    },
    allRooms(){
      let allRooms = [];
      if(!this.locations) return;
      for (let loc of Object.keys(this.locations)) {
        const rooms = this.locations[loc].rooms
        // if(!rooms) return 
        // for (let room of Object.keys(rooms)) {
        //   allRooms.push(rooms[room])
        // }
      }
      return allRooms
    },
    activeRooms() {
      if (this.activeLocation === null || this.activeLocation === undefined)
        return null;
      if (this.activeLocation.rooms.length === 0) return null;
      return this.activeLocation.rooms;
    },
    activeItems() {
      const activeItems = this.items.filter(i => i.location === this.activeLocationId);
      return activeItems.map(i => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g,'');
        return {...i, yearCourse: yearCourse, yearCourseTrimmed: yearCourseTrimmed }
      })
    },
    activeCourses() {
      if (this.activeItems === null) return null;
      if (this.activeItems.length  < 1) return null;
      return this.activeItems.reduce(
        (acc, i) => {
          const item = { name: i.yearCourse, room: i.room, location: i.location, key: i.yearCourseTrimmed }
          if(acc[item.key]) {
            acc[i.yearCourseTrimmed].total++
          } else {
            acc[item.key] = { ...item, total: 1 }
          }
          return acc
        }, {},
      );
    },
    activeAcademy() {
      if (this.activeItems === null) return null;
      if (this.activeItems.length  < 1) return null;
      const academyItems = this.activeItems.filter(i => i.division === 'academie')
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
    getColor(id) {
      // console.log(this.orbTypes, id)
      // const type = this.orbTypes[id];
      
      // const r = type.rcolor * 255;
      // const g = type.gcolor * 255;
      // const b = type.bcolor * 255;
      // return `rgb(${r},${g},${b})`;
    },
    setActive(id) {
      this.activeLocationId = id;  
    }
  }
};
</script>
