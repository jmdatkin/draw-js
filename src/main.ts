import './style.css'
import { Draw } from './draw.ts'

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
canvas.width = 1600;
canvas.height = 900;
const draw = Draw(canvas, {
  backgroundColor: "white",
});
// draw.ctx!.lineWidth = 7;
draw.lineWidth(12);
draw.strokeStyle('red');
console.log(draw.lineWidth());

document.querySelector('button#clearButton')?.addEventListener('click', () => draw.reset());