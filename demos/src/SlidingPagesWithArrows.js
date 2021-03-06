import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
    SlidingPages
  );


class SlidingPagesWithArrows extends Base {

  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    return Object.assign({}, super.defaultState, {
      showArrowButtons: window.matchMedia('(pointer:fine)').matches
    });
  }

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      super[symbols.template]
    );
  }

}



customElements.define('sliding-pages-with-arrows', SlidingPagesWithArrows);
export default SlidingPagesWithArrows;
