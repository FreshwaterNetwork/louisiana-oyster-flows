import { createStore } from 'vuex'
import esriRequest from '@arcgis/core/request'

export default createStore({
  state: {
    data: {
      // data retrieved from web services
      supportingLayers: '', //used to create the supportinglayer tree
      slReady: false
    },
    config: {
      // config info
      supportingMapLayers: [
        {
          mapService:
            'https://cirrus.tnc.org/arcgis/rest/services/Mangrove_Explorer/Mangrove_Explorer_Private/MapServer',
          skipLayers: [],
          title: 'Mangrove Explorer',
          popupTemplate: [
            {
              id: 9999,
              fields: [
                { fieldName: 'Subbasin', label: 'Sub Basin' },
                { fieldName: 'SubbasinR', label: 'Sub Basin R' },
                { fieldName: 'AreaC', label: 'Area(units)' }
              ]
            },
            // for now this placeholder is required.  I am not sure why but the last layer in this list will not display correctly.
            {
              id: 9999,
              fields: [{ fieldName: 'none', label: 'placeholder' }]
            }
          ]
        }
      ],

      supportingLayersTitle: 'View Mangrove Layers',
      supportingLayersOnMap: false,
      supportingLayersInPanel: true,
      panelDisplayType: 'plain', //plain, tabsHorizontal, tabsVertical
      appDisplayType: 'webMap', //storyMap, webMap
      condensedTabs: false,
      containerWidth: ''
    },
    // app state info -- supporting layers
    tree: { ticked: [], expanded: [999], tickedObj: [] },
    selectedLayerList: [],
    supportingVisibleLayerOpacity: {},

    // app state info -- layout
    showControls: false,
    hideControls: true,
    mapPrintURI: '',
    layerOption: [],
    mangroveLayer: '',
    presenceOpacity: 0.8,
    abundanceOpacity: 0.8,
    tempOpacity: 0.8,
    precipOpacity: 0.8,
    supportOpacity: 0.8,
    tabSupLayers: [],
    selectedOption: [],
    supportingOption: [],
    opacityLayerId: -1
  },
  mutations: {
    //data retrieved from web services
    updateSupportingLayers(state, obj) {
      state.data.supportingLayers = obj
    },
    updateSLReady(state, bool) {
      state.data.slReady = bool
    },
    updateSupportingSublayerList(state, obj) {
      state.data.supportingSublayerList = obj
    },

    //app state -- supporting layers
    updateTreeState(state, obj) {
      state.tree.ticked = obj.ticked
      state.tree.expanded = obj.expanded
      state.tree.tickedObj = obj.tickedObj
    },
    updateSupportingLayerVisibleOpacity(state, obj) {
      state.supportingVisibleLayerOpacity = obj
    },
    updateMapPrintURI(state, uri) {
      state.mapPrintURI = uri
    },
    updateCondensedTabs(state, bool) {
      state.condensedTabs = bool
    },
    updateContainerWidth(state, val) {
      state.containerWidth = val
    },
    updateLayerOption(state, val) {
      state.layerOption = val
    },
    updateMangroveLayer(state, val) {
      state.mangroveLayer = val
    },
    updatePresenceOpacity(state, val) {
      state.presenceOpacity = val
    },
    updateAbundanceOpacity(state, val) {
      state.abundanceOpacity = val
    },
    updateTempOpacity(state, val) {
      state.tempOpacity = val
    },
    updatePrecipOpacity(state, val) {
      state.precipOpacity = val
    },
    updateTabSupLayers(state, val) {
      state.tabSupLayers = val
    },
    updateSelectedOption(state, val) {
      state.selectedOption = val
    },
    updateSupportingOption(state, val) {
      state.supportingOption = val
    },
    updateSupportOpacity(state, val) {
      state.supportOpacity = val
    },
    updateOpacityLayerId(state, val) {
      state.opacityLayerId = val
    }
  },

  actions: {
    requestSupportingLayers(context) {
      //for each map service object in supporting map layers
      try {
        let obj = []
        let smnum = context.state.config.supportingMapLayers.length
        let smcount = 0
        context.state.config.supportingMapLayers.forEach((service, index) => {
          // console.log(service)
          esriRequest(service.mapService + '/layers?f=pjson', {
            responseType: 'json'
          }).then(function (response) {
            let layerJson = response.data.layers
            //push main header to the object
            obj.push({
              label: service.title,
              children: [],
              id: 999 + index,
              noTick: true,
              type: 'header'
            })
            let storeNodes = []
            let type = ''
            layerJson.forEach((l) => {
              service.popupTemplate.forEach((popup) => {
                if (l.id == popup.id) {
                  type = 'Featue Layer'
                } else type = 'Raster Layer'
              })
              // add layer to layer viewer if it's id is not present in the skip array
              if (service.skipLayers.indexOf(l.id) == -1) {
                // Group Layer with no parent
                if (l.type == 'Group Layer' && !l.parentLayer) {
                  //push the object to the list as child of main header
                  obj[index].children.push({
                    label: l.name,
                    children: [],
                    id: l.id + '_' + index,
                    noTick: true,
                    type: type
                  })
                  //find the index of the object we just pushed, saves the reference to the location
                  let parentIndex = obj[index].children.findIndex(
                    (obj) => obj.id == l.id + '_' + index
                  )
                  //save the parent node to the store with reference to its location in the object
                  storeNodes.push({
                    parentIndex: parentIndex,
                    parentLoc: obj[index].children[parentIndex],
                    parentId: l.id + '_' + index,
                    description: l.description
                      .replace('&lt;/a&gt;', '</a>')
                      .replace('&lt;a', '<a')
                      .replace('&lt;', '<')
                      .replace('&gt;', '>')
                  })
                }
                // featurel layer with parent
                if (l.type !== 'Group Layer' && l.parentLayer) {
                  //find the location of the parent in the node lookup
                  let nodesIndex = storeNodes.findIndex(
                    (obj) => obj.parentId == l.parentLayer.id + '_' + index
                  )
                  //set the location of the parent
                  let parentLoc = storeNodes[nodesIndex].parentLoc
                  //push the child to the parent
                  parentLoc.children.push({
                    label: l.name,
                    children: [],
                    body: 'toggle',
                    id: l.id + '_' + index,
                    description: l.description
                      .replace('&lt;/a&gt;', '</a>')
                      .replace('&lt;a', '<a')
                      .replace('&lt;', '<')
                      .replace('&gt;', '>'),
                    type: type
                  })
                }
                // group layer with parent
                if (l.type == 'Group Layer' && l.parentLayer) {
                  //find the location of the parent in the node lookup
                  let nodesIndex = storeNodes.findIndex(
                    (obj) => obj.parentId == l.parentLayer.id + '_' + index
                  )
                  //set the location of the parent
                  let parentLoc = storeNodes[nodesIndex].parentLoc
                  //push the new parent into the found parent as child
                  parentLoc.children.push({
                    label: l.name,
                    children: [],
                    id: l.id + '_' + index,
                    noTick: true,
                    type: type
                  })
                  //find the index of the child we just pushed
                  let parentIndex = parentLoc.children.findIndex(
                    (obj) => obj.id == l.id + '_' + index
                  )
                  //save the reference to the location
                  parentLoc = parentLoc.children[parentIndex]
                  //save the parent node to the store with reference to its location in the object
                  storeNodes.push({
                    parentIndex: parentIndex,
                    parentLoc: parentLoc,
                    parentId: l.id + '_' + index,
                    description: l.description
                      .replace('&lt;/a&gt;', '</a>')
                      .replace('&lt;a', '<a')
                      .replace('&lt;', '<')
                      .replace('&gt;', '>')
                  })
                }
                // feature layer with no parent length = number of nodes
                if (l.type !== 'Group Layer' && !l.parentLayer) {
                  obj[index].children.push({
                    label: l.name,
                    children: [],
                    body: 'toggle',
                    id: l.id + '_' + index,
                    description: l.description
                      .replace('&lt;/a&gt;', '</a>')
                      .replace('&lt;a', '<a')
                      .replace('&lt;', '<')
                      .replace('&gt;', '>'),
                    type: type
                  })
                }
              }
            })
            smcount = smcount + 1
            // console.log(smcount)
            // console.log(smnum)
            if (smcount == smnum) {
              context.commit('updateSupportingLayers', obj)
              context.commit('updateSLReady', true)
            }
          })
        })
      } catch (error) {
        context.commit('updateSupportingLayers', 'error')
      }
    }
  },

  modules: {}
})
