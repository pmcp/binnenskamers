<template>
  <div class="container">
    <div class="breadcrumbs" v-if="activeLocation">
      <a href="/map">Plattegrond</a> - Blok {{ activeLocation.name }}
    </div>
    <div class="map" :class="cursorClass" @mouseleave="setActive(null)" v-if="activeLocation">
      <orbs v-if="orbSettings" :settings="orbSettings" />
      <div class="map__img" >
        <img :src="image" :alt="activeLocation.img.alt" />
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
              {{ i.name }}    <span v-if="index < (Object.keys(activeLocation.rooms).length-1)">-</span>  
            </a>
          </div>
          <div>
            Richtingen: <a
              v-for="(i, key, index) in activeCourses"
              :key="`activeItems_${key}`"
              :href="`${i.location}/rooms/${i.room}`"
              class="link"
              :class="[{'link--active' : (activeRoom  !== null && i.room === activeRoom), 'link--nonActive': activeRoom === null}]"
              @mouseover="setActive(i.room)"
              @mouseleave="setActive(null)"
            > {{ i.name }}  {{ activeCourses.length}} <span v-if="index < (Object.keys(activeCourses).length-1)">-</span>
              
            </a>
          </div>
        <div v-if="activeAcademy">
         Academie: <a v-for="(i, key) in activeAcademy" :key="`activeItems_${key}`" :href="`locations/${i.location}/rooms/${i.room}`">
            {{ i.year }} {{ i.course }}  <span v-if="key < Object.keys(activeAcademy).length-1">-</span>
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
      if(!this.activeLocation) return null;  
      const object = this.activeLocation.rooms;
      
      // Make an array of the object
      const rooms = Object.keys(object).map(key => {
        return { ...object[key], room: key } }
      )
      let settings = rooms.map(i => {
        const orbMeta = {
          location: i.location,
          room: i.room,
          type: 'room'
        }
        const orbType = orbTypes[i.orb.type]
        const orbTypeOverride = {...orbType, ...i.orb.overrides}
        return { perlin: orbTypeOverride, position: i.orb.position, meta: orbMeta}
      })
      return settings;
    },
    image () {
      if (!this.activeLocation) return;
      
      return require(`@/assets/squares/${this.activeLocation.img.base}`)
    },
    activeLocation(){
      if  (!this.location) return;
      return this.locations[this.location]
    },
    activeItems() {  
      const activeItems = this.items.filter(i => i.location === this.location);
      return activeItems.map(i => {
        const yearCourse = `${i.year} ${i.course}`;
        const yearCourseTrimmed = yearCourse.replace(/ /g,'');
        return {...i, yearCourse: yearCourse, yearCourseTrimmed: yearCourseTrimmed }
      })
    },
    activeCourses() {
      if(this.activeItems.length < 1) return
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
      console.log(academyItems)
      return academyItems;
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeRoom: null,
      location: null,
      cursorClass:null
    }
  },
  methods: {
    setActive(id) {
      // if(this.activeRoom = id;)
      if(id === null) {
        EventBus.$emit("DEACTIVATEORB", { room: id, link: null });
        return;
      }
      if(id === this.activeRoom) return;
      EventBus.$emit("ACTIVATEORB", { room: id, link: null });
      this.activeRoom = id;
    }
  },
  mounted(){
    this.location = this.$route.params.id
    // This event is coming from the threejs instance, when hovering over on an orb.
    EventBus.$on("MOUSEOVERORB", data => {
      // add a class so the cursor changes into a pointer
      if(data !== null) {
        this.cursorClass = 'cursor'
        this.setActive(data.room)
      } else {
        this.cursorClass = null
        this.setActive(null)
      }
      
    });
    // This event is coming from the threejs instance, when clicked on an orb. When clicked -> go to page
    EventBus.$on("MOUSEDOWNONORB", data => {
      if(data.type === 'link') return;
      console.log('room', data.type)
      this.$router.push({ 
        path: `${data.location}/rooms/${data.room}`
      });
    });
  }
};
</script>