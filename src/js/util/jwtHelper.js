import decode from 'jwt-decode';
var moment = require('moment');

export function getTokenExpirationDate(token){
  const decoded = decode(token)
  if(!decoded.exp) {
    return null
  }

  const date = new Date(0) // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(decoded.exp)
  return date
}

export function isTokenExpired(token){
  const date = getTokenExpirationDate(token)
  if (date === null) {
    return false
  }
  return moment().isAfter(date);
}
