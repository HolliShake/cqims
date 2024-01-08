import { cloneDeep, merge } from "lodash";
import { defineStore } from "pinia";

const defaultModel = () => ({
    catalogId: 0,
    courseId: 0,
})

const useCatalogCourseStore = defineStore("CatalogCourse", {

    state: () => ({
        catalogCourses: [],
        catalogCourseModel: defaultModel()
    }),

    getters: {
        getCatalogCourses() {
            return this.catalogCourses
        },
        getCatalogModel() {
            const model = cloneDeep(this.catalogCourseModel)
            // 
            return model
        }
    },

    actions: {
        async initialize(catalogCourseArray) {
            this.catalogCourses = catalogCourseArray
        },
        async add(catalogCourse) {
            this.catalogCourses.push(catalogCourse)
        },
        async update(catalogCourse) {
            merge(
                this.catalogCourses.find(c => c.id == catalogCourse.id),
                catalogCourse
            )
        },
        async delete(catalogCourse) {
            this.catalogCourses = this.catalogCourses.filter(c => c.id != catalogCourse.id)
        },
        async setField(catalogCoruse) {
            this.catalogCourseModel = catalogCoruse
        },
        async resetField() {
            this.catalogCourseModel = defaultModel()
        }
        
    }
})


export default useCatalogCourseStore
