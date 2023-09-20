import CryptoJS from "crypto-js"

const SALT = "S@lt"
const KEY = "Dt0!"

const security = ({
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
})

const formater = ({
  dateToWord: function(dateString) {
    const date = new Date(dateString)
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    let dd = date.getDate()

    if (dd < 10)
    {
      dd = `0${dd}`
    }

    return `${MONTHS[date.getMonth()]} ${dd}, ${date.getFullYear()}`
  },
})

export const helpers = Object.freeze({
  security,
  formater,
})

