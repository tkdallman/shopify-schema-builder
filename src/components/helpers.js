export function removeExtraneous(object, desiredKeys) {
  const newObject = {};

  desiredKeys.forEach(property => { 
    if (object[property]) {
      newObject[property] = object[property];
    }
  });   
  return newObject;
}

export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}