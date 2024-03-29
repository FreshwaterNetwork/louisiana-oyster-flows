<template>
  <div id="map">
    <div id="supportingLayers" v-if="$store.state.config.supportingLayersOnMap">
      <SupportingLayers displayClass="supportingLayersMap" />
    </div>
  </div>
</template>

<script>
import SupportingLayers from '../AppTools/SupportingLayers.vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Legend from '@arcgis/core/widgets/Legend'
import Measurement from '@arcgis/core/widgets/Measurement'
import Expand from '@arcgis/core/widgets/Expand'
//import PortalSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Portal from '@arcgis/core/portal/Portal'
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource'

//global in order to have access to the maplayer
let esri = {
  mapView: '',
  modelLayer: '',
  supportingMapLayer: '',
  legend: '',
  map: '',
  measurement: '',
  lgExpand: '',
  mapImageLayer: ''
}

export default {
  name: 'TheMap',
  components: {
    SupportingLayers
  },
  data() {
    return {
      active: true
    }
  },
  computed: {
    supportingMapVisibleLayers() {
      //returns list of all ticked objects [{mapService: index in config, id: layerid, type: type}, ...]
      return this.$store.state.tree.tickedObj
    },
    supportingVisibleLayerOpacity() {
      //returns object {value: OpacVal, id: Layerid}
      return this.$store.state.supportingVisibleLayerOpacity
    },
    mangroveLayer: {
      get() {
        return this.$store.state.mangroveLayer
      },
      set(value) {
        this.$store.commit('updateMangroveLayer', value)
      }
    },
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
    },
    tabSupLayers: {
      get() {
        return this.$store.state.tabSupLayers
      },
      set(value) {
        this.$store.commit('updateTabSupLayers', value)
      }
    },
    selectedOption: {
      get() {
        return this.$store.state.selectedOption
      },
      set(value) {
        this.$store.commit('updateSelectedOption', value)
      }
    },
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
    },
    opacityLayerId() {
      return this.$store.state.opacityLayerId
    }
  },
  watch: {
    supportingMapVisibleLayers() {
      this.updateSupportingVisibility()
    },
    supportingVisibleLayerOpacity() {
      this.updateSupportingOpacity()
    },
    layerOption() {
      this.changeMangroveLayers()
    },
    supportingOption() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider == 'support') {
          if (this.supportingOption.includes(layer.title) == true) {
            layer.visible = true
          } else {
            layer.visible = false
          }
        }
      })
    },
    mangroveLayer() {
      if (this.mangroveLayer == 'current') {
        if (this.layerOption !== []) {
          this.manageLayerVis(this.layerOption, this.supportingOption)
        }
      } else if (this.mangroveLayer == 'moderate') {
        if (this.layerOption !== []) {
          this.manageLayerVis(this.layerOption, this.supportingOption)
        }
      } else if (this.mangroveLayer == 'intense') {
        if (this.layerOption !== []) {
          this.manageLayerVis(this.layerOption, this.supportingOption)
        }
      } else if (this.mangroveLayer == 'support') {
        this.mangroveLayer = this.mangroveLayer
      }
    },
    presenceOpacity() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider === 'presence') {
          layer.opacity = this.presenceOpacity
        }
      })
    },
    abundanceOpacity() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider === 'abundance') {
          layer.opacity = this.abundanceOpacity
        }
      })
    },
    tempOpacity() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider === 'temp') {
          layer.opacity = this.tempOpacity
        }
      })
    },
    precipOpacity() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider === 'precip') {
          layer.opacity = this.precipOpacity
        }
      })
    },
    supportOpacity() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.id == this.opacityLayerId) {
          layer.opacity = this.supportOpacity
        }
      })
    }
  },

  mounted() {
    // Portal IDs for TNC Basemaps. Use any id to set the map's basemap.

    const tncHillshadeMapId = 'd22aed9a4acb4bc8ae8f2141732af496'
    //const tncDarkMapId = '1f48b2b2456c44ad9c58d6741378c2ba';
    // const oceansMapId = '67ab7f7c535c4687b6518e6d2343e8a2';
    // const hybridMapId = '86265e5a4bbb4187a59719cf134e0018';

    //select a basemap
    esri.map = new Map({
      basemap: {
        portalItem: {
          id: tncHillshadeMapId
        }
      }
    })

    //create the map view
    esri.mapView = new MapView({
      map: esri.map,
      //center: [-70.99501567725498, 42.310350073610834],

      center: [-91.786241, 31.320971],
      zoom: 7,
      container: this.$el
    })

    //add supporting map layers listed in config
    this.$store.state.config.supportingMapLayers.forEach((service) => {
      let l = new MapImageLayer({
        url: service.mapService
      })
      esri.map.add(l)
      l.when(function () {
        //create sublayer list
        let sublayerList = []
        let layer = esri.map.layers.items.find((layer) => {
          return layer.type == 'map-image' && layer.url == service.mapService
        })
        // console.log(layer) //todo figure out why layer.sublayers is not working

        l.allSublayers.items.forEach((sublayer) => {
          //see if popup template recrod exists...
          let popups = service.popupTemplate
          let layerConfig = popups.find(({ id }) => id == sublayer.id)
          //if the template is configured
          if (layerConfig) {
            //create template
            let fieldInfos = layerConfig.fields
            let template = {
              actions: [],
              content: [
                {
                  type: 'fields',
                  fieldInfos: fieldInfos
                }
              ]
            }
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1,
              popupTemplate: template
            })
            console.log(sublayer.id, layerConfig.fields)
          }
          //if there is no popup push without a template
          else {
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1
            })
          }
        })
        l.sublayers = sublayerList
      })
    })

    //code to add highlight feature for map image layer
    // esri.mapView.popup.watch('selectedFeature', function (gra) {
    //   if (gra) {
    //     esri.mapView.graphics.removeAll()
    //     var h = esri.mapView.highlightOptions
    //     gra.symbol = {
    //       type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    //       color: [h.color.r, h.color.g, h.color.b, 0],
    //       outline: {
    //         // autocasts as new SimpleLineSymbol()
    //         color: [h.color.r, h.color.g, h.color.b, h.color.a],
    //         width: 1
    //       }
    //     }
    //     esri.mapView.graphics.add(gra)
    //   } else {
    //     esri.mapView.graphics.removeAll()
    //   }
    // })

    // esri.mapView.popup.watch('visible', function (vis) {
    //   if (!vis) {
    //     esri.mapView.graphics.removeAll()
    //   }
    // })

    //add supporting layers widget to map if true
    if (this.$store.state.config.supportingLayersOnMap) {
      let supportingLayersExpand = new Expand({
        expandIconClass: 'esri-icon-layer-list',
        expandTooltip: 'Expand LayerList',
        view: esri.mapView,
        content: document.getElementById('supportingLayers')
      })
      esri.mapView.ui.add(supportingLayersExpand, 'top-right')
    }

    //add scalebar widget
    let scaleBar = new ScaleBar({
      view: esri.mapView,
      unit: 'dual'
    })
    esri.mapView.ui.add(scaleBar, {
      position: 'bottom-right'
    })

    //add measure tools
    esri.measurement = new Measurement({
      view: esri.mapView
    })
    esri.mapView.ui.add(esri.measurement, 'top-left')

    // create legend widget
    esri.legend = new Legend({
      view: esri.mapView
    })

    // create expand widget to hide and show legend
    esri.lgExpand = new Expand({
      view: esri.mapView,
      content: esri.legend
    })

    // add expand to map
    esri.mapView.ui.add(esri.lgExpand, 'bottom-left')
    // show expanded legend on desktop, collapse on mobile
    this.$q.screen.lt.sm || this.$q.screen.lt.md ? true : esri.lgExpand.expand()

    //watch size of map view and adjust legend to close if map gets too small
    esri.mapView.on('resize', function (event) {
      if (event.width < 546) {
        esri.lgExpand.collapse()
      }
      if (event.width > 546) {
        esri.lgExpand.expand()
      }
    })

    // Create portal. Used for PortalBasemapSource below
    const portal = new Portal()

    // Titles of TNC Basemaps to include in Basemap Gallery Widget
    const allowedBasemapTitles = [
      'Imagery Hybrid',
      'Ocean Basemap',
      'TNC Light with Hillshade',
      'TNC Dark Gray Map'
    ]

    // Define Basemap Gallery Wideget source using ID from TNC Basemap
    //  Gallery ArcGIS Online Group. By default, all maps from group will
    //  be added to the Basemap Gallery Widget. The filterFunction only
    //  brings in maps from the group whose titles match those in the
    //  allowedBasemapTitles array above.
    const source = new PortalBasemapsSource({
      portal,
      query: {
        id: 'defa1b2287604d069c70af515331e30f'
      },
      filterFunction: (basemap) => allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1
    })

    // Create an expand widget to house the Basemap Gallery Widget. Also
    //  create the Basemap Gallery Widget using the source and view created
    //  above.

    let view = esri.mapView

    const bgExpand = new Expand({
      view,
      content: new BasemapGallery({ source, view }),
      expandIconClass: 'esri-icon-basemap'
    })

    esri.mapView.ui.add(bgExpand, 'top-right')
    // close expand when basemap is changed
    esri.map.watch('basemap.title', function () {
      bgExpand.collapse()
    })

    // move zoom controls to top right
    esri.mapView.ui.move(['zoom'], 'top-right')

    // add mapimagelayer and sublayer
    esri.mapImageLayer = new MapImageLayer({
      url: 'https://cirrus.tnc.org/arcgis/rest/services/FN_Louisiana/Oysterflows/MapServer',
      title: 'Oyster Flows',
      sublayers: [
        {
          id: 0,
          title: 'Flowlines',
          visible: false,
          slider: 'support',
          opacity: this.supportOpacity
        },
        {
          id: 1,
          title: 'Watersheds',
          visible: false,
          slider: 'support',
          opacity: this.supportOpacity
        }
      ]
    })

    esri.map.add(esri.mapImageLayer)
  },

  methods: {
    updateSupportingVisibility() {
      // turn off all raster layer visibility
      esri.map.layers.items.forEach((fl) => {
        if (fl.type === 'feature') {
          fl.visible = false
        }
        if (fl.type == 'map-image') {
          fl.allSublayers.items.forEach((sl) => {
            if (sl.layer.type == 'map-image') {
              sl.visible = false
            }
          })
        }
      })
      // turn on all sublayers that are checked in the TOC
      this.supportingMapVisibleLayers.forEach((l) => {
        //if type is raster layer - find the sublayer and make visible
        if (l.type === 'Raster Layer') {
          console.log(l)
          let layer = esri.map.layers.items.find((layer) => {
            return (
              layer.type == 'map-image' &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
            )
          })
          let sublayer = layer.allSublayers.items.find((sublayer) => {
            return sublayer.id == l.id
          })
          sublayer.visible = true
        }
        if (l.type === 'Feature Layer') {
          //check to see if feature layer exists.  if it does make it visible, if not create it.
          let i = esri.map.layers.items.findIndex(
            (layer) =>
              layer.layerId == l.id &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
          )

          if (i >= 0) {
            console.log('finds feature layer')
            esri.map.layers.items[i].visible = true
          } else {
            //check to see if fl has a popup template defined
            console.log('creates feature layer')
            let layerList =
              this.$store.state.config.supportingMapLayers[l.mapServiceIndex].popupTemplate
            let i = layerList.findIndex((layer) => layer.id == l.id)
            if (i >= 0) {
              let template = {
                title: layerList[i].title,
                content: [
                  {
                    type: 'text',
                    text: layerList[i].label + ':  <b>{ ' + layerList[i].field + '}</b>'
                  }
                ]
              }
              //get index of map server
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                    '/' +
                    l.id,
                  popupTemplate: template
                })
              )
            }
            //if no popup defined create the feature layer without popup
            else {
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                    '/' +
                    l.id
                })
              )
            }
          }
        }
      })
    },

    updateSupportingOpacity() {
      console.log(this.presenceOpacity)
      let l = this.supportingVisibleLayerOpacity
      // if it is a raster find the sublayer and set the opacity
      if (l.type === 'Raster Layer') {
        let layer = esri.map.layers.items.find((layer) => {
          return (
            layer.type == 'map-image' &&
            layer.url == this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
          )
        })
        let sublayer = layer.allSublayers.items.find((sublayer) => {
          return sublayer.id == l.id
        })
        sublayer.opacity = l.value
      }
      //if it is a feature layers, create it if it does not exist but make visibility false.  then set its opacity so that
      //when the user turns it on, it will find the layer and match the ui opacity dial.
      if (l.type == 'Feature Layer') {
        let i = esri.map.layers.items.findIndex(
          (layer) =>
            layer.layerId == l.id &&
            layer.url == this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
        )

        if (i >= 0) {
          console.log('finds feature layer')
          esri.map.layers.items[i].opacity = l.value
        } else {
          //check to see if fl has a popup template defined
          console.log('creates feature layer')
          let layerList =
            this.$store.state.config.supportingMapLayers[l.mapServiceIndex].popupTemplate
          let i = layerList.findIndex((layer) => layer.id == l.id)
          if (i >= 0) {
            let template = {
              title: layerList[i].title,
              content: [
                {
                  type: 'text',
                  text: layerList[i].label + ':  <b>{ ' + layerList[i].field + '}</b>'
                }
              ]
            }
            //get index of map server
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                  '/' +
                  l.id,
                popupTemplate: template,
                visible: false,
                opacity: l.value
              })
            )
          }
          //if no popup defined create the feature layer without popup
          else {
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                  '/' +
                  l.id,
                visible: false,
                opacity: l.value
              })
            )
          }
        }
      }
    },

    getMapPrint() {
      esri.mapView.takeScreenshot({ width: 1000, height: 700 }).then((screenshot) => {
        let image = screenshot.dataUrl
        this.$store.commit('updateMapPrintURI', image)
        setTimeout(function () {
          // wait until all resources loaded
          window.print()
        }, 250)
      })
    },

    activateAreaMeasurement() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      esri.measurement.activeTool = 'area'
      distanceButton.classList.remove('active')
      areaButton.classList.add('active')
    },

    activateLineMeasurement() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      esri.measurement.activeTool = 'distance'
      distanceButton.classList.add('active')
      areaButton.classList.remove('active')
    },

    // Clears all measurements
    clearMeasurements() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      distanceButton.classList.remove('active')
      areaButton.classList.remove('active')
      esri.measurement.clear()
    },

    changeMangroveLayers() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (this.layerOption.includes(layer.title) == true) {
          layer.visible = true
        } else if (this.supportingOption.includes(layer.title)) {
          layer.visible = true
        } else {
          layer.visible = false
        }
      })
    },

    manageLayerVis(array, supportArray) {
      let newLayerOption = []
      if (array !== []) {
        array.forEach((layerLabel) => {
          esri.mapImageLayer.sublayers.forEach((layer) => {
            if (layerLabel == layer.title) {
              if (this.mangroveLayer == 'current') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.current))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'moderate') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.moderate))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'intense') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.intense))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
            }
          })
        })
      }

      if (supportArray !== []) {
        supportArray.forEach((layerLabel) => {
          esri.mapImageLayer.sublayers.forEach((layer) => {
            if (layerLabel == layer.title) {
              layer.visible = true
            }
          })
        })
      }

      this.layerOption = newLayerOption
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/light/main.css';

