<script>
import { OPTION_MARKER } from './inc/combobox-internals.js'

/**
 * <option-ex :value="…" [disabled] [label="…"] [search="…"]>content</option-ex>
 *
 * This component never mounts. <searchable-combobox> reads it straight out of
 * the slot vnodes, so an option costs one vnode instead of one component
 * instance, and its content is rendered (once) inside the popup instead.
 */
export default {
  name: 'OptionEx',
  [OPTION_MARKER]: true,
  props: {
    /** Value written to v-model when this option is picked. Any type. */
    value: { default: undefined },
    /** Overrides the text used for search + the a11y label. */
    label: { type: String, default: undefined },
    /** Extra text to match against (aliases, codes, serial numbers…). */
    search: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  render: () => null,
}
</script>