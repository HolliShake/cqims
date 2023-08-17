import { defineStore } from "pinia"

const defaultData = () => ({
  barangay: "",
  city: "",
  province: "",
  region: "",
  country: "",
  campusName: "",
  campusShortName: "",
  schoolId: 0,
  zipCodeId: 0,
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
