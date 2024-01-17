<template>
  <div>
    <q-scroll-area
      id="panelM"
      class="panel panelM q-pa-md"
      :thumb-style="{ width: '7px' }"
    >
      <div class="q-pr-lg">
        <SupportingLayers
          displayClass="supportingLayersPanel"
        ></SupportingLayers>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import SupportingLayers from '../AppTools/SupportingLayers.vue';

export default {
  name: 'ThePanel',
  components: {
    SupportingLayers,
  },
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel {
  height: calc(100vh - 50px);
}

@media screen and (max-width: 700px) {
  .panel {
    height: calc(100vh - 310px);
  }
}
</style>
