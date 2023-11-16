import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  label: "",
  description: "",
  userId: null,
})

const useHealthStore = defineStore('Health', {
  state: () => ({
    health: [],
    healthModel: defaultModel(),
    userId: null,
  }),

  getters: {
    getHealth() {
      return this.health
    },
    getHealthModel() {
      const model = cloneDeep(this.healthModel)

      if (!this.userId) {
        console.warn("Health model does not have userId set")
      }

      model.userId = this.userId
      
      return model
    },
  },

  actions: {
    async initializeHealth(healthArray) {
      this.health = healthArray
    },

    async add(health) {
      this.health.push(health)
    },

    async update(health) {
      merge(
        this.health.find(item => item.id === health.id),
        health,
      )
    },

    async delete(healthId) {
      this.health = this.health.filter(item => item.id !== healthId)
    },

    async setUser(userId) {
      this.userId = userId
    },

    async setField(health) {
      this.healthModel = health
    },

    async resetField() {
      this.healthModel = defaultModel()
    },
  },

})

export default useHealthStore

