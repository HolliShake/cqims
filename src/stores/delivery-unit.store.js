import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"


const defaulModel = () => ({
  deliveryUnitName: "",
  deliveryUnitShortName: "",
  deliveryUnitDescription: "",
  campusId: 0,
})

const useDeliveryUnitStore = defineStore("DeliveryUnitStore", {

  state: () => ({
    deliveryUnits: [],
    deliveryUnitModel: defaulModel(),
    campus: null,
  }),
  
  getters: {
    getDeliveryUnits() {
      return this.deliveryUnits
    },
    getDeliveryUnitModel() {
      const model = cloneDeep(this.deliveryUnitModel)

      model.campusId = this.campus

      return model
    },
    getCampus() {
      this.campus
    },
  },

  actions: {

    async setDeliveryUnits(deliveryUnits) {
      this.deliveryUnits = deliveryUnits
    },

    async clear() {
      this.deliveryUnits = []
    },

    async findAsync(deliveryUnitId) {
      return this.deliveryUnits.find(du => du.id == deliveryUnitId)
    },

    find(deliveryUnitId) {
      return this.deliveryUnits.find(du => du.id == deliveryUnitId)
    },

    async add(deliveryUnit) {
      this.deliveryUnits.push(deliveryUnit)
    },

    async update(deliveryUnit) {
      merge(
        this.deliveryUnits.find(du => du.id == deliveryUnit.id),
        deliveryUnit,
      )
    },

    async delete(deliveryUnit) {
      this.deliveryUnits = this.deliveryUnits.filter(du => du.id != deliveryUnit.id)
    },

    async setField(deliveryUnit) {
      this.deliveryUnitModel = deliveryUnit
    },

    async resetField() {
      this.deliveryUnitModel = defaulModel()
    },

    async setCampus(campusId) {
      this.campus = campusId
    },
  },

})

export default useDeliveryUnitStore

