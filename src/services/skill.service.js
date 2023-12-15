import axiosIns from "@/plugins/axios"


class SkillService {
    constructor() {
        this._endPoint = "/Skill"
    }

    async getSkillsByUserId(userId) {
        return await axiosIns.get(this._endPoint + "/User" + `/${userId}`)
    }

    async createSkill(payload) {
        return await axiosIns.post(this._endPoint + "/Create", payload)
    }

    async updateSkill(skillId, payload) {
        return await axiosIns.put(this._endPoint + "/Update" + `/${skillId}`, payload)
    }

    async deleteSkill(skillId) {
        return await axiosIns.delete(this._endPoint + "/Delete" + `/${skillId}`)
    }
}

export default SkillService
