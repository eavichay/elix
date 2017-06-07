//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AsyncEffectMixin from '../mixins/AsyncEffectMixin.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';


const durationKey = Symbol('duration');
const fromEdgeKey = Symbol('fromEdge');
const timeoutKey = Symbol('timeout');


const Base =
  AsyncEffectMixin(
  AttributeMarshallingMixin(
  OpenCloseMixin(
  OverlayMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
  TransitionEffectMixin(
    HTMLElement
  )))))));


class Toast extends Base {

  constructor() {
    super();

    // If the user moves the mouse over the element, stop the timer.
    this.addEventListener('mouseover', () => {
      clearTimer(this);
    });

    // If the user moves the mouse away, restart the timer.
    this.addEventListener('mouseout', () => {
      startTimer(this);
    });

    // Set defaults.
    if (typeof this.duration === 'undefined') {
      this.duration = this[symbols.defaults].duration;
    }
    if (typeof this.fromEdge === 'undefined') {
      this.fromEdge = this[symbols.defaults].fromEdge;
    }
  }

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    // We can't seem to write a CSS rule that lets a shadow element be sensitive
    // to the `dir` attribute of an ancestor, so we reflect the inherited
    // direction to the component. We can then write styles that key off of
    // that.
    const direction = getComputedStyle(this).direction;
    if (direction === 'rtl' && !this.dir) {
      this.setAttribute('dir', 'rtl');
    }
  }

  [symbols.afterEffect](effect) {
    if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
    switch (effect) {
      case 'opening':
        if (this.duration != null) {
          startTimer(this);
        }
        break;
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.duration = 2500; /* milliseconds */
    defaults.fromEdge = 'bottom';
    return defaults;
  }

  /**
   * @type {number}
   */
  get duration() {
    return this[durationKey];
  }
  /**
   * @param {number} duration
   */
  set duration(duration) {
    this[durationKey] = typeof duration === 'string' ? parseInt(duration) : duration;
  }

  [symbols.elementsWithEffectTransitions](effect) {
    return [this.$.overlayContent];
  }

  /**
   * Note that the meanings of "left" and "right" are flipped for right-to-left
   * languages.
   *
   * @type {"bottom"|"bottom-left"|"bottom-right"|"top"|"top-left"|"top-right"|null}
   */
  get fromEdge() {
    return this[fromEdgeKey];
  }
  set fromEdge(fromEdge) {
    this[fromEdgeKey] = fromEdge;
    this.reflectAttribute('from-edge', fromEdge);
  }

  [symbols.openedChanged](opened) {
    if (!opened) {
      clearTimer(this);
    }
  }

  [symbols.template](filler) {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          width: 100%;
        }

        :host(:not(.visible)) {
          display: none;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          margin: 1em;
          opacity: 0;
          pointer-events: initial;
          transition-duration: 0.25s;
          transition-property: opacity, transform;
          transition-timing-function: ease-in;
          will-change: opacity, transform;
        }

        :host(.opening-effect) #overlayContent {
          opacity: 1.0;
          transition-timing-function: ease-out;
        }

        /* From bottom edge (the default) */
        :host([from-edge="bottom"]) {
          align-items: center;
          justify-content: flex-end;
        }
        :host([from-edge="bottom"]) #overlayContent {
          transform: translateY(100%);
        }
        :host([from-edge="bottom"].opening-effect) #overlayContent {
          transform: translateY(0);
        }

        /* From bottom-left corner */
        :host([from-edge="bottom-left"]) {
          align-items: flex-start;
          justify-content: flex-end;
        }
        :host([from-edge="bottom-left"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="bottom-left"][dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="bottom-left"].opening-effect) #overlayContent {
          transform: translateX(0);
        }

        /* From bottom-right corner */
        :host([from-edge="bottom-right"]) {
          align-items: flex-end;
          justify-content: flex-end;
        }
        :host([from-edge="bottom-right"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="bottom-right"][dir="rtl"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="bottom-right"].opening-effect) #overlayContent {
          transform: translateX(0);
        }

        /* From top edge */
        :host([from-edge="top"]) {
          align-items: center;
        }
        :host([from-edge="top"]) #overlayContent {
          transform: translateY(-100%);
        }
        :host([from-edge="top"].opening-effect) #overlayContent {
          transform: translateY(0);
        }

        /* From top-left corner */
        :host([from-edge="top-left"]) {
          align-items: flex-start;
        }
        :host([from-edge="top-left"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="top-left"][dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="top-left"].opening-effect) #overlayContent {
          transform: translateX(0);
        }

        /* From top-right corner */
        :host([from-edge="top-right"]) {
          align-items: flex-end;
        }
        :host([from-edge="top-right"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="top-right"][dir="rtl"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="top-right"].opening-effect) #overlayContent {
          transform: translateX(0);
        }

        @media (prefers-reduced-motion) {
          #overlayContent {
            transition-duration: 0.001s;
          }
        }
      </style>
      <div id="overlayContent">
        ${filler || `<slot></slot>`}
      </div>
    `;
  }

}


customElements.define('elix-toast', Toast);
export default Toast;


function clearTimer(element) {
  if (element[timeoutKey]) {
    clearTimeout(element[timeoutKey]);
    element[timeoutKey] = null;
  }
}

function startTimer(element) {
  clearTimer(element);
  element[timeoutKey] = setTimeout(() => {
    element[symbols.raiseChangeEvents] = true;
    element.close();
    element[symbols.raiseChangeEvents] = false;
  }, element.duration);
}
