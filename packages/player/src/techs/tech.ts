import { EventEmit } from "@lin-media/utils";
import Player from "../player";
import { PlayerConfig, SourceItem } from "../types/player";

class Tech extends EventEmit {
  static id = "Tech";
  static canHandleSource(source: SourceItem, options: PlayerConfig) {
    return "";
  }
  player: Player;
  videoElement: HTMLVideoElement;
  source: SourceItem;
  private isReady = false;
  private readyCallback: Array<Function> = [];
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem
  ) {
    super();
    this.player = player;
    this.videoElement = videoElement;
    this.source = source;
    this.player.ready(this.onPlayerReady.bind(this));
  }

  onPlayerReady() {
    // todo
  }

  ready(fn: Function) {
    if (this.isReady) {
      fn();
    } else {
      this.readyCallback.push(fn);
    }
  }

  private runReadyCallback() {
    const list = this.readyCallback.slice();
    if (list.length === 0) {
      return;
    }
    this.readyCallback = [];
    list.forEach((fn) => fn());
  }

  triggerReady() {
    if (this.isReady) {
      return;
    }
    this.isReady = true;
    this.$emit("ready");
    this.runReadyCallback();
  }

  destroy() {
    this.clear();
  }
}

export default Tech;
