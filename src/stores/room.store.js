import { defineStore } from "pinia"

const defaultData = () => ({
  roomName: "",
  roomShortName: "",
  roomDescription: "",
  floorNumber: 0,
  isLaboratory: true,
  buildingId: 0,
})

const useRoomStore = defineStore("RoomStore", {
  state: () => ({
    rooms: [],
    isUpdate: false,
    roomModel: {
      ...defaultData(),
    },
  }),

  getters: {
    getRooms() {
      return this.rooms
    },
    getRoomModel() {
      return this.roomModel
    },
    getIsUpdateMode() {
      return this.isUpdate
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
    async removeCampus(room) {
      remove(
        this.rooms,
        room,
      )
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
