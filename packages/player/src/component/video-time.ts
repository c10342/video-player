import { EventManager, isUndef, secondToTime } from "@media/utils";
import { ComponentOptions } from "../types";

class VideoTime {
  private options: ComponentOptions | null;
  private eventManager: EventManager | null;
  private currentTime = 0;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initVideoListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initVideoListener() {
    const videoElement = this.options?.templateInstance.videoElement;

    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "loadedmetadata",
      handler: this.onVideoLoadedmetadata.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "timeupdate",
      handler: this.onVideoTimeupdate.bind(this)
    });
  }

  private onVideoLoadedmetadata() {
    const videoElement = this.options?.templateInstance.videoElement;
    const duration = videoElement?.duration || 0;
    this.setTotalTime(duration);
  }

  private onVideoTimeupdate() {
    const videoElement = this.options?.templateInstance.videoElement;
    const currentTime = videoElement?.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);

    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;

    this.setCurrentTime(currentTime);
  }

  private setTotalTime(duration: number) {
    const totalTimeElement = this.options?.templateInstance.totalTimeElement;
    if (!isUndef(totalTimeElement)) {
      totalTimeElement.innerHTML = secondToTime(duration);
    }
  }

  private setCurrentTime(currentTime: number) {
    const currentTimeElement =
      this.options?.templateInstance.currentTimeElement;
    if (!isUndef(currentTimeElement)) {
      currentTimeElement.innerHTML = secondToTime(currentTime);
    }
  }

  private resetData() {
    this.currentTime = 0;
    this.eventManager = null;
    this.options = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoTime;
