<template>
  <div>
    <div class="container" @mouseleave="setActive(null)">
      <div class="img">
        <img :src="image" :alt="activeLocation.img.alt" />
      </div>
      <div class="grid">
        <div
          v-for="(room, id) in activeLocation.rooms"
          :key="id"
          :style="{gridArea: room.gridPos, backgroundColor:activeLocation.color}"
          class="grid__item"
          @click="goTo(`location/${id}`)"
          @mouseover="setActive(id)"
        >
        </div>
      </div>
    </div>
    <div class="legend__columns">
      <div>
        <h2>Lokalen</h2>
        <div v-for="(i, key) in activeLocation.rooms" :key="key" class="room" :class="[{'room--active' : (activeRoom  !== null && key === activeRoom), 'room--nonActive': activeRoom === null}]">
          {{ i.name }}
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
  props: {
    location: {
      type: String,
      default: "1"
    },
  },
  computed: {
    image () {
      if (!this.activeLocation) return;
      return require(`../assets/images/${this.activeLocation.img.base}`)
    },
    activeLocation(){
      return this.locations[this.location]
    }
  },
  asyncData({ params }) {
    return { locations, items };
  },
  data() {
    return {
      activeRoom: null
    }
  },
  methods: {
    setActive(id) {
      if(id === this.activeRoom) return;
      this.activeRoom = id;
    },
    goTo(path) {
      this.$router.push({
        path: path
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 50vw;
  width: 50vw;
  img {
    width: 100%;
    height: auto;
  }
}

.img {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
}


.legend__columns {
  display: flex;
  width: 100%;
}

.room {
  opacity: .2;
  
  &--active {
  opacity: 1;
  }

  &--nonActive {
    opacity: 1;
  }

}
</style>
