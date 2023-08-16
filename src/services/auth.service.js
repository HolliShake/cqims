import axiosIns from "@/plugins/axios"

class Auth {

  constructor() {
    this.endPoint = "/Core/Authentication"
  }
    
  async login(payload) {
    return await axiosIns.post(this.endPoint + '/login', payload)
  }
    
  async register(payload) {
    return await axiosIns.post(this.endPoint + '/register', payload)
  }
    
  async confirmEmail(payload) {
    return await axiosIns.get(this.endPoint + '/ConfirmEmail', payload)
  }

}

export default Auth
