import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef
} from "@media/utils";
import { ComponentOptions } from "../types";
import { WEBFULLSCREENCLASSNAME } from "../config/constant";
import { CustomEvents } from "../js/event";
import { KeyCodeEnum } from "../config/enum";

class VideoFullscreen {
  private options: ComponentOptions;
  private isWebFullscreen = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initButtonListener();
    this.initGlobalListener();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initButtonListener() {
    const { fullscreenWebElement, fullscreenBrowserElement } =
      this.options.templateInstance;
    this.eventManager.addEventListener({
      element: fullscreenWebElement,
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    this.eventManager.addEventListener({
      element: fullscreenBrowserElement,
      eventName: "click",
      handler: this.onBrowserFullscreen.bind(this)
    });
  }

  private initListener() {
    this.options.instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
  }

  private initGlobalListener() {
    this.eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onKeypress.bind(this)
    });
  }

  private onWebFullscreen() {
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
    }
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    } else {
      this.enterWebFullscreen();
    }
  }

  private onBrowserFullscreen() {
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
    const containerElement = this.options.templateInstance.containerElement;
    if (!isUndef(containerElement)) {
      if (!isBrowserFullscreen()) {
        enterBrowserFullScreen(containerElement);
      } else {
        exitBrowserFullscreen();
      }
    }
  }

  private exitWebFullscreen() {
    this.isWebFullscreen = false;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
    }
  }

  private enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      !containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    if (event.keyCode === KeyCodeEnum.esc && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoFullscreen;
