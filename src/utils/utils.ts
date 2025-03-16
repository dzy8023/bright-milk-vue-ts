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
/**
 * 从数组获取对应长度字符串
 * @param arr 数组
 * @param split 分隔符
 * @param length 字符串长度
 * @returns
 */
export const getStrFromArr = (
  arr: any,
  prop: string,
  length: number,
  split: string = ","
) => {
  let str = "";
  let i = 0;
  for (; i < arr.length; i++) {
    if (str.length < length) {
      str += arr[i][prop] + split;
    } else {
      str = str + "...";
      break;
    }
  }
  return i < arr.length ? str : str.slice(0, -split.length);
};

/**遍历树结构，获取对应属性值列表
 * @param tree 树结构
 * @param prop 属性名
 * @returns 属性值列表
 */
export const getTreeProp = (tree: any, prop: string) => {
  const result = new Set<any>();
  function traverse(node: any) {
    if (node[prop]) {
      result.add(node[prop]);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child);
      });
    }
  }
  traverse(tree);
  return Array.from(result);
};
