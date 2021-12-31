<template>
  <div class="video" tabindex="-1" @keydown.space.prevent="switchPaused">
    <video
      ref="video"
      class="video__player pointer"
      :src="src"
      :poster="poster"
      :controls="false"
      :muted="$store.state.volume === 0"
      :autoplay="focus"
      @click="switchPaused"
      @loadedmetadata="loadedmetadata"
      @timeupdate="timeupdate"
    />
    <div
      class="video__track pointer"
      :class="{ hide: currentTime > 2 && !fullscreen }"
      @mousemove="moveSign"
      @mousedown="dragProgress"
      @click="TimeChange"
    >
      <div class="video__duration">
        <div class="video__currentTime" :style="{ transform: `scaleX(${progressVal})` }" />
      </div>
      <div ref="sign" class="video__sign pointer">
        <div class="video__signTime">{{ timeStamp(signTime) }}</div>
      </div>
    </div>
    <div class="video__controller bg-primary" :class="{ hide: currentTime > 2 && !fullscreen }">
      <div v-if="paused" class="play video__controllerItem pointer" @click="switchPaused">
        <img class="video__controllerIcon" src="@/assets/videos/play_white.png" alt="play" />
      </div>
      <div v-else class="pause video__controllerItem pointer" @click="switchPaused">
        <img class="video__controllerIcon" src="@/assets/videos//pause_white.png" alt="pause" />
      </div>
      <div class="time video__controllerItem">{{ timeStamp(currentTime) }} / {{ timeStamp(duration) }}</div>
      <div class="volume video__controllerItem">
        <img
          v-if="$store.state.volume === 0"
          class="video__controllerIcon"
          src="@/assets/videos//mute_white.png"
          alt="mute"
          @click="volumeClick"
        />
        <img
          v-else
          class="video__controllerIcon"
          src="@/assets/videos//volume_white.png"
          alt="volume"
          @click="volumeClick"
        />
        <div ref="volumeTrack" class="volume__track pointer" @mousedown="dragVolume" @click="volumeChange">
          <div class="volume__totalVal">
            <div class="volume__currentVal" :style="{ transform: `scaleX(${$store.state.volume})` }" />
          </div>
          <div ref="volumeHandle" class="volume__handle pointer" />
        </div>
      </div>
      <div class="video__controllerItem right pointer" @click="handleFullscreen">
        <img class="video__controllerIcon" src="@/assets/videos//fullscreen_white.png" alt="fullscreen" />
      </div>
      <img
        v-if="paused"
        class="video__StatusIcon pointer"
        src="@/assets/videos//play_white.png"
        alt="statusIcon"
        @click="switchPaused"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paused: false,
      fullscreen: false,
      // time
      duration: 0,
      currentTime: 0,
      progressVal: 0,
      buffered: 0,
      signTime: 0,
      // volume
      volume: 1
    };
  },
  computed: {
    percent() {
      return this.duration / this.currentTime;
    }
  },
  watch: {
    focus(val) {
      if (val === true) {
        this.$refs.video.play();
        this.paused = false;
      } else {
        this.$refs.video.pause();
        this.paused = true;
      }
      // volume同步
      this.$refs.video.volume = this.$store.state.volume;
      const volumeTrackWidth = this.$refs.volumeTrack.getBoundingClientRect().width;
      const X = this.$store.state.volume * volumeTrackWidth;
      this.$refs.volumeHandle.style.left = `${X}px`;
    },
    '$store.state.volume'(val, oldVal) {
      this.$refs.video.volume = val;
      if (oldVal !== 0) {
        this.volume = oldVal;
      }
    },
    percent(val) {
      if (val === 1 && this.fullscreen === false) {
        this.$emit('autoPlay');
      }
    },
    fullscreen() {
      if (this.percent === 1) {
        this.$emit('autoPlay');
      }
    }
  },
  methods: {
    // 功能
    switchPaused() {
      if (this.paused) {
        this.$refs.video.play();
        this.paused = false;
      } else {
        this.$refs.video.pause();
        this.paused = true;
      }
    },
    handleFullscreen() {
      if (this.fullscreen) {
        // 取消全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.oRequestFullscreen) {
          document.oCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        document.body.classList.remove('fullscreen');
        this.fullscreen = false;
      } else {
        // 全屏
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
          document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
          document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
          document.body.webkitRequestFullscreen();
        }
        document.body.classList.add('fullscreen');
        this.fullscreen = true;
        // 监听全屏事件，esc退出全屏
        document.addEventListener(
          'fullscreenchange',
          () => {
            if (document.fullscreen === false) {
              document.body.classList.remove('fullscreen');
              this.fullscreen = false;
            }
          },
          false
        );
        document.addEventListener(
          'mozfullscreenchange',
          () => {
            if (document.mozFullScreen === false) {
              document.body.classList.remove('fullscreen');
              this.fullscreen = false;
            }
          },
          false
        );
        document.addEventListener(
          'webkitfullscreenchange',
          () => {
            if (document.webkitIsFullScreen === false) {
              document.body.classList.remove('fullscreen');
              this.fullscreen = false;
            }
          },
          false
        );
        document.addEventListener(
          'msfullscreenchange',
          () => {
            if (document.msFullscreenElement === false) {
              document.body.classList.remove('fullscreen');
              this.fullscreen = false;
            }
          },
          false
        );
      }
    },
    cancelFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      document.body.classList.remove('fullscreen');
      this.fullscreen = false;
    },
    // time
    moveSign(e) {
      const mouseX = e.clientX;
      const signWidth = this.$refs.sign.getBoundingClientRect().width;
      const videoWidth = this.$refs.video.getBoundingClientRect().width;
      const videoLeft = this.$refs.video.getBoundingClientRect().left;
      const X = mouseX - videoLeft - signWidth / 2;
      this.$refs.sign.style.left = `${X}px`;
      this.signTime = this.$refs.video.duration * (X / videoWidth);
    },
    dragProgress() {
      this.$refs.video.pause();
      this.paused = true;
      const progressMove = e => {
        const mouseX = e.clientX;
        const signWidth = this.$refs.sign.getBoundingClientRect().width;
        const videoWidth = this.$refs.video.getBoundingClientRect().width;
        const videoLeft = this.$refs.video.getBoundingClientRect().left;
        let X = mouseX - videoLeft - signWidth / 2;
        if (X <= 0) {
          X = 0;
        } else if (X >= videoWidth) {
          X = videoWidth;
        }
        this.progressVal = X / videoWidth;
        this.currentTime = this.$refs.video.duration * (X / videoWidth);
        this.$refs.video.currentTime = this.currentTime;
      };
      document.addEventListener('mousemove', progressMove);
      document.addEventListener('mouseup', e => {
        if (this.focus === true) {
          this.$refs.video.play();
          this.paused = false;
        }
        document.removeEventListener('mousemove', progressMove);
      });
    },
    TimeChange() {
      this.$refs.video.currentTime = this.signTime;
    },
    // volume
    dragVolume() {
      document.addEventListener('mousemove', this.volumeChange);
      document.addEventListener('mouseup', e => {
        document.removeEventListener('mousemove', this.volumeChange);
      });
    },
    volumeClick() {
      if (this.$store.state.volume !== 0) {
        this.$store.state.volume = 0;
        this.$refs.volumeHandle.style.left = '0px';
      } else {
        this.$store.state.volume = this.volume;
        const volumeTrackWidth = this.$refs.volumeTrack.getBoundingClientRect().width;
        const X = volumeTrackWidth * this.volume;
        this.$refs.volumeHandle.style.left = `${X}px`;
      }
    },
    volumeChange(e) {
      const mouseX = e.clientX;
      const handleWidth = this.$refs.volumeHandle.getBoundingClientRect().width;
      const volumeTrackWidth = this.$refs.volumeTrack.getBoundingClientRect().width;
      const volumeTrackLeft = this.$refs.volumeTrack.getBoundingClientRect().left;
      let X = mouseX - volumeTrackLeft - handleWidth / 2;
      if (X <= 0) {
        X = 0;
      } else if (X >= volumeTrackWidth) {
        X = volumeTrackWidth;
      }
      this.$store.state.volume = X / volumeTrackWidth;
      this.$refs.volumeHandle.style.left = `${X}px`;
    },
    // 状态
    loadedmetadata() {
      this.duration = this.$refs.video.duration;
    },
    timeupdate() {
      const duration = this.$refs.video && this.$refs.video.duration;
      const currentTime = this.$refs.video && this.$refs.video.currentTime;
      this.currentTime = currentTime;
      this.progressVal = duration ? currentTime / duration : 0;
      // const start = buffered.start(0)
      // const end = buffered.end(0)
      // this.buffered = end - start
    },
    // 工具
    timeStamp(t) {
      function f(num) {
        return num < 10 ? '0' + num : num;
      }
      const s = parseInt(t) % 60;
      let m = parseInt(t / 60);
      let time = `${f(m)}:${f(s)}`;

      if (m > 60) {
        m = parseInt(t / 60) % 60;
        const h = parseInt(parseInt(t / 60) / 60);
        time = `${f(h)}:${f(m)}:${f(s)}`;
      }
      return time;
    }
  }
};
</script>
<style lang="scss">
body.fullscreen {
  overflow: hidden;
  .video {
    position: fixed;
    z-index: 1000;
  }
  .video__controller {
    background: rgba(44, 47, 57, 0.5);
  }
}
</style>
<style lang="scss" scoped>
.video {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
}
.video__player {
  width: 100%;
  height: 100%;
}
.video:hover .video__controller.hide {
  bottom: 0;
}
.video:hover .video__track.hide {
  bottom: 30px;
}
.video__controller {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 30px;
  transition: all 0.5s;
  padding: 0 20px;
  padding-top: 10px;
}
.video__controller.hide {
  bottom: -40px;
}
.video__controllerItem {
  position: relative;
  line-height: 30px;
  float: left;
  user-select: none;
  &.right {
    float: right;
  }
}
.video__controllerIcon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.video__track {
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 30px;
  height: 16px;
  width: 100%;
  z-index: 1;
  transition: all 0.5s;
}
.video__track.hide {
  bottom: -6px;
}
.video__duration {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(238, 226, 192, 0.5);
}
.video__track:hover .video__duration {
  background: rgba(238, 226, 192, 0.6);
}
.video__currentTime {
  position: absolute;
  transform-origin: 0 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5d266;
  height: 4px;
}
.video__sign {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 16px;
  margin: 0 auto;
  z-index: 1;
}
.video__signTime {
  position: absolute;
  top: -20px;
  color: #fff9e2;
  font-size: 12px;
  width: 20px;
  margin-left: -10px;
  text-align: center;
}
.video__track:hover .video__sign {
  opacity: 1;
}
.video__sign::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-color: #fff9e2 transparent transparent;
  border-style: solid;
  border-width: 4px 4px 0;
  position: relative;
}
.video__sign::after {
  content: '';
  display: block;
  margin-top: 6px;
  width: 0;
  height: 0;
  border-color: transparent transparent #fff9e2;
  border-style: solid;
  border-width: 0 4px 4px;
  position: relative;
}
.time {
  font-size: 12px;
  margin: 0 10px;
  width: 80px;
}
.volume .icon {
  height: 14px;
}
.video__StatusIcon {
  position: absolute;
  right: 30px;
  bottom: 60px;
  opacity: 0.6;
}
.volume__track {
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 8px;
  left: 25px;
  height: 12px;
  width: 80px;
  z-index: 1;
  transition: all 0.5s;
}
.volume__totalVal {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(238, 226, 192, 0.5);
}
.volume__track:hover .volume__totalVal {
  background: rgba(238, 226, 192, 0.6);
}
.volume__currentVal {
  position: absolute;
  transform-origin: 0 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5d266;
  height: 4px;
}
.volume__handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 12px;
  margin: 0 auto;
  z-index: 1;
  background: #f5d266;
}
.fullscreen {
  .video__controller {
    height: 50px;
    line-height: 40px;
    padding-top: 14px;
  }
  .video__track {
    bottom: 40px;
  }
  .video__controllerIcon {
    width: 24px;
    height: 24px;
  }
  .time {
    font-size: 14px;
    width: 100px;
  }
  .volume__track {
    bottom: 6px;
    left: 35px;
    height: 16px;
  }
  .volume__handle {
    height: 16px;
  }
  .video__StatusIcon {
    right: 50px;
    bottom: 80px;
  }
}
</style>
