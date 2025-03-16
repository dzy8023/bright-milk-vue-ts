import type { VNode } from "vue";
import type Vue from "vue";

declare module "*.tsx" {
  import Vue from "compatible-vue";
  export default Vue;
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Element extends VNode {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}
