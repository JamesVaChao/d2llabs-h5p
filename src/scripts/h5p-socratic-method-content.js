// Import required classes
import SocraticMethodTitleBar from '@components/h5p-socratic-method-titleBar.js';
import Dictionary from '@services/dictionary.js';
import Util from '@services/util.js';
import snippets from '@services/snippets.js';
import apiLayer from '@services/apiLayer.js';

/** @constant {number} RESIZE_FULLSCREEN_DELAY_MS Delay to give browser time to enter/exit fullscreen. */
const RESIZE_FULLSCREEN_DELAY_MS = 100;

/** @constant {number} TOAST_OFFSET_VERTICAL_PX Vertical offset from element to toast message. */
const TOAST_OFFSET_VERTICAL_PX = 5;

/**
 * Class representing the content.
 */
export default class SocraticMethodContent {
  /**
   * @class
   * @param {object} params Parameters.
   * @param {object} params.params Parameters from editor.
   * @param {number} params.contentId Content ID.
   * @param {object} [params.extras] Extras incl. previous state.
   * @param {boolean} [params.isRoot] If true, running standalone.
   * @param {object} [callbacks] Callbacks.
   */
  constructor(params = {}, callbacks = {}) {
    this.params = Util.extend({
      extras: {}
    }, params);

    const { courseContent, initialMsg, l10n } = params

    this.courseContent = courseContent;


    // Create values to fill with
    this.previousState = Util.extend(
      {
        dateString: new Date().toLocaleDateString(),
        recall: { inputField: '' },
        mainNotes: { inputField: '' },
        summary: { inputField: '' }
      },
      this.params.extras.previousState || {}
    );

    // Callbacks
    this.callbacks = Util.extend({
      getCurrentState: () => { },
      onButtonFullscreen: () => { },
      read: () => { },
      resize: () => { }
    }, callbacks);

    // TODO: Figure out saving integration
    // TODO: Request H5P core to set a flag that can be queried instead
    // const canStoreUserState = H5PIntegration.saveFreq !== undefined &&
    //   H5PIntegration.saveFreq !== false;

    this.content = document.createElement('div');
    this.content.classList.add('h5p-socratic-method-container');

    this.titleBar = this.createTitleBar();
    this.content.appendChild(this.titleBar.getDOM());

    const canStoreUserState = false;
    // TODO: Figure out saving integration
    if (!canStoreUserState) {
      this.messageBox = document.createElement('div');
      this.messageBox.classList.add('h5p-socratic-method-message-box');
      const message = document.createElement('p');
      message.classList.add('h5p-socratic-method-message');
      message.innerHTML = Dictionary.get('l10n.noSaveContentState');
      this.messageBox.appendChild(message);
      this.content.appendChild(this.messageBox);
    }

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('h5p-socratic-method-buttons-wrapper');

    // TODO: Figure out saving integration
    // Save state to platform button
    if (canStoreUserState) {
      this.buttonSave = H5P.JoubelUI.createButton({
        type: 'button',
        html: Dictionary.get('l10n.save'),
        ariaLabel: Dictionary.get('l10n.save'),
        class: 'h5p-socratic-method-button-save h5p-socratic-method-disabled',
        disabled: true,
        on: {
          click: () => {
            this.handleSave();
          }
        }
      }).get(0);
      buttonsWrapper.appendChild(this.buttonSave);
    }

    this.content.appendChild(snippets.mainDom({ initialMsg, courseContent }));

    this.messageList = [];

    setTimeout(() => {
      const messageInput = document.getElementById('socratic-method-message-input');
      messageInput.onchange = (e) => { this.currMessage = e.target.value }

      const backdrop = document.getElementById('backdrop');

      const messageButton = document.getElementById('messageButton');
      messageButton.onclick = async (e) => {
        try {
          backdrop.style.display = 'block';
          console.log(this.currMessage)
          const params = {
            currMessage: this.currMessage,
            courseContent: this.courseContent
          };

          const url = apiLayer.createRestApiUrl(`/genericApi`);

          const response = await apiLayer.restAxiosInstance.post(
            url,
            params,
            {
              headers: {
                ...apiLayer.generalHeaders.headers,
                // Authorization: `Bearer ${jwtToken}` 
              }
            },
          );

          console.log(response);

          if (response.data.messageList) {
            this.messageList = response.data.messageList
            this.refreshMessageList();
          }
        } catch (e) {
          console.error(e);
        } finally {
          backdrop.style.display = 'none';
        }
      }


    }, 10);

    const getMessageList = async () => {
      console.log('Trying to get message list')
      const params = {};
      const url = apiLayer.createRestApiUrl(`/genericApi`);

      const response = await apiLayer.restAxiosInstance.post(
        url,
        params,
        {
          headers: {
            ...apiLayer.generalHeaders.headers,
            // Authorization: `Bearer ${jwtToken}` 
          }
        },
      );
      console.log('getMessageList response:', response)

      if (response.data.messageList) {
        this.messageList = response.data.messageList
        this.refreshMessageList();
      }
    }
    getMessageList();

    this.content.appendChild(buttonsWrapper);
  }

