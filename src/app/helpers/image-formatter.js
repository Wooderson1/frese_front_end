
function getDelta(w,h,bw,bh) {
  let x;
  if(w/bw > h/bh) {
    x = bw/w;
  }
  else {
    x = bh/h;
  }

  w = x * w;
  h = x * h;

  return {w:w, h:h, x: bw/2 - w/2, y: bh/2 - h/2 };
}

module.exports.initData = function(canvasId = 'image-canvas', imageData, orientation='top-left') {
  this.canvasId = canvasId;
  this.orientation = orientation;
  return new Promise((resolve, reject) => {($(canvasId).ready(() => {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    resolve(addToCanvas(this.canvasId, imageData, this.orientation));
  }))})
}

function addToCanvas(canvasId = 'image-canvas', imageData, orientation='top-left') {
  if(!imageData) {
    console.log("NO DATA");
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    return;
  }
  return new Promise((resolve) => {
    let imageObj = new Image();
    imageObj.onload = () => {
      const h = imageObj.height;
      const w = imageObj.width;
      let rot = 0;

      let bx = 0;
      let by = 0;
      let bw = billboard.width;
      let bh = billboard.height;

      let delta = this.getDelta(w, h, bw, bh);
      let temp;

      switch (orientation) {
        case 'right-top':
          temp = bw;
          bw = bh;
          bh = temp;
          by = -bh;
          delta = this.getDelta(w, h, bw, bh);
          rot = 90;
          delta.x = delta.x;
          delta.y = -bh + delta.y;
          break;
        case 'bottom-right':
          bx = -bw;
          by = -bh;
          delta = this.getDelta(w, h, bw, bh);
          rot = 180;
          delta.x = -bw + delta.x;
          delta.y = -bh + delta.y;
          break;
        case 'left-bottom':
          temp = bw;
          bw = bh;
          bh = temp;
          bx = -bw;
          delta = this.getDelta(w, h, bw, bh);
          rot = -90;
          delta.x = -bw + delta.x;
          delta.y = delta.y;
          break;
        default:
      }

      this.canvas.width = 150;
      this.canvas.height = 150;
      this.context.fillStyle = 'black';
      this.context.rotate(rot * Math.PI / 180);
      this.context.fillRect(bx, by, bw, bh);
      this.context.drawImage(imageObj, delta.x, delta.y, delta.w, delta.h);
      console.log("DRAWING IMAGE");
      this.imageUrl = this.canvas.toDataURL('image/jpeg', 1);
    };
    imageObj.src = imageData;
    resolve(this.imageUrl);
  });
}
