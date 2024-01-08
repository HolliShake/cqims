import axiosIns from "@/plugins/axios";



class CatalogService {

    constructor() {
        this._endPoint = "/Catalog"
    }

    async getAll() {
        return await axiosIns.get(this._endPoint + "/All")
    }

    async create(payload) {
        return await axiosIns.post(this._endPoint + "/Create", payload)
    }

    async update(id, payload) {
        return await axiosIns.put(this._endPoint + "/Update" + `/${id}`, payload)
    }

    async delete(id) {
        return await axiosIns.delete(this._endPoint + "/Delete" + `/${id}`)
    }

}

export default CatalogService
