<template>
  <div>
    <div
      class="container"
      @mouseleave="setActive(null)"
    >
      <div class="img" v-if="activeRoom">
        <img
          :src="image"
          :alt="activeRoom.img.alt"
        />
      </div>
      <div class="grid">
        
        <orbs v-if="orbSettings" :settings="orbSettings" />
        <div
          v-for="(item, key) in itemsOfRoom"
          :key="key"
          :style="{gridArea: item.gridPos}"
          class="grid__item"
          :class="[{'grid__item--hover': (activeLink  !== null && key === activeLink)}]"
          @click="goTo(`location/${key}`)"
          @mouseover="setActive(key)"
          @mouseleave="setActive(null)"
        >

        </div>
      </div>
    </div>
    <div class="legend__columns">
      <div>
        <h2>Links</h2>
        <div
          v-for="(l, key) in itemsOfRoom"
          :key="key"
          class="link"
          :class="[{'link--active' : (activeLink  !== null && key === activeLink), 'link--nonActive': activeLink === null}]"
        >
          <a
            :href="l.link"
            target="_blank"
            @mouseover="setActive(key)"
            @mouseleave="setActive(null)"
          >{{ l.descr }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locations, items, orbTypes } from "~/static/data.json";
import orbs from "~/components/Orb";
export default {
  components: {
    orbs
  },
  computed: {
    image() {
      if (!this.activeLocation) return;
      return require(`@/assets/images/${this.activeRoom.img.base}`);
    },
    itemsOfRoom() {
      if(!this.location) return null;
      
      return this.items.filter(i => i.room === this.room);
    },

    activeRoom() {
      if(!this.location || !this.room) return null;
      return this.locations[this.location].rooms[this.room];
    },
    activeLocation() {
      if(!this.room) return null;
      return this.locations[this.location];
    },
    orbSettings(){
      if(!this.itemsOfRoom) return null;  
      let settings = this.itemsOfRoom.map(i => {
        const orbType = orbTypes[i.orb.type]
        const orbTypeOverride = {...orbType, ...i.orb.overrides}
        return { perlin: orbTypeOverride, position: i.orb.position}
      })
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
      activeLink: null
    };
  },

  methods: {
    setActive(id) {
      if (id === this.activeLink) return;
      this.activeLink = id;
    }
  },
  mounted () {
    this.room = this.$route.params.id
    this.location = this.$route.params.location
  },
};
</script>

<style lang="scss" scoped>

.grid {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  &__item {
    position: relative;
    // opacity: 0;
    &--hover {
      opacity: 1;
    }
  }
}

.legend__columns {
  display: flex;
  width: 100%;
}

.link {
  opacity: 0.2;

  &--active {
    opacity: 1;
  }

  &--nonActive {
    opacity: 1;
  }
}
</style>
