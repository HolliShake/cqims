import { cloneDeep, merge } from "lodash";
import { defineStore } from "pinia";

const defaultModel = () => ({
    skillName: "",
    skillDescription: "",
    skillProgress: 0,
    skillAssessmentType: 0,
    // 
    userId: null,
})

const useSkillStore = defineStore("SkillStore", {
    state: () => ({
        skills: [],
        skillModel: defaultModel(),
        userId: null,
    }),

    getters: {
        getSkills() {
            return this.skills
        },
        getSkillModel() {
            const model = cloneDeep(this.skillModel)

            if (!this.userId) {
                console.warn("User ID is not set")
            }

            model.userId = this.userId

            return model
        },
    },

    actions: {
        async initialize(skillArray) {
            this.skills = skillArray
        },
        async add(skill) {
            this.skills.push(skill)
        },
        async update(skill) {
            merge(
                this.skills.find((s) => s.id == skill.id),
                skill
            )
        },
        async delete(skill) {
            this.skills = this.skills.filter((s) => s.id != skill.id)
        },
        async setUser(userId) {
            this.userId = userId
        },
        async setField(skill) {
            this.skillModel = skill
        },
        async resetField() {
            this.skillModel = defaultModel()
        }
    }
})


export default useSkillStore
