// Import required classes
import SocraticMethodButton from './h5p-socratic-method-button.js';
import Dictionary from '@services/dictionary.js';
import Util from '@services/util.js';
import './h5p-socratic-method-titleBar.scss';

/** Class representing the titleBar */
export default class SocraticMethodTitleBar {
  /**
   * @class
   * @param {object} params Parameter from editor.
   * @param {string} params.title Title.
   * @param {string} params.dateString Date.
   * @param {object} callbacks Callbacks.
   * @param {function} callbacks.onButtonFullscreen Handles fullscreen.
   */
  constructor(params = {}, callbacks = {}) {
    // Set missing params
    this.params = Util.extend({
      title: '',
      dateString: new Date().toLocaleDateString()
    }, params);

    // Set missing callbacks
    this.callbacks = Util.extend({
      onButtonFullscreen: () => {
        console.warn('A function for handling the fullscreen button is missing.');
      }
    }, callbacks);

    this.titleBar = document.createElement('div');
    this.titleBar.classList.add('h5p-socratic-method-title-bar');

    // Title
    const titleDOM = document.createElement('div');
    titleDOM.classList.add('h5p-socratic-method-title');
    titleDOM.innerHTML = this.params.title;

    // Date
    const dateDOM = document.createElement('div');
    dateDOM.classList.add('h5p-socratic-method-date');
    dateDOM.innerHTML = this.params.dateString;

    this.buttonFullscreen = new SocraticMethodButton(
      {
        type: 'toggle',
        classes: [ 'h5p-socratic-method-button', 'h5p-socratic-method-button-fullscreen' ],
        disabled: true,
        a11y: {
          active: Dictionary.get('a11y.buttonFullscreenExit'),
          inactive: Dictionary.get('a11y.buttonFullscreenEnter')
        }
      },
      {
        onClick: (() => {
          this.callbacks.onButtonFullscreen();
        })
      }
    );

    this.titleBar.appendChild(titleDOM);
    this.titleBar.appendChild(dateDOM);
    this.titleBar.appendChild(this.buttonFullscreen.getDOM());
  }

  /**
   * Return the DOM for this class.
   * @returns {HTMLElement} DOM for this class.
   */
  getDOM() {
    return this.titleBar;
  }

  /**
   * Get toggle button state.
   * @returns {boolean} True, if button is active, else false.
   */
  getToggleButtonState() {
    return this.buttonToggle.isActive();
  }

  /**
   * Enable fullscreen button.
   */
  enableFullscreenButton() {
    this.buttonFullscreen.enable();
  }

  /**
   * Set fullscreen button state.
   * @param {string|boolean} state enter|false for enter, exit|true for exit.
   */
  toggleFullscreenButton(state) {
    if (typeof state === 'string') {
      if (state === 'enter') {
        state = false;
      }
      else if (state === 'exit') {
        state = true;
      }
    }

    if (typeof state === 'boolean') {
      this.buttonFullscreen.toggle(state);
    }
  }
}
