import axiosIns from "@/plugins/axios"


class ExaminationService 
{
  constructor()
  {
    this._endPoint = "/Examination"
  }

  async getAllExamination() {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async createExamination(payload) {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateExamination(examinationId, payload) {
    return await axiosIns.put(this._endPoint + "/Update" + `/${examinationId}`, payload)
  }

  async deleteExamination(examinationId) {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${examinationId}`)
  }
}


export default ExaminationService
