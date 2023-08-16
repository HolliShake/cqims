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
}


export default CampusService
