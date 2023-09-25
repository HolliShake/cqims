import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  curriculumName: "",
  programType: "",
  major: "",
  minor: "",
  totalSemesters: 2,
  yearFirstImplemented: new Date(Date.now()),
  isActive: false,
  isDefault: false,
  academicTermId: null,
  academicProgramId: null,
})


const useCurriculumStore = defineStore("CurriculumStore", {

  state: () => ({
    curriculums: [],
    curriculumModel: defaultModel(),
    academicProgram: null,
  }),


  getters: {
    getCurriculums() {
      return this.curriculums
    },
    getCurriculumModel() {
      const model = /**/
        cloneDeep(this.curriculumModel)

      model.academicProgramId = this.academicProgram
      
      return model
    },
  },

  actions: {
    async initialize(curriculums) {
      this.curriculums = curriculums
    },

    async clear() {
      this.curriculums = []
    },

    async add(curriculum) {
      this.curriculums.push(curriculum)
    },

    async update(curriculum) {
      merge(
        this.curriculums.find(c => c.id == curriculum.id),
        curriculum,
      )
    },

    async delete(curriculum) {
      this.curriculums = this.curriculums.filter(c => c.id != curriculum.id)
    },

    async setAcademicProgram(academicProgramId) {
      this.academicProgram = academicProgramId
    },

    async setField(curriculum) {
      this.curriculumModel = curriculum
    },

    async resetField() {
      this.curriculumModel = defaultModel()
    },
  },

})

export default useCurriculumStore
