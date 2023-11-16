import axiosIns from "@/plugins/axios"


class HealthService 
{
  constructor() {
    this._endPoint = "/Health"
  }

  async getAllHealth() {
    return await axiosIns.get(this._endPoint + "/All")
  }

  async getHealthById(healthId) {
    return await axiosIns.get(this._endPoint + `/${healthId}`)
  }

  async getHealthByUserId(userId) {
    return await axiosIns.get(this._endPoint + "/User/" + userId)
  }

  async createHealth(payload) {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateHealth(healthId, payload) {
    return await axiosIns.put(this._endPoint + "/Update" + `/${healthId}`, payload)
  }

  async deleteHealth(healthId) {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${healthId}`)
  }
}

export default HealthService