  refreshMessageList() {
    const messageListDOM = document.getElementById('messageList');

    // Clear previous message history
    messageListDOM.innerHTML = '';

    this.messageList.forEach(messageObj => {
      const messageDOM = document.createElement('div');
      messageDOM.innerHTML = `Role: ${messageObj.role} <br/> Content: ${messageObj.content}`;

      messageListDOM.appendChild(messageDOM);
    });
  }

  /**
   * Return the DOM for this class.
   * @returns {HTMLElement} DOM for this class.
   */
  getDOM() {
    return this.content;
  }

  /**
   * Create titleBar.
   * @returns {SocraticMethodTitleBar} TitleBar.
   */
  createTitleBar() {
    return new SocraticMethodTitleBar(
      {
        title: this.params.headline || this.params.extras.metadata?.title || '',
        dateString: this.previousState.dateString
      },
      {
        onButtonFullscreen: () => {
          this.callbacks.onButtonFullscreen();
        }
      }
    );
  }

  /**
   * Resize content.
   * @param {boolean} [fromVideo] If true, will skip resize on exercise.
   */
  resize(fromVideo = false) {
    if (this.exercise && !fromVideo) {
      /*
       * In H5P.Video for YouTube, once wrapper width gets 0 it's locked. We
       * need to set exercise wrapper width = 0 however for shrinking. Fixed
       * here.
       */
      if (this.youtubeWrapper) {
        this.youtubeWrapper.style.width = '100%';
      }

      setTimeout(() => {
        this.exercise.resize();
      }, 0);
    }

    if (typeof this.callbacks.resize === 'function') {
      this.callbacks.resize();
    }
  }

  /**
   * Enable fullscreen button in titleBar.
   */
  enableFullscreenButton() {
    this.titleBar.enableFullscreenButton();
  }

  /**
   * Set dimensions to fullscreen.
   * @param {boolean} enterFullScreen If true, enter fullscreen, else exit.
   */
  toggleFullscreen(enterFullScreen = false) {
    this.titleBar.toggleFullscreenButton(enterFullScreen);

    if (enterFullScreen === true) {
      /*
       * Give browser some time to go to fullscreen mode and return proper
       * viewport height
       */
      setTimeout(() => {
        // const messageHeight = this.messageBox ?
        //   this.messageBox.offsetHeight :
        //   0;

        // const maxHeight = `${window.innerHeight -
        //   this.titleBar.getDOM().offsetHeight - messageHeight}px`;

        // this.notesWrapper.style.maxHeight = maxHeight;
      }, RESIZE_FULLSCREEN_DELAY_MS);
    }
    else {
      // this.exerciseWrapper.style.maxHeight = '';
      // this.notesWrapper.style.maxHeight = '';

      setTimeout(() => {
        this.resize();
      }, 0);
    }
  }

  /**
   * Strip tags from text in H5P TextInputField object. Don't want those here.
   * @param {object} fieldState Save state object to be cleaned.
   * @returns {object} Save state object with cleaned text.
   */
  stripTags(fieldState) {
    fieldState.inputField = Util.htmlDecode(fieldState.inputField);
    return fieldState;
  }

  /**
   * Detect if some answer was given.
   * @returns {boolean} True if some notes was typed.
   */
  getAnswerGiven() {
    return true;
  }


  /**
   * Get current state to be saved.
   * @returns {object} Current state.
   */
  getCurrentState() {
    return {
      // dateString: this.getAnswerGiven() ? this.previousState.dateString : undefined,
      // recall: this.stripTags(this.recall.getCurrentState()),
      // mainNotes: this.stripTags(this.mainNotes.getCurrentState()),
      // summary: this.stripTags(this.summary.getCurrentState()),
      // exercise: this.exercise.getCurrentState()
    };
  }

  /**
   * Save current state. Could be triggered indirectly by emitting an xAPI
   * 'progressed' statement, but this would include a 3 second delay.
   */
  handleSave() {
    /*
     * If SocraticMethod instance is not running on its own, storing the state
     * directly requires to get the root content's currentState, because
     * we're writing the state for the whole content directly.
     */

    if (!this.getCurrentStateProvider) {
      if (this.params.isRoot) {
        this.getCurrentStateProvider = this.callbacks;
      }
      else if (typeof H5P.instances[0].getCurrentState === 'function') {
        this.getCurrentStateProvider = H5P.instances
          .find((instance) => instance.contentId === this.params.contentId);
      }
    }

    if (this.getCurrentStateProvider) {
      // Using callback to also store in LocalStorage
      H5P.setUserData(
        this.params.contentId,
        'state',
        this.getCurrentStateProvider.getCurrentState(),
        { deleteOnChange: false }
      );
    }
    else {
      // Fallback, parent doesn't store state, at least store in local storage
      this.callbacks.getCurrentState();
    }

    if (this.buttonSave) {
      H5P.attachToastTo(
        this.buttonSave,
        Dictionary.get('l10n.notesSaved'), {
        position: {
          horizontal: 'centered',
          noOverflowRight: true,
          offsetVertical: TOAST_OFFSET_VERTICAL_PX,
          vertical: 'above'
        }
      }
      );

      this.buttonSave.classList.add('h5p-socratic-method-disabled');
      this.buttonSave.setAttribute('disabled', 'disabled');
    }

    this.callbacks.read(Dictionary.get('l10n.notesSaved'));
  }
}
