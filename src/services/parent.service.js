import axiosIns from "@/plugins/axios"

class ParentService {
  constructor() {
    this._endPoint = "/Parent"
  }

  async getAllParents() {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getParentById(parentId) {
    return await axiosIns.get(this._endPoint + `/${parentId}`)
  }

  async getParentsByUserId(userId) {
    return await axiosIns.get(this._endPoint + "/User" + `/${userId}`)
  }

  async createParent(payload) {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateParent(parentId, payload) {
    return await axiosIns.put(this._endPoint + "/Update" + `/${parentId}`, payload)
  }

  async deleteParent(parentId) {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${parentId}`)
  }
}

export default ParentService
