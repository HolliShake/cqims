import { merge, remove } from "lodash"
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
    isUpdate: false,
    schoolModel: {
     ...defaultData(),
    },
  }),

  getters: {
    getSchools() {
      return this.schools
    },
    getSchoolModel() {
      return this.schoolModel
    },
    getIsUpdateMode() {
      return this.isUpdate
    },
  },
  
  actions: {
    async setSchools(schoolsArray) {
      this.schools = schoolsArray
    },
    async appendSchool(school) {
      this.schools.push(school)
    },
    async patchSchool(school) {
      merge(
        this.schools.find(s => s.id == school.id),
        school,
      )
    },
    async removeSchool(school) {
      remove(
        this.schools,
        school,
      )
    },
    async setSchoolModel(school, updateMode) {
      this.schoolModel = school
      this.isUpdate = updateMode ?? this.isUpdate
    },
    async unsetSchoolModel() {
      this.isUpdate = false
      this.schoolModel = defaultData()
    },
  },
})


export default useSchoolStore

