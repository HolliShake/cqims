import axiosIns from "@/plugins/axios"



class SchoolService {

  constructor() {
    this.endPoint = "/Core/School"
  }

  async getAllSchool() {
    return await axiosIns.get(this.endPoint + "/All")
  }
  async getSchoolById(schoolID) {
    return await axiosIns.get(this.endPoint + `/${schoolID}`)
  }

  async createSchool(payload) { 
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }
    
  async updateSchool(schoolID, payload) { 
    return await axiosIns.put(this.endPoint + "/Update" + `/${schoolID}`, payload)
  }
    
  async deleteSchool(schoolID) { 
    return await axiosIns.delete(this.endPoint + "/Delete" + `/${schoolID}`)
  }
}

export default SchoolService

