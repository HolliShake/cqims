import axiosIns from "@/plugins/axios"



class CampusService {
  constructor() {
    this.endPoint = "/Core/Campus"
  }
    
  async getAllCampuses() {
    return await axiosIns.get(this.endPoint + "/all")
  }

  async getSchoolCampuses(schoolId) {
    return await axiosIns.get(this.endPoint + "/School/" + `${schoolId}`)
  }

  async createCampus(payload) {
    return await axiosIns.post(this.endPoint + "/create", payload)
  }

  async updateCampus(campusID, payload) {
    return await axiosIns.put(this.endPoint + "/update/" + `${campusID}`, payload)
  }

  async deleteCampus(campusID) {
    return await axiosIns.delete(this.endPoint + "/delete/" + `${campusID}`)
  }
}


export default CampusService
