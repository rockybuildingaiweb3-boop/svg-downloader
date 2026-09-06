import { defineComponent, h, type PropType } from 'vue';
import { ICONS, type IconName } from './index';

export const Icon = defineComponent({
  name: 'CanonicalIcon',
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props, { attrs }) {
    return () => {
      const icon = ICONS[props.name];
      if (!icon) {
        console.warn(`[IconRegistry] Icon "${props.name}" not found in canonical registry`);
        return null;
      }

      return h('img', {
        src: `/icons/${icon.file}`,
        alt: props.title || icon.title || props.name,
        width: props.size,
        height: props.size,
        loading: 'lazy',
        decoding: 'async',
        ...attrs
      });
    };
  }
});

export default Icon;
