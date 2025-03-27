import type { TableColumns } from "@pureadmin/table";
import { ref } from "vue";
import { filterEmptyArray } from "@/utils/utils";
import type AttrCheckbox from "./attr-checkbox.vue";
import type { SupAttr, SkuAttr } from "./types";

// 如果您不习惯tsx写法，可以传slot，然后在template里写
// 需是hooks写法（函数中有return），避免失去响应性
export function useColumns() {
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    }
  ];
  const tableData = ref([]);
  const attrCheckboxRef = ref<InstanceType<typeof AttrCheckbox>>();
  //带有options的sku属性列表，示例sku-1:[]
  const skuAttrsOptions = ref<SkuAttr[]>();

  const comCloumns = (cloumns: TableColumnList) => {
    return cloumns.push(
      {
        label: "商品名称",
        prop: "name",
        slot: "name",
        width: "200"
      },
      {
        label: "商品价格",
        prop: "price",
        slot: "price",
        width: "200"
      },
      {
        label: "商品折扣",
        prop: "discount",
        slot: "discount",
        width: "200"
      },
      {
        label: "操作",
        width: "180",
        fixed: "right",
        slot: "operation"
      }
    );
  };
  const getColumns = (data: {
    spuAttrs: (SupAttr & { showStatus: 0 | 1 })[];
    saleAttrs: SkuAttr[];
  }) => {
    //保留原来的columns,初始有2列，后面添加的属性列
    columns.splice(2, columns.length);
    const spuAttrColumns = {
      label: "商品属性",
      prop: "spuAttrs",
      children: []
    } as TableColumns;
    data.spuAttrs.forEach(item => {
      spuAttrColumns.children.push({
        label: item.name,
        prop: item.props,
        width: 60 * (item.value as string).split(";").length + 100,
        slot: "spuAttrs"
      });
    });
    const saleAttrColumns = {
      label: "销售属性",
      prop: "saleAttrs",
      children: []
    } as TableColumns;
    data.saleAttrs.forEach(item => {
      saleAttrColumns.children.push({
        label: item.name,
        prop: item.props,
        width: 100,
        cellRenderer: ({ row, column }) => (
          <>
            <el-tag type="success">{row[column.property]}</el-tag>
          </>
        )
      });
    });
    if (data.saleAttrs.length) {
      columns.push(saleAttrColumns);
    }
    if (data.spuAttrs.length) {
      columns.push(spuAttrColumns);
    }
    comCloumns(columns);
    return columns;
  };

  // const cloneData = clone(tableData, true);
  const handleSubmit = (data: any, skus: any, extandData?: any) => {
    console.log("data", data, " skus", skus);
    skuAttrsOptions.value = data.saleAttrs;
    tableData.value = [];
    skus.forEach(sku => {
      tableData.value.push({
        ...sku
      });
    });
    //过滤空对象
    tableData.value = filterEmptyArray(tableData.value);
    if (tableData.value.length > 0) {
      tableData.value.map((item, index) => {
        //获取item中以sku开头的属性，获取它们的值，并赋值给name
        //TODO:根据销售属性id保留更改的数据
        if (extandData instanceof Array) {
          if (extandData.length > index) {
            Object.assign(item, {
              id: index,
              ...extandData[index]
            });
          } else {
            const name =
              (extandData[extandData.length - 1]?.name ?? "商品名称") +
              Object.keys(item)
                .filter(key => key.startsWith("sku"))
                .map(key => item[key])
                .join("");
            Object.assign(item, {
              id: index,
              ...extandData[extandData.length - 1],
              name: name
            });
          }
        } else {
          const name =
            (extandData?.name ?? "商品名称") +
            Object.keys(item)
              .filter(key => key.startsWith("sku"))
              .map(key => item[key])
              .join("");
          Object.assign(item, {
            id: index,
            ...extandData,
            name: name,
            price: extandData?.price ?? 3.8,
            discount: extandData?.discount ?? 0.8
          });
        }
      });
    }
    console.log("columns", getColumns(data));
  };
  return {
    attrCheckboxRef,
    columns,
    tableData,
    skuAttrsOptions,
    handleSubmit
  };
}
