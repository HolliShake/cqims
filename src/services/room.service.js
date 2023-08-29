import axiosIns from "@/plugins/axios"

class RoomService {
  constructor() {
    this.endPoint = "/Core/Room"
  }

  async getAllRooms() {
    return await axiosIns.get(this.endPoint + "/All")
  }

  async getAllRoomsByBuildingId(buildingId) {
    return await axiosIns.get(this.endPoint + "/Building/" + `${buildingId}`)
  }

  async getAllRoomsByBuildingIdGrouped(buildingId) {
    return await axiosIns.get(this.endPoint + "/Building/Grouped/" + `${buildingId}`)
  }

  async createRoom(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }
}

export default RoomService
