import { LitElement, html } from '../node_modules/@polymer/lit-element/lit-element.js';
import '../common/file-picker.js';

export class CarrotApp extends LitElement {
  constructor() {
    super();
    this.carrotSize = 10;
  }

  render() {
    return html`
    <style>
      :host {
        display: block;
      }
      #pickerSection {
        padding: 20px 16px;
        margin: 0 auto;
        max-width: 500px;
      }
      #filePicker {
        border-color: rgba(0,0,0, 0.9);
        height: 150px;
      }
      .subPanel {
        text-align: center;
        padding: 20px 0;
      }
      .hidden {
        display: none;
      }
      canvas {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        opacity: 0;
      }
      #carrotCanvas {
        position: relative;
        margin: 40px auto;
        box-shadow: 0 3px 10px -3px rgba(0, 0, 0, 0.6);
      }
      button {
        cursor: pointer;
        outline: none;
        background: cadetblue;
        color: white;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        text-transform: uppercase;
        padding: 8px;
        letter-spacing: 0.05em;
        border: none;
        box-shadow: 0 1px 6px -1px rgba(0,0,0,0.6);
      }
      .carrot-item {
        position: absolute;
        display: block;
      }
    </style>
    <section id="canvasSection" class="hidden">
      <div id="carrotCanvas"></div>
      <canvas id="canvas"></canvas>
      <div>
        <button @click="${this.clearImage}">Try Another Image</button>
      </div>
    </section>
    <section id="pickerSection" class="hidden">
      <file-picker id="filePicker" @files="${(e) => this.onFiles(e)}"></file-picker>
      <div class="subPanel">
        <div class="message">
          Select an image to render using carrots
        </div>
      </div>
    </section>
    `;
  }

  firstUpdated() {
    this.renderImage('./monalisa.jpg');
  }

  $(id) {
    return this.shadowRoot.querySelector(`#${id}`);
  }

  onFiles(e) {
    const file = e.detail.file;
    if (file.type.indexOf('image/') === 0) {
      this.loadImage(file);
    }
  }

  loadImage(file) {
    if (this.prevImageUrl) {
      URL.revokeObjectURL(this.prevImageUrl);
    }
    this.prevImageUrl = URL.createObjectURL(file);
    this.renderImage(this.prevImageUrl);
  }

  renderImage(imageUrl) {
    const image = new Image();
    image.onload = () => {
      this.$('pickerSection').classList.add('hidden');
      this.$('canvasSection').classList.remove('hidden');

      if (image.width && image.height) {
        const canvas = this.$('canvas');
        const ctx = canvas.getContext('2d');
        const width = Math.min(500, image.width, window.innerWidth - 32);
        const height = width * image.height / image.width;
        canvas.width = width / this.carrotSize;
        canvas.height = height / this.carrotSize;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const cc = this.$('carrotCanvas');
        cc.style.width = `${width}px`;
        cc.style.height = `${height}px`;
        while (cc.firstChild) {
          cc.removeChild(cc.firstChild);
        }

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let row = 0; row < canvas.height; row++) {
          for (let col = 0; col < canvas.width; col++) {
            const x = (row * canvas.width * 4) + (col * 4);
            const brightness = 0.34 * data[x] + 0.5 * data[x + 1] + 0.16 * data[x + 2];
            const item = document.createElement('img');
            item.src = './carrot.png';
            item.classList.add('carrot-item');
            item.style.top = `${row * this.carrotSize}px`;
            item.style.left = `${col * this.carrotSize}px`;
            item.style.width = `${this.carrotSize}px`;
            item.style.height = `${this.carrotSize}px`;
            item.style.opacity = (1 - brightness / 255);
            cc.appendChild(item);
          }
        }
      }
    };
    image.src = imageUrl;
  }

  clearImage() {
    this.$('pickerSection').classList.remove('hidden');
    this.$('canvasSection').classList.add('hidden');
    this.$('filePicker').clear();
  }

}
customElements.define('carrot-app', CarrotApp);