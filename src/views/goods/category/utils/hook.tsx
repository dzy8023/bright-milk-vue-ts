import editForm from "../components/form.vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import { h, ref, computed, reactive, type Ref } from "vue";
import { getCategoryTreeApi } from "@/api/category";
import type { CategoryItem, CategoryTreeNode } from "@/types/category";

export function useUser(treeRef: Ref) {
  const form = reactive({
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  function onChange(data: CategoryItem) {
    ElMessageBox.confirm(
      `确认要<strong>${
        data.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        data.name
      }</strong>分类吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[data.id] = Object.assign(
          {},
          switchLoadMap.value[data.id],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[data.id] = Object.assign(
            {},
            switchLoadMap.value[data.id],
            {
              loading: false
            }
          );
          message("已成功修改分类状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        data.status === 0 ? (data.status = 1) : (data.status = 0);
      });
  }

  const query = ref("");
  const treeData = ref<CategoryTreeNode[]>([]);
  const getCategoryTreeData = async () => {
    const res = await getCategoryTreeApi();
    treeData.value = res.result;
    console.log(res.result);
  };
  const onQueryChanged = (query: string) => {
    (treeRef as any).value!.filter(query);
  };
  const filterMethod = (query: string, node: CategoryTreeNode) => {
    return node.name!.indexOf(query) !== -1;
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    getCategoryTreeData();
  };
  /**新增，修改分类 */
  function openDialog(title = "新增", node, data?: FormItemProps) {
    addDialog({
      title: `${title}分类`,
      props: {
        formInline: {
          title,
          id: data?.id ?? "",
          name: data?.name ?? "",
          parentId: data?.parentId ?? "",
          sort: data?.sort ?? 0,
          status: data?.status ?? 0
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了用户名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          getCategoryTreeData(); // 刷新表格数据
        }
        // 新增、修改
        if (title === "新增") {
          chores();
        } else {
          // 修改
          getCategoryTreeData();
        }
      }
    });
  }
  function handleDelete(node, data) {
    message(`您删除了分类编号为${data.id}的这条数据`, { type: "success" });
    getCategoryTreeData();
  }
  return {
    form,
    treeData,
    selectedNum,
    pagination,
    buttonClass,
    switchStyle,
    query,
    onChange,
    deviceDetection,
    getCategoryTreeData,
    resetForm,
    openDialog,
    handleDelete,
    filterMethod,
    onQueryChanged
  };
}
