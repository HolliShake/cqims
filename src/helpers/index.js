import Hashids from 'hashids'

const SALT = "S@lt"
const KEY = "Dt0!"

const security = ({
  encrypt: function (text) { 
    try {
      return (new Hashids('dto@cqi', 8)).encode(text)
    } catch (err) {
      return "0"
    }
  },
  decrypt: function (text) { 
    text = text.toString()
    try {  
      return (new Hashids('dto@cqi', 8)).decode(text).pop()
    } catch (err) {
      return "0"
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

const resolver = ({
  getColor: function (value) {
    if (value <= 25) {
      return "error"
    } else if (value <= 50) {
      return "warning"
    } else if (value <= 75) {
      return "success"
    } else {
      return "primary"
    }
  },
})

export const helpers = Object.freeze({
  security,
  formater,
  resolver,
})

