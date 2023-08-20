import { merge, remove } from "lodash"
import { defineStore } from "pinia"

const defaultData = () => ({
  campusName: "",
  campusShortName: "",
  campusDescription: "",
  barangay: "",
  province: "",
  city: "",
  country: "",
  zipCode: 0,
  region: 0,
  schoolId: 0
})

const useCampusStore = defineStore("CampusStore", {

  state: () => ({
    campuses: [],
    isUpdate: false,
    campusModel: {
      ...defaultData(),
    },
  }),

  getters: {
    getCampuses() {
      return this.campuses
    },
    getCampusModel() {
      return this.campusModel
    },
    getIsUpdateMode() {
      return this.isUpdate
    }
  },
    
  actions: {
    async setCampuses(campuses) {
      this.campuses = campuses
    },
     async appendCampus(campus) {
      this.campuses.push(campus)
    },
    async patchCampus(campus) {
      merge(
        this.campuses.find(c => c.id == campus.id),
        campus,
      )
    },
    async removeCampus(campus) {
      remove(
        this.campuses,
        campus,
      )
    },
    async setCampusModel(campusModel, updateMode) { 
      this.campusModel = campusModel
      this.isUpdate = updateMode ?? this.isUpdate
    },
    async unsetCampusModel() { 
      this.isUpdate = false
      this.campusModel = defaultData()
    }
  },
    
})

export default useCampusStore
