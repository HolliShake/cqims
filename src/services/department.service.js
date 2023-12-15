import axiosIns from "@/plugins/axios"


class DepartmentService {
    constructor() {
        this._endPoint = "/Department"
    }

    getDepartmentByDeliveryUnitId(deliveryUnitId) {
        return axiosIns.get(this._endPoint + `/DeliveryUnit/${deliveryUnitId}`)
    }

    createDepartment(payload) {
        return axiosIns.post(this._endPoint + '/Create', payload)
    }

    updateDepartment(departmentId, payload) {
        return axiosIns.put(this._endPoint + '/Update' + `/${departmentId}`, payload)
    }

    deleteDepartment(departmentId) {
        return axiosIns.delete(this._endPoint + '/Delete' + `/${departmentId}`)
    }
}

export default DepartmentService
