import * as faceApi from 'face-api.js'

class face {
  constructor() {}

init( model = "tinyFaceDetector", opts, videoId = "faceVedio", canvasId = "faceCanvas") {
    this.model = model;
    this.opts = opts;
    
    // 节点属性化
    this.videoEl = document.getElementById(videoId);
    this.canvasEl = document.getElementById(canvasId);

    this.timeout = null;

    this.setModle()
  }

  async setModle() {
    await faceApi.nets[this.model].loadFromUri("/models"); // 算法模型
    await faceApi.loadFaceLandmarkModel("/models"); // 轮廓模型
    await faceApi.loadFaceExpressionModel("/models"); // 表情模型
    await faceApi.loadAgeGenderModel("/models"); // 年龄模型
    // 根据模型参数识别调整结果
    switch (this.model) {
      case "ssdMobilenetv1":
        this.options = new faceApi.SsdMobilenetv1Options({
          // 最小可信度
          minConfidence: 0.5, // 0.1 ~ 0.9
        });
        break;
      case "tinyFaceDetector":
        this.options = new faceApi.TinyFaceDetectorOptions({
          inputSize: 512, // 160 224 320 416 512 608
          scoreThreshold: 0.5, // 0.1 ~ 0.9
        });
        break;
      case "mtcnn":
        this.options = new faceApi.MtcnnOptions({
          minFaceSize: 20, // 0.1 ~ 0.9
          scoreThresholds: 0.5, // 0.1 ~ 0.9
          scaleFactor: 0.709, // 0.1 ~ 0.9
        });
        break;
      default:
        this.options = new faceApi.TinyFaceDetectorOptions({
          inputSize: 512, // 160 224 320 416 512 608
          scoreThreshold: 0.5, // 0.1 ~ 0.9
        });
    }
  }

  changeModel(model, opts) {
    this.model = model;
    this.opts = opts;
    clearTimeout(this.timeout);
    return this.setModle();
  }


  async draw(rate = 60) {
    // 识别绘制人脸信息
    const result = await faceApi[this.opts.detectFace](
      this.videoEl,
      this.options
    ).withFaceLandmarks()
      .withAgeAndGender();
    if (result && !this.videoEl.paused) {
      const dims = faceApi
        .matchDimensions(this.canvasEl, this.videoEl, true);
      const resizeResults = faceApi.resizeResults(result, dims);
      console.log(resizeResults);
      resizeResults.forEach((result) => {
        const { age, gender, genderProbability } = result;
        faceApi.draw.drawDetections(this.canvasEl, resizeResults);
        new faceApi.draw.DrawTextField(
          [
            `${Math.round(age, 0)} years`,
            `${gender} (${Math.round(genderProbability)})`,
          ],
          result.detection.box.bottomLeft
        ).draw(this.canvasEl);
      });
    } else {
      this.canvasEl
        .getContext("2d")
        .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
    this.timeout = setTimeout(() => this.draw(), rate);
  }

  stop() {
    clearTimeout(this.timeout);
  }
}

export default new face()