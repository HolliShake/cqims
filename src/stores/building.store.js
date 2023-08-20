import { merge, remove } from "lodash";
import { defineStore } from "pinia";

const defaultData = () => ({
    buildingName: "",
    buildingShortName: "",
    buildingNumber: 0,
    buildingDescription: "",
    numberOfFloors: 0,
    campusId: 0
})

const useBuildingStore = defineStore("BuildingStore", {
    state: () => ({
        buildings: [],
        isUpdate: false,
        buildingModel: {
           ...defaultData()
        }
    }),

    getters: {
        getBuildings() { 
            return this.buildings
        },
        getIsUpdateMode() { 
            return this.isUpdate
        },
        getBuildingModel() { 
            return this.buildingModel
        }
    },

    actions: { 
        async setBuilding(buildings) { 
            this.buildings = buildings
        },
        async appendBuilding(building) { 
            this.buildings.push(building)
        },
        async patchBuilding(building) {
            merge(
                this.buildings.find(b => b.id == building.id),
                building
            )
        },
        async removeBuilding(building) {
            remove(
                this.buildings,
                building
            )
        },
        async setBuildingModel(building, isUpdate) { 
            this.buildingModel = building
            this.isUpdate = isUpdate ?? this.isUpdate
        },
        async unsetBuildingModel() { 
            this.isUpdate = false
            this.buildingModel = defaultData()
        }
    }
})

export default useBuildingStore
