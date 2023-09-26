import axiosIns from "@/plugins/axios"



class SubDisciplineService
{
  constructor()
  {
    this._endPoint = "/SubDiscipline"
  }

  async getAllSubDiscipline()
  {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getSubDiscipline(subDisciplineId)
  {
    return await axiosIns.get(this._endPoint + `/${subDisciplineId}`)
  }

  async createSubDiscipline(payload)
  {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateSubDiscipline(subDisciplineId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${subDisciplineId}`, payload)
  }

  async deleteSubDiscipline(subDisciplineId)
  {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${subDisciplineId}`)
  }
}

export default SubDisciplineService
