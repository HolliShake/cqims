import axiosIns from "@/plugins/axios"


class EducationService {
  constructor() {
    this._endPoint = "/Education"
  }

  async getEducationsByUserId(userId) {
    return await axiosIns.get(this._endPoint + "/User" + `/${userId}`)
  }

  async createUserEducation(payload) {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateUserEducation(educationId, payload) {
    return await axiosIns.put(this._endPoint + "/Update" + `/${educationId}`, payload)
  }

  async deleteUserEducation(educationId) {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${educationId}`)
  }
}

export default EducationService
