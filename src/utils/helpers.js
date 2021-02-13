export function removeExtraneous(object, desiredKeys) {
  const newObject = desiredKeys.reduce((obj, property) => { 
    if (object[property]) obj[property] = object[property];
    return obj
  }, {});   
  return newObject;
}

export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}