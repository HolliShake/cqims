import axiosIns from "@/plugins/axios"



class MajorDisciplineService
{
  constructor()
  {
    this._endPoint = "/MajorDiscipline"
  }

  async getAllMajorDiscipline()
  {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getMajorDiscipline(majorDisciplineId)
  {
    return await axiosIns.get(this._endPoint + `/${majorDisciplineId}`)
  }

  async createMajorDiscipline(payload)
  {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateMajorDiscipline(majorDisciplineId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${majorDisciplineId}`, payload)
  }

  async deleteMajorDiscipline(majorDisciplineId)
  {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${majorDisciplineId}`)
  }
}

export default MajorDisciplineService
