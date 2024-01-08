import { defineStore } from "pinia"

const useAuthStore = defineStore("AuthStore", {
  state: () => {
    let data = null

    try {
      data = JSON.parse(localStorage.getItem("userData")) ?? null
    } catch (e) {
    }

    return ({
      credential: data,
    })
  },

  getters: {
    getCredential() {
      return this.credential
    },
    isLoggedIn() {
      return this.credential != null
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

