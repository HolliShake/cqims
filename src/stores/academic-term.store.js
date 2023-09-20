import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  academicTermName: "",
  semOrder: 0,
  grade1Label: "",
  grade2Label: "",
  grade3Label: "",
  grade4Label: "",
})


const useAcademicTermStore = defineStore("AcademicTerm", {

  state: () => ({
    academicTerms: [],
    academicTermModel: defaultModel(),
  }),

  getters: {
    getAcademicTerms() {
      return this.academicTerms
    },
    getAcademicTermModel() {
      return cloneDeep(this.academicTermModel)
    },
  },

  actions: {
    async setAcademicTerms(academicTerms) {
      this.academicTerms = academicTerms
    },

    async clear() {
      this.academicTerms = []
    },

    async add(academicTerm) {
      this.academicTerms.push(academicTerm)
    },

    async update(academicTerm) {
      merge(
        this.academicTerms.find(at => at.id == academicTerm.id),
        academicTerm,
      )
    },

    async delete(academicTerm) {
      this.academicTerms = this.academicTerms.filter(at => at.id != academicTerm.id)
    },

    async setField(academicTerm) {
      return this.academicTermModel = academicTerm
    },

    async resetField() {
      this.academicTermModel = defaultModel()
    },
  },

})

export default useAcademicTermStore
