import { defineStore } from "pinia"

const useStudentContext = defineStore("StudentContext", {
  state: () => ({
    studentData: null,
  }),

  getters: {
    getStudentData() {
      return this.studentData
    },
  },

  actions: {
    async setStudentData(studentData) {
      this.studentData = studentData
    },
  },
})


export default useStudentContext()
