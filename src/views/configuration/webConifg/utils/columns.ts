// 添加规则
import { reactive } from "vue";

export const rules = reactive({
  // 应用程序的版本
  version: [{ required: true, message: "输入版本", trigger: "blur" }],
  // 应用程序的版本
  locale: [{ required: true, message: "输入本地语言", trigger: "blur" }],
  // 应用程序的标题
  title: [{ required: true, message: "输入网页title", trigger: "blur" }],
  // 头部是否固定
  fixedHeader: [{ required: true, message: "输入固定头", trigger: "blur" }],
  // 是否缓存多个标签
  multiTagsCache: [
    { required: true, message: "输入是否缓存多个标签", trigger: "blur" }
  ],
  // 应用程序的标题
  copyright: [{ required: true, message: "输入版权", trigger: "blur" }],
  // 应用程序的主题
  theme: [{ required: true, message: "输入主题", trigger: "blur" }],
  // 应用程序的整体样式
  overallStyle: [
    { required: true, message: "输入应用程序的整体样式", trigger: "blur" }
  ],
  // 色弱模式
  weak: [{ required: true, message: "输入色弱模式", trigger: "blur" }],
  // 是否隐藏页脚
  hideFooter: [
    { required: true, message: "输入是否隐藏页脚", trigger: "blur" }
  ],
  // 侧边栏的状态
  sidebarStatus: [
    { required: true, message: "输入侧边栏的状态", trigger: "blur" }
  ],
  // 是否显示logo
  showLogo: [{ required: true, message: "输入是否显示logo", trigger: "blur" }],
  // 菜单箭头图标是否没有过渡效果
  menuArrowIconNoTransition: [
    {
      required: true,
      message: "输入菜单箭头图标是否没有过渡效果",
      trigger: "blur"
    }
  ],
  // 工具提示的效果
  tooltipEffect: [
    { required: true, message: "输入工具提示的效果", trigger: "blur" }
  ],
  // 版权信息
  hiddenSideBar: [
    { required: true, message: "输入侧边栏是否隐藏", trigger: "blur" }
  ],
  // 头部是否固定
  keepAlive: [{ required: true, message: "输入是否持久化", trigger: "blur" }],
  // 侧边栏是否隐藏
  layout: [{ required: true, message: "输入应用程序的布局", trigger: "blur" }],
  // 是否缓存多个标签
  darkMode: [
    { required: true, message: "输入是否启用深色模式", trigger: "blur" }
  ],
  // 是否持久化
  grey: [{ required: true, message: "输入是否启用灰色模式", trigger: "blur" }],
  // 语言类型
  hideTabs: [
    { required: true, message: "输入是否隐藏选项卡", trigger: "blur" }
  ],
  // 应用程序的布局
  stretch: [{ required: true, message: "输入是否拉伸", trigger: "blur" }],
  // 应用程序的主题
  epThemeColor: [{ required: true, message: "输入主题颜色", trigger: "blur" }],
  // 是否启用深色模式
  showModel: [{ required: true, message: "输入要显示的模型", trigger: "blur" }],
  // 应用程序的整体样式
  cachingAsyncRoutes: [
    { required: true, message: "输入是否缓存异步路由", trigger: "blur" }
  ],
  // 是否启用灰色模式
  responsiveStorageNameSpace: [
    {
      required: true,
      message: "输入响应式存储的命名空间",
      trigger: "blur"
    }
  ],
  // 菜单搜索历史
  menuSearchHistory: [
    { required: true, message: "输入菜单搜索历史", trigger: "blur" }
  ]
});
