import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  courseName: "",
  courseCode: "",
  courseDescription: "",
  unitsLab: 0,
  unitsLec: 0,
  creditsUnit: 0,
  creditHoursLab: 0,
  creditHoursLec: 0,
  creditHours: 0,
  isActive: false,
  isWithLab: false,
  subDisciplineId: null,
})


const useCourseStore = defineStore("Course", {

  state: () => ({
    courses: [],
    courseModel: defaultModel(),
  }),

  getters: {
    getCourses() {
      return this.courses
    },
    getCourseModel() {
      return cloneDeep(this.courseModel)
    },
  },

  actions: {
    
    async initialize(courses) {
      this.courses = courses
    },

    async add(course) {
      this.courses.push(course)
    },

    async update(course) {
      merge(
        this.courses.find(c => c.id == course.id),
        course,
      )
    },

    async delete(course) {
      this.courses = this.courses.filter(c => c.id != course.id)
    },

    async setField(course) {
      this.courseModel = course
    },

    async resetField() {
      this.courseModel = defaultModel()
    },

  },

})

export default useCourseStore
