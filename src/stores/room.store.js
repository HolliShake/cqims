import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultData = () => ({
  roomNumber: 1,
  roomName: "",
  roomShortName: "",
  roomDescription: "",
  floorNumber: null,
  isLaboratory: true,
  buildingId: 0,
})

const useRoomStore = defineStore("RoomStore", {
  state: () => ({
    rooms: [],
    roomModel: {
      ...defaultData(),
    },
  }),

  getters: {
    getRooms() {
      return this.rooms
    },
    getRoomModel() {
      return cloneDeep(this.roomModel)
    },
  },

  actions: {
    async setRooms(rooms) {
      this.rooms = rooms
    },
    async appendRoom(room) {
      this.rooms.push(room)
    },
    async patchRoom(room) {
      merge(
        this.rooms.find(c => c.id == room.id),
        room,
      )
    },
    async removeRoom(room) {
      this.rooms = this.rooms.filter(r => r.id != room.id)
    },
    async setRoomModel(roomModel, updateMode) { 
      this.roomModel = roomModel
      this.isUpdate = updateMode ?? this.isUpdate
    },
    async unsetRoomModel() { 
      this.isUpdate = false
      this.roomModel = defaultData()
    },
  },
})

export default useRoomStore
