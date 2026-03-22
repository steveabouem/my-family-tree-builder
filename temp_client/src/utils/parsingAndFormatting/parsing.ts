/** React doesnt automatically know that object['one.two.three'] needs to be traversed. JS reads it as object['one.two.three']
* this function parses through the keys in the string and traverses the object all to way to the last one
**/
export function traverse<V>(object: {[key: string]: V}, path: string): V  {
  const nestedValue = path.split('.').reduce((previousLayer: any, currentKey: string) => {
    return previousLayer?.[currentKey] || ''}, object);
  return nestedValue || '';
}