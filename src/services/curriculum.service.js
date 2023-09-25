import axiosIns from "@/plugins/axios"




class CurriculumService 
{
  constructor()
  {
    this._endPoint = "/Core/Curriculum"
  }

  async getCurriculumsByAcademicProgramId(academicProgramId)
  {
    return await axiosIns.get(this._endPoint + "/AcademicProgram" + `/${academicProgramId}`)
  }

  async createCurriculum(payload)
  {
    return await axiosIns.post(this._endPoint + "/Create", payload)
  }

  async updateCurriculum(curriculumId, payload)
  {
    return await axiosIns.put(this._endPoint + "/Update" + `/${curriculumId}`, payload)
  }

  async deleteCurriculum(curriculumId)
  {
    return await axiosIns.delete(this._endPoint + "/Delete" + `/${curriculumId}`)
  }
}

export default CurriculumService