#map {
  flex: 1;
  min-height: calc(100vh - 49px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}
#mapStory {
  flex: 1;
  height: calc(100vh - 200px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}

@media screen and (max-width: 700px) {
  #map {
    min-height: 20vh;
    height: 100%;
    width: 100%;
    position: relative;
    border-bottom: #999 solid 1pt;
  }
}
#printBtn {
  position: absolute;
  z-index: 100;
  right: 15px;
  top: 175px;
  border: none;
  box-shadow: 1.5px 1.5px 1px 0px rgb(0 0 0 / 40%);
}
#toolbarDiv {
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  box-shadow: 0 1px 2px rgb(0 0 0 / 60%);
}

esri-expand__content esri-expand__content--expanded div {
  background-color: white;
}
#toolbarDiv button {
  border: unset;
}
#area {
  border-right: solid 1px rgba(110, 110, 110, 0.3) !important;
  border-left: solid 1px rgba(110, 110, 110, 0.3) !important;
}

.esri-widget--button.active,
.esri-widget--button.active:hover,
.esri-widget--button.active:focus {
  cursor: default;
  background-color: lightgrey;
}
.esri-widget--button.active path,
.esri-widget--button.active:hover path,
.esri-widget--button.active:focus path {
  fill: #e4e4e4;
}

.esri-widget *:focus-visible,
.esri-widget *:focus {
  outline: none;
}
</style>
<style>
.esri-legend__service h3 {
  line-height: unset;
}
.esri-legend__layer-cell {
  padding-top: 0;
  padding-bottom: 0;
}
.esri-measurement {
  margin: 40px 0 0 -4px;
}
.esri-ui-corner .esri-component,
.esri-expand__content {
  box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
}

.esri-scale-bar__line {
  background-color: white !important;
}
</style>
