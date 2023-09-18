import CryptoJS from "crypto-js"

const SALT = "S@lt"
const KEY = "Dt0!"

export const helpers =  Object.freeze({
  security: {
    encrypt: function (text) { 
      try {
        return CryptoJS.AES.encrypt(SALT + `${text}`, KEY).toString()
      } catch (err) {
        return ""
      }
    },
    decrypt: function (text) { 
      text = text.toString()
      try {
        const bytes =
            CryptoJS.AES.decrypt(text, KEY)
      
        return bytes.toString(CryptoJS.enc.Utf8).replaceAll(SALT, "")
      } catch (err) {
        return ""
      }
    },
  },
})

