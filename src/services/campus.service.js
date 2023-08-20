import axiosIns from "@/plugins/axios"



class CampusService {
  constructor() {
    this.endPoint = "/Core/Campus"
  }
    
  async getAllCampuses() {
    return await axiosIns.get(this.endPoint + "/All")
  }

  async getSchoolCampuses(schoolId) {
    return await axiosIns.get(this.endPoint + "/School/" + `${schoolId}`)
  }

  async getCampusById(campusId) {
    return await axiosIns.get(this.endPoint + `/${campusId}`)
  }

  async createCampus(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }

  async updateCampus(campusID, payload) {
    return await axiosIns.put(this.endPoint + "/Update/" + `${campusID}`, payload)
  }

  async deleteCampus(campusID) {
    return await axiosIns.delete(this.endPoint + "/Delete/" + `${campusID}`)
  }
}


export default CampusService
