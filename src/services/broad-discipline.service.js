import axiosIns from "@/plugins/axios"



class BroadDisciplineService
{
  constructor()
  {
    this._endPoint = "/BroadDiscipline"
  }

  async getAllBroadDiscipline()
  {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getBroadDiscipline(broadDisciplineId)
  {
    return await axiosIns.get(this._endPoint + `/${broadDisciplineId}`)
  }

  async createBroadDiscipline(payload)
  {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateBroadDiscipline(broadDisciplineId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${broadDisciplineId}`, payload)
  }

  async deleteBroadDiscipline(broadDisciplineId)
  {
    console.log(this)
    
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${broadDisciplineId}`)
  }
}

export default BroadDisciplineService
