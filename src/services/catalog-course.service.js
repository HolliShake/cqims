import axiosIns from "@/plugins/axios"



class CatalogCourseService {

    constructor() {
        this._endPoint = "/CatalogCourse"
    }

    async getAll() {
        return await axiosIns.get(this._endPoint + "/All")
    }

    async delete(catalogCourseId) {
        return await axiosIns.delete(this._endPoint + "/Delete" + `/${catalogCourseId}`)
    }

}

export default CatalogCourseService

