import axiosIns from "@/plugins/axios"



class SchoolService {

  constructor() {
    this.endPoint = "/Core/School"
  }

  async getAllSchool() {
    return await axiosIns.get(this.endPoint + "/all")
  }
  async getSchool(schoolID) {
    return await axiosIns.get(this.endPoint + `/${schoolID}`)
  }

  async createSchool(payload) { 
    return await axiosIns.post(this.endPoint + "/create", payload)
  }
    
  async updateSchool(schoolID, payload) { 
    return await axiosIns.put(this.endPoint + "/update" + `/${schoolID}`, payload)
  }
    
  async deleteSchool(schoolID) { 
    return await axiosIns.delete(this.endPoint + "/delete" + `/${schoolID}`)
  }
}

export default SchoolService

