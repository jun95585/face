<template>
  <div class="camera-wrap">
    <div class="camera-video-wrap"
      :styles="`width:${width};`"
    >
      <video 
        :id="cameraVideoKey"
        :width="width"
        :height="height"
        class="camera-video"
        @loadedmetadata="$emit('loadedmetadata')"
      />
      <canvas
        class="camera-canvas"
        :id="cameraCanvasKey"
        :width="width"
        :height="height"
      />
    </div>
    <div>
      <el-button @click="open" type="primary">启动摄像头</el-button>
      <el-button @click="close" type="primary">关闭摄像头</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Camera',
  props: {
    width: {
      type: Number,
      default: 640
    }, 
    height: {
      type: Number,
      default: 360
    },
    cameraVideoKey: {
      type: String,
      default: 'cameraVideo'
    },
    cameraCanvasKey: {
      type: String,
      default: 'cameraCanvas'
    },
    rate: {
      type: Number,
      default: 60
    },
  },
  data() {
    return {
      video: null,
      canvas: null,

      useable: true
    }
  },
  computed: {
  },
  methods: {
    open() {
      navigator.mediaDevices.getUserMedia({
        video: {
          width: this.width,
          height: this.height,
        }
      }).then(this.success).catch(e => {
        console.log(e)
        this.useable = false
      })
    },

    success(stream) {
      window.stream = stream; // 使流对浏览器控制台可用
      if (this.video.mozSrcObject !== undefined) {  
        //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持  
        this.video.mozSrcObject = stream;  
      } else {  
        this.video.srcObject = new MediaStream(stream)
        this.video.play();
      }  

      this.$emit('openSuccess')
      // this.drawVideoAtCanvas(this.video, this.canvas.getContext('2d'))
    },
    // 将视频帧绘制到Canvas对象上,Canvas每60ms切换帧，形成肉眼视频效果  
    drawVideoAtCanvas(video,context) {  
      window.setInterval(() => {  
        context.drawImage(video, 0, 0, this.width, this.height);  
      }, this.rate);
    },
    error(error) {
      console.log(error);
      this.$emit('openError')
      alert("视频媒体流获取错误" + error);
    },
    close() {
      this.canvas
        .getContext("2d")
        .clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.video.pause();
      if (typeof window.stream === "object") {
        window.stream.getTracks().forEach((track) => track.stop());
        window.stream = "";
        this.video.srcObject = null;
      }

      this.$emit('close')
    },
  },
  mounted() {
    this.video = document.querySelector(`#${this.cameraVideoKey}`)
    this.canvas = document.querySelector(`#${this.cameraCanvasKey}`)

    // this.init()
  },
}
</script>
<style lang="less" scoped>
.camera-wrap {
  display: flex;
  flex-direction: column;
  .camera-video-wrap {
    position: relative;
    margin: auto;
  }
  // .camera-video {
  //   position: absolute;
  //   top: -1000px;
  // }
  .camera-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>

