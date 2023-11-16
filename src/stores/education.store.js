import { merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  schoolName: "",
  from: new Date(Date.now()),
  to: new Date(Date.now()),
  description: "",
  status: 0,
  userId: null,
}) 

const useEducationStore = defineStore("Education", {

  state: () => ({
    educations: [],
    educationModel: defaultModel(),
    userId: null,
  }),

  getters: {
    getEducations() {
      return this.educations
    },
    getEducationModel() {
      return this.educationModel
    },
    getUserId() {
      return this.userId
    },
  },

  actions: {
    async initilize(educationArray) {
      this.educations = educationArray
    },
    async add(education) {
      this.educations.push(education)
    },
    async update(education) {
      merge(
        this.educations.find(e => e.id == education.id),
        education,
      )
    },
    async delete(education) {
      this.educations = this.educations.filter(e => e.id != education.id)
    },
    async setUser(userId) {
      this.userId = userId
    },
    async setField(education) {
      this.educationModel = education
    },
    async resetField() {
      this.educationModel = defaultModel()
    },
  },

})

export default useEducationStore
