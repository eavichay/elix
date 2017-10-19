// import { html } from '../node_modules/lit-html/lit-html.js';
import * as props from '../mixins/props.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import deepContains from '../mixins/deepContains.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import HostPropsMixin from '../mixins/HostPropsMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin';
// import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  HostPropsMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  // LitHtmlShadowMixin(
  ReactiveMixin(
  SelectionAriaMixin(
  ShadowTemplateMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    HTMLElement
  ))))))))))));


/**
 * A container for a set of tab buttons.
 *
 * `TabStrip` is specifically responsible for handling keyboard navigation
 * between tab buttons, and for the visual layout of the buttons.
 *
 * The user can select a tab with the mouse or touch, as well as by through the
 * keyboard. Each tab appears as a separate button in the tab order.
 * Additionally, if the focus is currently on a tab, the user can quickly
 * navigate between tabs with the left/right arrow keys (or, if the tabs are
 * in vertical position, the up/down arrow keys).
 *
 * By default, the tabs are shown aligned to the left (in left-to-right
 * languages like English), where each tab is only as big as necessary. You
 * can adjust the alignment of the tabs with the `tabAlign` property.
 *
 * The component assumes that the tab buttons will appear above the tab panels
 * they control. You can adjust that positioning with the `tabPosition`
 * property.
 *
 * A `TabStrip` is often wrapped around a set of tab panels, a scenario which
 * can be handled with the separate [TabStripWrapper](TabStripWrapper)
 * component.
 *
 * @extends HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class TabStrip extends Base {

  componentDidUpdate() {
    if (super.componentDidUpdate) { super.componentDidUpdate(); }

    // Does this component, or any of its assigned nodes, have focus?
    // This is a surprisingly hard question to answer.
    // Try finding the deepest active element, then walking up.
    let activeElement = document.activeElement;
    while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    const focused = deepContains(this, activeElement);

    // Ensure the selected tab button has the focus.
    const selectedItem = this.selectedItem;
    if (focused &&
      selectedItem &&
      selectedItem instanceof HTMLElement &&
      selectedItem !== document.activeElement) {
      selectedItem.focus();
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true,
      tabAlign: 'start',
      tabButtonRole: 'tab',
      tabindex: null,
      tabPosition: 'top'
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};

    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';

    const tabAlign = this.state.tabAlign;
    const justifyContent = {
      'center': 'center',
      'end': 'flex-end',
      'start': 'flex-start',
      'stretch': null // No style needed for "stretch"
    };

    const style = Object.assign(
      {
        'display': 'flex',
        'flex-direction': lateralPosition ? 'column' : 'row',
        'justify-content': justifyContent[tabAlign] || original.style.justifyContent
      }
    );

    return props.merge(base, {
      attributes: {
        role: original.attributes.role || 'tablist'
      },
      style
    });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};

    const tabAlign = this.state.tabAlign;
    const tabPosition = this.state.tabPosition;
    const selected = index === this.state.selectedIndex;

    return props.merge(base, {
      attributes: {
        index,
        role: original.attributes.role || this.state.tabButtonRole,
        'tab-align': tabAlign,
        'tab-position': tabPosition
      },
      classes: {
        selected
      },
      style: {
        'cursor': 'pointer',
        'font-family': 'inherit',
        'font-size': 'inherit',
        // 'outline': 'none',
        // 'position': 'relative',
        '-webkit-tap-highlight-color': 'transparent',
      }
    });
  }

  [symbols.keydown](event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.keyCode) {
      /* eslint-disable no-case-declarations */
      case 13: /* Enter */
      case 32: /* Space */
        // TODO
        // const index = this.indexOfTarget(event.target);
        const index = this.items && this.items.indexOf(event.target);
        handled = this.updateSelectedIndex(index);
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  // TabStrip orientation depends on tabPosition property.
  get orientation() {
    const tabPosition = this.state.tabPosition;
    return tabPosition === 'top' || tabPosition === 'bottom' ?
      'horizontal' :
      'vertical';
  }

  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  get tabPosition() {
    return this.state.tabPosition;
  }
  set tabPosition(tabPosition) {
    this.setState({ tabPosition });
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }

}


customElements.define('elix-tab-strip', TabStrip);
export default TabStrip;
