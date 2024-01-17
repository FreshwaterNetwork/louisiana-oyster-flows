<template>
  <q-slider
    v-model="opacity"
    label
    :min="0"
    :max="1"
    :step="0.1"
    dense
    style="width: 250px; margin: 5px auto auto auto; display: block"
    @change="setOpacity()"
  />
</template>

<script>
export default {
  data() {
    return {
      opacity: 0.8
    }
  },
  props: ['option'],
  methods: {
    setOpacity() {
      this.$store.commit('updateOpacityLayerId', this.option.id)
      this.$store.commit('updateSupportOpacity', this.opacity)
    }
  }
}
</script>
