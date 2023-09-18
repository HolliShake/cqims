import axiosIns from "@/plugins/axios"



class DeliveryUnitService
{
  constructor() 
  {
    this._endPoint = "/Core/DeliveryUnits"
  }

  async getDeliveryUnitsByCampusId(campusId)
  {
    return await axiosIns.get(this._endPoint + `/Campus/${campusId}`)
  }

  async createDeliveryUnit(payload) {
    return axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateDeliveryUnit(deliveryUnitId, payload) {
    return axiosIns.put(this._endPoint + "/Update" + `/${deliveryUnitId}`, payload)
  }

  async deleteDeliveryUnit(deliveryUnitId) {
    return axiosIns.delete(this._endPoint + "/Delete" + `/${deliveryUnitId}`)
  }
}

export default DeliveryUnitService
