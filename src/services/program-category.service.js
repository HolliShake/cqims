import axiosIns from "@/plugins/axios"


class ProgramCategory
{
  constructor()
  {
    this._endPoint = "/ProgramCategory"
  }

  async getAllProgramCategories() {
    return axiosIns.get(this._endPoint + "/All")
  }

  async createProgramCategory(payload) {
    return axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateProgramCategory(programCategoryId, payload) {
    return axiosIns.put(this._endPoint + "/Update" + `/${programCategoryId}`, payload)
  }

  async deleteProgramCategory(programCategoryId) {
    return axiosIns.delete(this._endPoint + "/Delete" + `/${programCategoryId}`)
  }
}

export default ProgramCategory

