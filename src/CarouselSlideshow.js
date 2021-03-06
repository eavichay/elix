import './CrossfadeStage.js';
import { merge } from './updates.js';
import Carousel from './Carousel.js';
import TimerSelectionMixin from './TimerSelectionMixin.js';


const Base =
  TimerSelectionMixin(
    Carousel
  );


/**
 * A slideshow with carousel controls.
 * 
 * [Carousel controls let the user directly access a specific page](/demos/carouselSlideshow.html)
 * 
 * For a variation that offers next/previous buttons and a pause/resume button,
 * see [SlideshowWithPlayControls](SlideshowWithPlayControls). For a more basic
 * variation with no controls, see [Slideshow](Slideshow).
 * 
 * @inherits Carousel
 * @mixes TimerSelectionMixin
 */
class CarouselSlideshow extends Base {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        stage: 'elix-crossfade-stage'
      })
    });
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      playing: true,
      selectionRequired: true,
      selectionTimerDuration: 3000,
      selectionWraps: true,
      transitionDuration: 1000
    });
  }

  get transitionDuration() {
    return this.state.transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this.setState({ transitionDuration });
  }

  get updates() {
    const transitionDuration = this.transitionDuration;
    return merge(super.updates, {
      $: {
        proxyList: {
          transitionDuration
        },
        stage: {
          transitionDuration
        }
      }
    });
  }

}


customElements.define('elix-carousel-slideshow', CarouselSlideshow);
export default CarouselSlideshow;
