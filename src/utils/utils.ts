//判断对象是否为空
export function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0;
}
//过滤空对象
export function filterEmptyObject(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
//数组过滤空对象
export function filterEmptyArray(arr: any) {
  return arr.filter(item => Object.keys(item).length > 0);
}
