export function removeExtraneous(object, desiredKeys) {
  const newObject = {};

  desiredKeys.forEach(property => { 
    if (object[property]) {
      newObject[property] = object[property];
    }
  });   
  
  return newObject;
}