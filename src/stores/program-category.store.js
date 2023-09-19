import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  programCategoryName: "",
  programCategoryDescription: "",
})

const useProgramCategoryStore = defineStore("ProgramCategory", {

  state: () => ({
    programCategory: [],
    programCategoryModel: defaultModel(),
  }),

  getters: {
    getProgramCategories() {
      return this.programCategory
    },
    getProgramCategoryModel() {
      return cloneDeep(this.programCategoryModel)
    },
  },

  actions: {

    async setProgramCategories(programCategories) {
      this.programCategory = programCategories
    },

    async add(programCategory) {
      this.programCategory.push(programCategory)
    },

    async update(programCategory) {
      merge(
        this.programCategory.find(pc => pc.id == programCategory.id),
        programCategory,
      )
    },

    async delete(programCategory) {
      this.programCategory = this.programCategory.filter(pc => pc.id != programCategory.id)
    },

    async setField(programCategory) {
      this.programCategoryModel = programCategory
    },

    async resetField() {
      this.programCategoryModel = defaultModel()
    },
  },

})

export default useProgramCategoryStore
