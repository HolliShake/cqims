import { cloneDeep, merge, remove } from "lodash"
import { defineStore } from "pinia"

const defaultData = () => ({
  schoolName: "",
  schoolShortName: "",
  schoolNumber: "",
  schoolDescription: "",
})

const useSchoolStore = defineStore("SchoolStore", {

  state: () => ({
    schools: [],
    schoolModel: defaultData(),
  }),

  getters: {
    getSchools() {
      return this.schools
    },
    getSchoolModel() {
      return cloneDeep(this.schoolModel)
    },
  },
  
  actions: {
    async initialize(schoolsArray) {
      this.schools = schoolsArray
    },
    async add(school) {
      this.schools.push(school)
    },
    async update(school) {
      merge(
        this.schools.find(s => s.id == school.id),
        school,
      )
    },
    async delete(school) {
      remove(
        this.schools,
        school,
      )
    },
    async setField(school) {
      this.schoolModel = school
    },
    async resetField() {
      this.schoolModel = defaultData()
    },
  },
})


export default useSchoolStore

