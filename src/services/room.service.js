import axiosIns from "@/plugins/axios"

class RoomService {
  constructor() {
    this.endPoint = "/Core/Room"
  }

  async getAllRooms() {
    return await axiosIns.get(this.endPoint + "/All")
  }

  async getRoomById(roomId) {
    return await axiosIns.get(this.endPoint + `/${roomId}`)
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

  async updateRoom(roomId, payload) {
    return await axiosIns.put(this.endPoint + "/Update" + `/${roomId}`, payload)
  }

  async deleteRoom(roomId) {
    return await axiosIns.delete(this.endPoint + "/Delete" + `/${roomId}`)
  }
}

export default RoomService
