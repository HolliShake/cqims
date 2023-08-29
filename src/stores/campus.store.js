import { cloneDeep, merge, remove } from "lodash"
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
  schoolId: 0,
})

const useCampusStore = defineStore("CampusStore", {

  state: () => ({
    campuses: [],
    campusModel: defaultData(),
    schoolId: null,
  }),

  getters: {
    getCampuses() {
      return this.campuses
    },
    getCampusModel() {
      const model = /**/
        cloneDeep(this.campusModel)
      
      model.schoolId = this.schoolId

      return model
    },
    getSchool() {
      return this.schoolId
    },
  },
    
  actions: {
    async initialize(campusesArray) {
      this.campuses = campusesArray
    },
    async add(campus) {
      this.campuses.push(campus)
    },
    async update(campus) {
      merge(
        this.campuses.find(c => c.id == campus.id),
        campus,
      )
    },
    async delete(campus) {
      remove(
        this.campuses,
        campus,
      )
    },
    async setField(campusModel) { 
      this.campusModel = campusModel
    },
    async resetField() { 
      this.campusModel = defaultData()
    },

    // 
    async setSchool(schoolId) {
      this.schoolId = schoolId
    },
  },
    
})

export default useCampusStore
