import { defineStore } from "pinia"

const useAuthStore = defineStore("AuthStore", {
  state: () => ({
    credential: null,
  }),

  getters: {
    getCredential() {
      return this.credential
    }
  },
    
  actions: {
    async setCredential(credential) {
      this.credential = credential

      // Access token | User data
      localStorage.setItem("accessToken", credential.accessToken)
      localStorage.setItem("userData", JSON.stringify(credential))

      // Refresh token
    },
  },
})

export default useAuthStore

