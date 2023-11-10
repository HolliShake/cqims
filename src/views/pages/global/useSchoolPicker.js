import { defineStore } from "pinia"

const useSchoolPicker = defineStore("SchoolPicker", {
  state: function() {
    let selectedSchool = null, selectedCampus = null
    
    try
    {
      if (localStorage.getItem("selectedSchool"))
      {
        selectedSchool = parseInt(localStorage.getItem("schoolPicker->selectedSchool"))
      }

      if (localStorage.getItem("selectedCampus"))
      {
        selectedCampus = parseInt(localStorage.getItem("schoolPicker->selectedCampus"))
      }
    } catch (error) {
      console.log(error)
    }

    return ({
      selectedSchool: selectedSchool,
      selectedCampus: selectedCampus,
    })
  },

  getters: {
    getSelectedSchool() {
      return this.selectedSchool
    },
    getSelectedCampus() {
      return this.selectedCampus
    },
  },

  actions: {
    async setSelectedSchool(schoolId)
    {
      localStorage.setItem("schoolPicker->selectedSchool", schoolId)
      this.selectedSchool = schoolId
    },
    async setSelectedCampus(campusId)
    {
      localStorage.setItem("schoolPicker->selectedCampus", campusId)
      this.selectedCampus = campusId
    },
  },
})

export default useSchoolPicker()
