import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  broadDisciplineCode: "",
  broadDisciplineDescription: "",
})

const useBroadDisciplineStore = defineStore("BroadDiscipline", {

  state: () => ({
    broadDisciplines: [],
    broadDisciplineModel: defaultModel(),
  }),

  getters: {
    getBroadDisciplines() {
      return this.broadDisciplines
    },
    getBroadDisciplineModel() {
      return cloneDeep(this.broadDisciplineModel)
    },
  },

  actions: {

    async initialize(broadDisciplines)
    {
      this.broadDisciplines = broadDisciplines
    },

    async add(broadDiscipline) 
    {
      this.broadDisciplines.push(broadDiscipline)
    },

    async update(broadDiscipline)
    {
      merge(
        this.broadDisciplines.find(bd => bd.id == broadDiscipline.id),
        broadDiscipline,
      )
    },

    async delete(broadDiscipline) 
    {
      this.broadDisciplines = this.broadDisciplines.filter(bd => bd.id != broadDiscipline.id)
    },

    async setField(broadDiscipline) 
    {
      this.broadDisciplineModel = broadDiscipline
    },

    async resetField() 
    {
      this.broadDisciplineModel = defaultModel()
    },
  },

})

export default useBroadDisciplineStore
