import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  acdemicProgramName: "",
  acdemicProgramShortName: "",
  boardResolutionNumber: 0,
  yearOffered: new Date(Date.now()),
  dateApproved: new Date(Date.now()),
  yearFirstGraduate: new Date(Date.now()),
  notes: "",
  isChedIdentified: false,
  isRdcPriority: false,
  isThesisRequired: false,
  isAccreditable: false,
  isNonBoard: false,
  isOnCampus: false,
  isDistantLearning: false,
  deliveryUnitId: 0,
  examinationId: 0,
  programCategoryId: 0,
})

const useAcademicProgramStore = defineStore("AcademicProgramStore", {

  state: () => ({
    academicPrograms: [],
    academicProgramModel: defaultModel(),
    deliveryUnit: null,
  }),

  getters: {
    getAcademicPrograms() {
      return this.academicPrograms
    },
    getAcademicProgramModel() {
      const model = cloneDeep(this.academicProgramModel)

      model.deliveryUnitId = this.deliveryUnit
      
      return model
    },
    getDeliveryUnit() {
      return this.deliveryUnit
    },
  },

  actions: {
    async setAcademicPrograms(academicPrograms) {
      this.academicPrograms = academicPrograms
    },

    async clear() {
      return this.academicPrograms = []
    },

    async add(academicProgram) {
      this.academicPrograms.push(academicProgram)
    },

    async update(academicProgram) {
      merge(
        this.academicPrograms.find(ap => ap.id == academicProgram.id),
        academicProgram,
      )
    },

    async delete(academicProgram) {
      this.academicPrograms = this.academicPrograms.filter(ap => ap.id != academicProgram.id)
    },

    async setDeliveryUnit(deliveryUnitId) {
      this.deliveryUnit = deliveryUnitId
    },

    async setField(academicProgram) {
      this.academicProgramModel = academicProgram
    },

    async resetField() {
      this.academicProgramModel = defaultModel()
    },
  },

})

export default useAcademicProgramStore
