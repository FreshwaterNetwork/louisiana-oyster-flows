<template>
  <create-tab
    v-for="option in layerOptions"
    :key="option"
    :option="option"
    type="intense"
  ></create-tab>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'

export default {
  name: 'tab3',
  components: { CreateTab },
  data() {
    return {
      layerOptions: [
        {
          label: 'Layer',
          value: 'Layer',
          desc: '',
          slider: false,
          id: 0,
          showDesc: false
        },
        {
          label: 'Layer',
          desc: '',
          slider: false,
          id: 1,
          showDesc: false
        }
      ]
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
