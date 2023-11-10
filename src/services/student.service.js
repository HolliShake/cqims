import axiosIns from "@/plugins/axios"


class StudentService {
  constructor() {
    this.endPoint = "/Student"
  }

  async getAllStudentByCampusId(campusId) {
    return await axiosIns.get(this.endPoint + "/All/Campus" + `/${campusId}`)
  }

  async getStudentById(studentId) {
    return await axiosIns.get(this.endPoint + `/${studentId}`)
  }

  async createStudent(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }

  async updateStudent(studentId, payload) {
    return await axiosIns.put(this.endPoint + "/Update" + `/${studentId}`, payload)
  }

  async deleteStudent(studentId) {
    return await axiosIns.delete(this.endPoint + "/Delete" + `/${studentId}`)
  }
}


export default StudentService
