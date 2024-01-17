<template>
  <div v-for="option in layerOptions" :key="option">
    <create-tab :option="option" type="current"></create-tab>
  </div>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'

export default {
  name: 'tab1',
  components: { CreateTab },
  data() {
    return {
      layerOptions: [
        {
          label: 'Flowlines',
          value: 'Flowlines',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 0,
          showDesc: false
        },
        {
          label: 'Watersheds',
          value: 'Watersheds',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 1,
          showDesc: false
        }
      ]
    }
  },
  computed: {
    layerOption: {
      get() {
        return this.$store.state.layerOption
      },
      set(value) {
        this.$store.commit('updateLayerOption', value)
      }
    },
    presenceOpacity: {
      get() {
        return this.$store.state.presenceOpacity
      },
      set(value) {
        this.$store.commit('updatePresenceOpacity', value)
      }
    },
    abundanceOpacity: {
      get() {
        return this.$store.state.abundanceOpacity
      },
      set(value) {
        this.$store.commit('updateAbundanceOpacity', value)
      }
    },
    tempOpacity: {
      get() {
        return this.$store.state.tempOpacity
      },
      set(value) {
        this.$store.commit('updateTempOpacity', value)
      }
    },
    precipOpacity: {
      get() {
        return this.$store.state.precipOpacity
      },
      set(value) {
        this.$store.commit('updatePrecipOpacity', value)
      }
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#print-header {
  position: absolute;
  top: 0px;
  height: 30px;
}
#print-footer {
  position: absolute;
  bottom: 0px;
  height: 30px;
}
#print-map {
  position: absolute;
  top: 30px;
  height: 500px;
}
</style>
