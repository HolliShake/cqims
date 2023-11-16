import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  firstName: "",
  lastName: "",
  email: "",
  mobileNo: "",
  relation: "",
  childId: "",
})

/*
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string MobileNo { get; set; }
    // Fk (user)
    public string UserId { get; set; }
    public User User { get; set; }
*/

const useParentStore = defineStore("Parent", {
  state: () => ({
    parents: [],
    parentModel: defaultModel(),
    childId: null,
  }),

  getters: {
    getParent() {
      return this.parents
    },
    getParentModel() {
      const model = cloneDeep(this.parentModel)

      if (!this.childId) {
        console.warn("Parent store: childId is not set")
      }

      model.childId = this.childId
      
      return model
    },
  },

  actions: {
    async initialize(parentsArray) {
      this.parents = parentsArray
    },
    async findAsync(parentId) {
      return this.parents.find(parent => parent.id == parentId)
    },
    async add(parent) {
      this.parents.push(parent)
    },
    async update(parent) {
      merge(
        await this.findAsync(parent.id),
        parent,
      )
    },
    async delete(parent) {
      this.parents = this.parents.filter(p => p.id != parent.id)
    },
    async setChild(childId) {
      this.childId = childId
    },
    async setField(parent) {
      this.parentModel = parent
    },
    async resetField() {
      this.parentModel = defaultModel()
    },
  },
})

export default useParentStore
