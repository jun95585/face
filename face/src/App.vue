<template>
  <div id="app">
    <Camera
      :cameraCanvasKey="cameraCanvasKey"
      :cameraVideoKey="cameraVideoKey"
      @loadedmetadata="run"
      @openSuccess="cameraOpened"
      @close="cameraClosed"
    />
  </div>
</template>

<script>
import Camera from './components/Camera'
import Face from './components/Face'

export default {
  name: 'App',
  components: {
    Camera,
  },
  data() {
    return {
      nets: "tinyFaceDetector", // 模型
      options: null, // 模型参数
      detectFace: "detectAllFaces", // 单or多人脸,
      cameraCanvasKey: 'faceCanvas',
      cameraVideoKey: 'faceVedio'
    }
  },
  methods: {
    init() {
      Face.init(this.nets, {
        detectFace: this.detectFace
      })
    },

    cameraOpened() {
    },

    run() {
      Face.draw()
    },
    cameraClosed() {

    }

  },
  mounted() {
    this.init()

  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
