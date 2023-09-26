import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  subDisciplineCode: "",
  subDisciplineDescription: "",
  majorDisciplineId: null,
})

const useSubDisciplineStore = defineStore("SubDiscipline", {

  state: () => ({
    subDisciplines: [],
    subDisciplineModel: defaultModel(),
  }),

  getters: {
    getSubDisciplines() {
      return this.subDisciplines
    },
    getSubDisciplineModel() {
      return cloneDeep(this.subDisciplineModel)
    },
  },

  actions: {

    async initialize(subDisciplines)
    {
      this.subDisciplines = subDisciplines
    },

    async add(subDiscipline) 
    {
      this.subDisciplines.push(subDiscipline)
    },

    async update(subDiscipline)
    {
      merge(
        this.subDisciplines.find(sd => sd.id == subDiscipline.id),
        subDiscipline,
      )
    },

    async delete(subDiscipline) 
    {
      this.subDisciplines = this.subDisciplines.filter(sd => sd.id != subDiscipline.id)
    },

    async setField(subDiscipline) 
    {
      this.subDisciplineModel = subDiscipline
    },

    async resetField() 
    {
      this.subDisciplineModel = defaultModel()
    },
  },

})

export default useSubDisciplineStore
