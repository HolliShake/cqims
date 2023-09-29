import axiosIns from "@/plugins/axios"



class CourseRequisiteService
{
  constructor()
  {
    this._endPoint = "/Core/CourseRequisite"
  }

  async getAllCourseRequisites()
  {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getCourseRequisiteById(courseRequisiteId)
  {
    return await axiosIns.get(this._endPoint + `/${courseRequisiteId}`)
  }

  async createAllCourseRequisite(payload) 
  {
    return await axiosIns.post(this._endPoint + "/CreateAll", payload)
  }

  async createAllCourseRequisite(payloadArray) 
  {
    return await axiosIns.post(this._endPoint + "/CreateAll", payloadArray)
  }

  async updateCourseRequisite(courseRequisiteId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${courseRequisiteId}`, payload)
  }

  async deleteCourseRequisite(courseRequisiteId)
  {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${courseRequisiteId}`)
  }
}

export default CourseRequisiteService
