import axiosIns from "@/plugins/axios"


class AcademicTermService
{
  constructor()
  {
    this._endPoint = "/AcademicTerm"
  }

  async getAllAcademicTerm() {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getAcademicTerm(academicTermId) {
    return await axiosIns.get(this._endPoint + `/${academicTermId}`)
  }

  async createAcademicTerm(payload) {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateAcademicTerm(academicTermId, payload) {
    return await axiosIns.put(this._endPoint + "/Update" + `/${academicTermId}`, payload)
  }

  async deleteAcademicTerm(academicTermId) {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${academicTermId}`)
  }
}

export default AcademicTermService
