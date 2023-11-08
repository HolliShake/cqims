import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  email: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  birthDate: new Date(Date.now()),
  studentId: "",
  campusId: 0,
})


const useStudentStore = defineStore("Student", {
  state: () => ({
    students: [],
    studentModel: defaultModel(),
    campusId: 0,
  }),

  getters: {
    getStudents() {
      return this.students
    },
    getStudentModel() {
      const model = cloneDeep(this.studentModel)

      model.campusId = this.campusId

      if (!this.campusId)
      {
        console.warn("Campus was not set!")
      }

      return model
    },
    getCampusId() {
      return this.campusId
    },
  },

  actions: {
    async initialize(studentsArray) {
      this.students = studentsArray
    },
    async clear() {
      this.students = []
    },
    async add(student) {
      this.students.push(student)
    },
    async findAsync(studentId) {
      return this.students.find(s => s.id == studentId)
    },
    async update(student) {
      merge(
        await this.findAsync(student.id),
        student,
      )
    },
    async delete(student) {
      this.students = this.students.filter(s => s.id != student.id)
    },
    async setCampus(campusId) {
      this.campusId = campusId
    },
    async setField(student) {
      this.studentModel = student
    },
    async resetField() {
      this.studentModel = defaultModel()
    },
  },
})

export default useStudentStore

