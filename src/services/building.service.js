import axiosIns from "@/plugins/axios";

class BuildingService {

    constructor() {
        this.endPoint = "/Core/Building"
    }

    async getAllBuildings() { 
        return await axiosIns.get(this.endPoint + "/All")
    }

    async getAllBuildingsByCampusId(campusId) { 
        return await axiosIns.get(this.endPoint + "/Campus" + `/${campusId}`)
    }

    async getBuildingById(buildingId) {
        return await axiosIns.get(this.endPoint + `/${buildingId}`) 
    }

    async createBuilding(payload) {
        return await axiosIns.post(this.endPoint + "/Create", payload)
    }

    async updateBuilding(buildingId, payload) {
        return await axiosIns.put(this.endPoint + "/Update" + `/${buildingId}`, payload)
    }

    async deleteBuilding(buildingId) { 
        return await axiosIns.delete(this.endPoint + "/Delete" + `/${buildingId}`)
    }
}


export default BuildingService