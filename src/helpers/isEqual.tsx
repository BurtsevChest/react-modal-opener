//  The isEqual helper is needed to compare the component's propses (there is no point in dragging the entire Lodash library, + all cases are not processed in the library function (for example, when the property value is "null"))

const parseObject = (object: object) => {
  return JSON.parse(JSON.stringify(object));
}

/**
 * @param {*} object1 First object
 * @param {*} object2 Second объект
 * @returns Compares two objects for equality. true - if equal, false - if not
 */
export function isEqual(object1: object | undefined, object2: object | undefined) {
  if (!object1 && !object2) {
    return true;
  }
  if (!object1 || !object2) {
    return false;
  }

  const parsedObject1 = parseObject(object1);
  const parsedObject2 = parseObject(object2);
  const props1 = Object.getOwnPropertyNames(parsedObject1);
  const props2 = Object.getOwnPropertyNames(parsedObject2);

  if (props1.length !== props2.length) {
    return false;
  }

  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i];
    const bothAreObjects = (typeof (parsedObject1[prop]) === 'object' && parsedObject1[prop] != null) && (typeof (parsedObject2[prop]) === 'object' && parsedObject2[prop] != null);

    if ((!bothAreObjects && (parsedObject1[prop] !== parsedObject2[prop])) || (bothAreObjects && !isEqual(parsedObject1[prop], parsedObject2[prop]))) {
      return false;
    }
  }

  return true;
}
