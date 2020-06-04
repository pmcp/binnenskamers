<template>
  <div>
    <orbs v-if="orbSettings" :settings="orbSettings" />
    <div class="container" @mouseleave="setActive(null)" v-if="activeLocation">
      <div class="img">
        <img :src="image" :alt="activeLocation.img.alt" />
      </div>
      <div class="grid">
        
        <!-- <a
          v-for="(room, id) in activeLocation.rooms"
          :key="id"
          :style="{gridArea: room.gridPos, backgroundColor:activeLocation.color}"
          class="grid__item"
          :href="`${location}/rooms/${id}`"
          @mouseover="setActive(id)"
        >
        </a> -->
      </div>
    </div>
    <div class="legend__columns container" v-if="activeLocation">
      <div>
        <h2>Lokalen</h2>
        <div v-for="(i, key) in activeLocation.rooms" :key="key" class="room" :class="[{'room--active' : (activeRoom  !== null && key === activeRoom), 'room--nonActive': activeRoom === null}]">
          {{ i.name }}
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
          room: i.room
        }
        const orbType = orbTypes[i.orb.type]
        const orbTypeOverride = {...orbType, ...i.orb.overrides}
        return { perlin: orbTypeOverride, position: i.orb.position, meta: orbMeta}
      })
      return settings;
    },
    image () {
      if (!this.activeLocation) return;
      return require(`@/assets/images/${this.activeLocation.img.base}`)
    },
    activeLocation(){
      if(!this.location) return;
      return this.locations[this.location]
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeRoom: null,
      location: null
    }
  },
  methods: {
    setActive(id) {
      if(id === this.activeRoom) return;
      this.activeRoom = id;
    }
  },
  mounted(){
    console.log('location')
    this.location = this.$route.params.id
    // This event is coming from the threejs instance, when hovering over on an orb.
    EventBus.$on("MOUSEOVER", data => {
      console.log(data)
      // this.setActive(data.room)
    });
    // This event is coming from the threejs instance, when clicked on an orb. When clicked -> go to page
    EventBus.$on("MOUSEDOWN", data => {
      this.$router.push({
        path: `${data.location}/rooms/${data.room}`
      });
      
    });
  }
};
</script>