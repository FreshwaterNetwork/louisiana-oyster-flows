<template>
  <div>
    <div>
      <q-checkbox
        v-model="this.layerOption"
        :val="option.value"
        :label="option.label"
        color="green"
        toggle-order="ft"
        @click="assignOpacity(this.option)"
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
    </div>
    <div
      v-if="this.layerOption.includes(this.option.label) == true"
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
import IconButton from './IconButton.vue'
import LayerSlider from './LayerSlider.vue'

export default {
  data() {
    return {
      slider: 0.8
    }
  },
  components: { IconButton, LayerSlider },
  props: ['type', 'layerOptions', 'option'],
  computed: {
    layerOption: {
      get() {
        return this.$store.state.layerOption
      },
      set(value) {
        this.$store.commit('updateLayerOption', value)
      }
    }
  },
  methods: {
    assignOpacity(val) {
      if (val.slider == false) {
        val.slider = true
      } else {
        val.slider = false
      }
    }
  }
}
</script>
