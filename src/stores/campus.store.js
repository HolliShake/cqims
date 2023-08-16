import { defineStore } from "pinia"



const useCampusStore = defineStore("CampusStore", {

  state: () => ({
    campuses: [],
    campusModel: {
        
    },
  }),

  getters: {
    getCampuses() {
      return this.campuses
    },
  },
    
  actions: {
    async setCampuses(campuses) {
      this.campuses = campuses
    },
  },
    
})

export default useCampusStore
