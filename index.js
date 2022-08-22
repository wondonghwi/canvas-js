const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const saveBtn = document.getElementById('save');
const textInput = document.querySelector('#text');
const fileInput = document.querySelector('#file');
const modeBtn = document.querySelector('#mode-btn');
const destroyBtn = document.querySelector('#destroy-btn');
const eraserBtn = document.querySelector('#eraser-btn');
const colorOption = Array.from(document.querySelectorAll('.color-option'));
const color = document.querySelector('#color');
const lineWidth = document.querySelector('#line-width');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = 'round';

let isPainting = false;
let isFilling = false;

const onMove = e => {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(e.offsetX, e.offsetY);
};

const startPainting = () => (isPainting = true);

const cancelPainting = () => {
  isPainting = false;
  ctx.beginPath();
};

const onLineWidthChange = e => (ctx.lineWidth = e.target.value);

const onColorChange = e => {
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
};

const onColorClick = e => {
  const colorValue = e.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
};

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = 'Fill';
  } else {
    isFilling = true;
    modeBtn.innerText = 'Draw';
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = 'white';
  isFilling = false;
  modeBtn.innerText = 'Fill';
}

const onFileChange = e => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
};

const onDoubleClick = event => {
  const text = textInput.value;
  if (text !== '') {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = '68px sans-serif';
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
};

const onSaveClick = () => {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myDrawing.png';
  a.click();
};

canvas.addEventListener('dblclick', onDoubleClick);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);
canvas.addEventListener('click', onCanvasClick);

lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);

colorOption.forEach(color => color.addEventListener('click', onColorClick));
modeBtn.addEventListener('click', onModeClick);
destroyBtn.addEventListener('click', onDestroyClick);
eraserBtn.addEventListener('click', onEraserClick);

fileInput.addEventListener('change', onFileChange);
saveBtn.addEventListener('click', onSaveClick);
