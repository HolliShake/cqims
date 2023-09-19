import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  examinationName: "",
  examDescription: "",
})

const useExaminationStore = defineStore("ExaminationStore", {

  state: () => ({
    examinations: [],
    examinationModel: defaultModel(),
  }),

  getters: {
    getExaminations() {
      return this.examinations
    },

    getExaminationModel() {
      return cloneDeep(this.examinationModel)
    },
  },

  actions: {

    async setExaminations(examinations) {
      this.examinations = examinations
    },

    async add(examination) {
      this.examinations.push(examination)
    },

    async update(examination) {
      merge(
        this.examinations.find(e => e.id == examination.id),
        examination,
      )
    },

    async delete(examination) {
      this.examinations = this.examinations.filter(e => e.id != examination.id)
    },

    async setField(examination) {
      this.examinationModel = examination
    },

    async resetField() {
      this.examinationModel = defaultModel()
    },
  },

})

export default useExaminationStore
