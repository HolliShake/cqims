import axiosIns from "@/plugins/axios"



class CourseService
{
  constructor()
  {
    this._endPoint = "/Core/Course"
  }

  async getAllCourses()
  {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async createCourse(payload)
  {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateCourse(courseId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${courseId}`, payload)
  }

  async deleteCourse(courseId)
  {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${courseId}`)
  }
}

export default CourseService
