import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  majorDisciplineCode: "",
  majorDisciplineDescription: "",
  broadDisciplineId: null,
})

const useMajorDisciplineStore = defineStore("MajorDiscipline", {

  state: () => ({
    majorDisciplines: [],
    majorDisciplineModel: defaultModel(),
  }),

  getters: {
    getMajorDisciplines() {
      return this.majorDisciplines
    },
    getMajorDisciplineModel() {
      return cloneDeep(this.majorDisciplineModel)
    },
  },

  actions: {

    async initialize(majorDisciplines)
    {
      this.majorDisciplines = majorDisciplines
    },

    async add(majorDiscipline) 
    {
      this.majorDisciplines.push(majorDiscipline)
    },

    async update(majorDiscipline)
    {
      merge(
        this.majorDisciplines.find(md => md.id == majorDiscipline.id),
        majorDiscipline,
      )
    },

    async delete(majorDiscipline) 
    {
      this.majorDisciplines = this.majorDisciplines.filter(md => md.id != majorDiscipline.id)
    },

    async setField(majorDiscipline) 
    {
      this.majorDisciplineModel = majorDiscipline
    },

    async resetField() 
    {
      this.majorDisciplineModel = defaultModel()
    },
  },

})

export default useMajorDisciplineStore
