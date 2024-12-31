import { message } from "@/utils/message";
import type { SkuAttr, SupAttr } from "./types";
import type { TableColumns } from "@pureadmin/table";
import { ref } from "vue";
import { filterEmptyArray } from "@/utils/utils";
import type AttrCheckbox from "./attr-checkbox.vue";

// 如果您不习惯tsx写法，可以传slot，然后在template里写
// 需是hooks写法（函数中有return），避免失去响应性
export function useColumns() {
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand",
      fixed: "left"
    }
  ];
  const tableData = ref([]);
  const attrCheckboxRef = ref<InstanceType<typeof AttrCheckbox>>();

  const handleEdit = (index: number, row) => {
    message(`您修改了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
      type: "success"
    });
  };

  const handleDelete = (index: number, row) => {
    message(`您删除了第 ${index} 行，数据为：${JSON.stringify(row)}`);
  };

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
        prop: "name",
        slot: "price",
        width: "200"
      },
      {
        label: "操作",
        width: "180",
        fixed: "right",
        cellRenderer: ({ index, row }) => (
          <>
            <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
              Edit
            </el-button>
            <el-button
              size="small"
              type="danger"
              onClick={() => handleDelete(index + 1, row)}
            >
              Delete
            </el-button>
          </>
        )
      }
    );
  };
  const getColumns = (data: {
    spuAttrs: (SupAttr & { showStatus: 0 | 1 })[];
    saleAttrs: SkuAttr[];
  }) => {
    //保留原来的columns
    columns.splice(1, columns.length);
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
        cellRenderer: ({ row, column }) => (
          <div class="flex flex-wrap">
            {row[column.property].value
              .split(";")
              .map((value: string, index: number) => (
                <el-tag class="mr-2 mb-2" type="info" key={index}>
                  {value}
                </el-tag>
              ))}
            {/* 小圆点和文本 */}
            <div class="flex items-center">
              {/* 动态设置小圆点颜色 */}
              <div
                class="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    row[column.property].quickShow === 1 ? "#aee875" : "#ee3a3a"
                }}
              ></div>
              快速展示
            </div>
          </div>
        )
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
          price: extandData?.price ?? 3.8
        });
      });
    }
    console.log("columns", getColumns(data));
  };
  return {
    attrCheckboxRef,
    columns,
    tableData,
    handleSubmit
  };
}
