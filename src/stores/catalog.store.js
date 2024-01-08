import { cloneDeep, merge } from "lodash";
import { defineStore } from "pinia";

const defaultModel = () => ({
    id: 0,
    catalogName: "",
    catalogDescription: "",
    dateCreated: new Date(Date.now()),
    isActive: true
})

const useCatalogStore = defineStore("Catalog", {

    state: () => ({
        catalogs: [],
        catalogModel: defaultModel()
    }),


    getters: {
        getCatalogs() {
            return this.catalogs
        },
        getCatalogModel() {
            const model = cloneDeep(this.catalogModel)
            // 
            return model
        }
    },


    actions: {
        async initialize(catalogArray) {
            this.catalogs = catalogArray
        },
        async add(catalog) {
            this.catalogs.push(catalog)
        },
        async update(catalog) {
            merge(
                this.catalogs.find(c => c.id == catalog.id),
                catalog
            )
        },
        async delete(catalog) {
            this.catalogs = this.catalogs.filter(c => c.id != catalog.id)
        },
        async setField(catalog) {
            this.catalogModel = catalog
        },
        async resetField() {
            this.catalogModel = defaultModel()
        }
        
    }

})

export default useCatalogStore
