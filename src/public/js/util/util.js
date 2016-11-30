export function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_'
  return str.replace(/[^a-z0-9\.]/gim, replacement)
}

export function camelCaseToUnderscore(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

export function maxmin(pos, min, max) {
  if (pos < min) { return min }
  if (pos > max) { return max }
  return pos
}