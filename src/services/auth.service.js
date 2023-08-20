import axiosIns from "@/plugins/axios";

class Auth {

  constructor() {
    this.endPoint = "/Core/Auth"
  }
    
  async login(payload) {
    console.log(payload);
    return await axiosIns.post(this.endPoint + '/Login', payload)
  }
    
  async register(payload) {
    return await axiosIns.post(this.endPoint + '/Register', payload)
  }
    
  async confirmEmail(payload) {
    return await axiosIns.get(this.endPoint + '/ConfirmEmail', payload)
  }

}

export default Auth
