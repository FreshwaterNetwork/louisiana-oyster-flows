<template>
  <div v-for="option in layerOptions" :key="option">
    <q-checkbox
      v-model="this.supportingOption"
      :val="option.value"
      :label="option.label"
      color="green"
      toggle-order="ft"
    />
    <icon-button
      v-if="option.showDesc == false"
      type="info"
      method="show-desc"
      @show-desc="option.showDesc = !option.showDesc"
      style="margin-left: 5px; width: 20px; height: 20px"
    ></icon-button>
    <icon-button
      v-if="option.showDesc == true"
      type="close"
      method="hide-desc"
      @hide-desc="option.showDesc = !option.showDesc"
      style="margin-left: 5px; width: 20px; height: 20px"
    ></icon-button>
    <div v-if="option.showDesc == true" class="q-ml-lg">
      {{ option.desc }}
    </div>
    <div
      v-if="this.supportingOption.includes(option.label) == true"
      style="display: inline-flex; position: relative; margin: auto 10% auto 10%"
    >
      <div class="col-1" style="margin-right: 5px">
        <q-icon color="secondary" name="opacity" size="xs" />
      </div>
      <div class="col-11 q-pr-xl">
        <layer-slider :option="option"></layer-slider>
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from '../UI/IconButton.vue'
import LayerSlider from '../UI/LayerSlider.vue'

export default {
  name: 'layers',
  components: { IconButton, LayerSlider },
  data() {
    return {
      layerOptions: [
        {
          label: 'Mangrove Presence/Absence Grid',
          value: 'Mangrove Presence/Absence Grid',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 0,
          showDesc: false
        },
        {
          label: 'Mangrove Protection Status',
          value: 'Mangrove Protection Status',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 1,
          showDesc: false
        },
        {
          label: 'Tidal Wetland Complexes',
          value: 'Tidal Wetland Complexes',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 2,
          showDesc: false
        },
        {
          label: 'Inland Wetland Migration Space',
          value: 'Inland Wetland Migration Space',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          slider: false,
          id: 3,
          showDesc: false
        }
      ]
    }
  },
  computed: {
    supportingOption: {
      get() {
        return this.$store.state.supportingOption
      },
      set(value) {
        this.$store.commit('updateSupportingOption', value)
      }
    },
    supportOpacity: {
      get() {
        return this.$store.state.supportOpacity
      },
      set(value) {
        this.$store.commit('updateSupportOpacity', value)
      }
    }
  }
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
