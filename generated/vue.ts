import { defineComponent, h, type PropType } from 'vue';
import type { IconName } from './index';

/**
 * Universal Production Vue 3 Icon Component
 * Loads authentic canonical raw SVG assets
 */
export const Icon = defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    className: {
      type: String,
      default: ''
    },
    basePath: {
      type: String,
      default: '/icons'
    }
  },
  setup(props, { attrs }) {
    return () =>
      h('img', {
        src: `${props.basePath}/${props.name}.svg`,
        alt: `${props.name} icon`,
        width: props.size,
        height: props.size,
        class: props.className,
        style: {
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0
        },
        loading: 'lazy',
        decoding: 'async',
        ...attrs
      });
  }
});

export default Icon;
