import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  departmentName: "",
  deliveryUnitId: 0,
})

const useDepartmentStore = defineStore('Department', {
  state: () => ({
    departments: [],
    departmentModel: defaultModel(),
    deliveryUnitId: null,
  }),

  getters: {
    getDepartments() {
      return this.departments
    },
    getDepartmentModel() {
      const model = cloneDeep(this.departmentModel)

      model.deliveryUnitId = this.deliveryUnitId
      
      return model
    },
  },

  actions: {
    async initialize(departmentArray) {
      this.departments = departmentArray
    },
    async add(department) {
      this.departments.push(department)
    },
    async update(department) {
      merge(
        this.departments.find(d => d.id == department.id),
        department,
      )
    },
    async delete(department) {
      this.departments = this.departments.filter(d => d.id != department.id)
    },
    async setDeliveryUnit(deliveryUnitId) {
      this.deliveryUnitId = deliveryUnitId
    },
    async setField(department) {
      this.departmentModel = department
    },
    async resetField() {
      this.departmentModel = defaultModel()
    },
  },
})


export default useDepartmentStore
