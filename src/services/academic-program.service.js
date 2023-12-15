import axiosIns from "@/plugins/axios"


class AcademicProgramService {

  constructor() {
    this._endPoint = "/Core/AcademicProgram"
  }

  async getAcademicProgramsByDepartmentId(departmentId) {
    return axiosIns.get(this._endPoint + "/Department" + `/${departmentId}`)
  }

  async createAcademicProgram(payload) {
    return axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateAcademicProgram(academicProgramId, payload) {
    return axiosIns.put(this._endPoint + "/Update" + `/${academicProgramId}`, payload)
  }

  async deleteAcademicProgram(academicProgramId) {
    return axiosIns.delete(this._endPoint + "/Delete" + `/${academicProgramId}`)
  }
    
}

export default AcademicProgramService
