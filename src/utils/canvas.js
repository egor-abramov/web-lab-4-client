let canvas = null;
let ctx = null;
const width = 500;
const height = 500;
const centerX = width / 2;
const centerY = height / 2;
export const scale = 220;

export function getCtx() {
    return ctx;
}

export function getCanvas() {
    return canvas;
}

export function initCanvas() {
    canvas = document.getElementById('graph');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    return true;
}

export function createGraph(r) {
    const rScale = scale * (r / 2.8);

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + rScale, centerY);
    ctx.lineTo(centerX, centerY - rScale)
    ctx.closePath();

    ctx.fillStyle = 'rgba(51, 153, 255)';
    ctx.strokeStyle = '#3399ff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + rScale);
    ctx.lineTo(centerX + rScale / 2, centerY + rScale);
    ctx.lineTo(centerX + rScale / 2, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, rScale / 2, -Math.PI * 1.5, -Math.PI, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 15, centerY - 5);
    ctx.lineTo(width, centerY);
    ctx.lineTo(width - 15, centerY + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - 5, 15);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 15);
    ctx.fill();

    ctx.font = "15px";

    ctx.strokeText("x", centerX + scale + 20, centerY + 15);
    ctx.strokeText("y", centerX - 15, centerY - scale - 20);

    ctx.strokeText("0", centerX + 10, centerY - 10);
    ctx.strokeText(r/2, centerX + rScale / 2, centerY - 5);
    ctx.strokeText(r, centerX + rScale, centerY - 5);

    ctx.strokeText(-r/2, centerX - rScale / 2, centerY - 5);
    ctx.strokeText(-r, centerX - rScale, centerY - 5);

    ctx.strokeText(r/2, centerX + 5, centerY - rScale / 2);
    ctx.strokeText(r, centerX + 5, centerY - rScale);

    ctx.strokeText(-r/2, centerX + 5, centerY + rScale / 2);
    ctx.strokeText(-r, centerX + 5, centerY + rScale);
}

export function drawPoint(point, r) {
    if (!ctx) return;
    const rScale = scale * (r / 2.8);

    const xPixel = centerX + (point.x / point.r) * rScale;
    const yPixel = centerY - (point.y / point.r) * rScale;

    ctx.beginPath();
    ctx.fillStyle = point.hit ? 'red' : 'black';
    ctx.arc(xPixel, yPixel, 3, 0, 2 * Math.PI);
    ctx.fill();
}
