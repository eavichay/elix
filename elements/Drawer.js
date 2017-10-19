import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OverlayMixin from '../mixins/OverlayMixin.js';
import * as props from '../mixins/props.js';
import symbols from '../mixins/symbols.js';
import TouchSwipeMixin from '../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../mixins/TrackpadSwipeMixin.js';
import VisualStateMixin from '../mixins/VisualStateMixin.js';
import ElementBase from './ElementBase.js';

const Base =
  // FocusCaptureWrapper(
  DialogModalityMixin(
  KeyboardMixin(
  OverlayMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  VisualStateMixin(
    ElementBase
  ))))));


/**
 * A drawer is a modal container generally used to provide navigation in
 * situations where: a) screen real estate is constrained and b) the navigation
 * UI is not critical to completing the user’s primary goal (and, hence, not
 * critical to the application’s business goal).
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes BackdropWrapper
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureWrapper
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 * @mixes TransitionEffectMixin
 */
class Drawer extends Base {

  constructor() {
    super();
    this.immediateTransitions = {
      'opened': 'expanded'
    };
    this.transitionEndTransitions = {
      'collapsed': 'closed'
    };
  }

  backdropProps() {
    const expanded = this.state.visualState === 'expanded';
    const swiping = this.state.swipeFraction !== null;
    const swipeFraction = Math.max(Math.min(this.state.swipeFraction, 1), 0);
    let opacity = expanded ? 0.2 : 0;
    if (swiping) {
      opacity *= 1 - swipeFraction;
    }
    return {
      style: {
        opacity,
        'transition': !swiping && 'opacity 0.25s linear',
        'willChange': 'opacity'
      }
    };
  }

  close() {
    const nextVisualState = this.state.visualState === 'expanded' ?
      'collapsed' :
      'closed';
    this.changeVisualState(nextVisualState);
  }

  contentProps() {
    const sign = this.rightToLeft ? -1 : 1;
    const expanded = this.state.visualState === 'expanded';
    const swiping = this.state.swipeFraction !== null;
    const swipeFraction = Math.max(Math.min(sign * this.state.swipeFraction, 1), 0);
    const transform = expanded ?
      `translateX(${-sign * swipeFraction * 100}%)` :
      'translateX(-100%)';
    return {
      style: {
        'background': 'white',
        'border': '1px solid rgba(0, 0, 0, 0.2)',
        'boxShadow': '0 2px 10px rgba(0, 0, 0, 0.5)',
        'position': 'relative',
        transform,
        'transition': !swiping && 'transform 0.25s',
        'willChange': 'transform'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedIndex: 0
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const display = this.closed ?
      null :
      base.style && base.style.display || 'flex';
    return props.merge(base, {
      style: {
        'alignItems': 'stretch',
        display,
        'flexDirection': 'row',
        'left': 0,
        'height': '100%',
        'justifyContent': 'flex-start',
        'outline': 'none',
        'position': 'fixed',
        'top': 0,
        'WebkitTapHighlightColor': 'transparent',
        'width': '100%'
      }
    });
  }

  open() {
    this.changeVisualState('opened');
  }

  // Define a property that can be set via an attribute.
  get opened() {
    return this.state.visualState === 'expanded';
  }
  set opened(opened) {
    const parsed = String(opened) === 'true';
    const visualState = parsed ?
      'opened' :
      this.state.visualState === 'expanded' ?
        'collapsed' :
        'closed';
    this.changeVisualState(visualState);
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    props.apply(this.$.backdrop, this.backdropProps());
    props.apply(this.$.content, this.contentProps());
  }

  // TODO: Restore LanguageDirectionMixin
  get rightToLeft() {
    return false;
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
    return `
      <elix-modal-backdrop id="backdrop"></elix-modal-backdrop>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

  swipeLeft() {
    if (!this.rightToLeft) {
      const visualState = this.state.swipeFraction >= 1 ?
        'closed' :
        'collapsed';
      this.changeVisualState(visualState);
    }
  }

  swipeRight() {
    if (this.rightToLeft) {
      const visualState = this.state.swipeFraction <= -1 ?
        'closed' :
        'collapsed';
      this.changeVisualState(visualState);
    }
  }

  get swipeTarget() {
    return this.$.content;
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
