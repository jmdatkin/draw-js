import { DrawOptions } from "./types/DrawOptions";
import { Point2D } from "./types/Point2D";

class Draw {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;

    lines: Point2D[][] = [];

    private lineInProgress: Point2D[] = [];
    private drawingNewLine = true;

    isMouseDown = false;

    backgroundColor = "white";

    private distSq(x0: number, y0: number, x1: number, y1: number) {
        return Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2);
    }

    private screenToCanvas = (screenCoords: Point2D): Point2D => {
        const { x, y } = screenCoords;
        return {
            x: x - this.canvas!.offsetLeft,
            y: y - this.canvas!.offsetTop
        };
    }

    private mouseDownHandler = (event: MouseEvent) => {
        this.isMouseDown = true;
        this.lineInProgress = Array();
        this.lineInProgress.push(this.screenToCanvas({ x: event.pageX, y: event.pageY }));
    }

    private mouseMoveHandler = (event: MouseEvent) => {
        if (!this.isMouseDown) return;
        const lastPoint = this.lineInProgress[this.lineInProgress.length - 1];
        const thisPoint = this.screenToCanvas({ x: event.pageX, y: event.pageY });
        if (this.distSq(lastPoint.x, lastPoint.y, thisPoint.x, thisPoint.y) > 9) {
            window.requestAnimationFrame(() => {
                this.continuePaintFromLineInProgress(thisPoint);
            });
            this.lineInProgress.push(thisPoint);
        }
        this.paint();
    }

    //@ts-ignore
    private mouseUpHandler = (event: MouseEvent) => {
        if (this.isMouseDown) {
            this.drawingNewLine = true;
            this.lines.push(this.lineInProgress);
            this.lineInProgress = [];
        }
        this.isMouseDown = false;
    }

    private clear = () => {
        this.ctx?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }

    private drawBackground = () => {
        this.ctx!.fillStyle = this.backgroundColor;
        this.ctx?.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
        console.log("Drawing background");
        console.log(this.backgroundColor);
    }

    private drawLine = (line: Point2D[]) => {
        const startPoint = line[0];
        this.ctx?.beginPath();
        this.ctx?.moveTo(startPoint.x, startPoint.y);

        for (let i = 1; i < line.length; i++) {
            const thisPoint = line[i];
            this.ctx?.lineTo(thisPoint.x, thisPoint.y);
        }

        this.ctx!.strokeStyle = "green";
        // this.ctx!.lineWidth = 2;
        this.ctx!.lineWidth = 7;
        this.ctx!.stroke();
    }

    //@ts-ignore
    private drawLines = () => {
        this.lines.forEach(this.drawLine);
    }

    private continuePaintFromLineInProgress = (nextPoint: Point2D) => {
        const lastPoint = this.lineInProgress[this.lineInProgress.length - 1];
        if (this.drawingNewLine) {
            this.ctx?.beginPath();
            this.ctx?.moveTo(lastPoint.x, lastPoint.y);
            this.drawingNewLine = false;
        }
        this.ctx?.lineTo(nextPoint.x, nextPoint.y);
        this.ctx?.stroke();
    };

    //@ts-ignore
    private repaint = () => {
        this.clear();
        this.drawLines();
    }

    private paint = () => {

    }

    reset = () => {
        this.lines = [];
        this.lineInProgress = [];
        this.clear();
        this.drawBackground();
    };

    lineWidth = (lineWidth?: number) => {
        if (typeof lineWidth !== 'undefined')
            this.ctx!.lineWidth = lineWidth;
        else
            return this.ctx!.lineWidth;
    };

    strokeStyle = (value?: string) => {
        if (typeof value !== 'undefined')
            this.ctx!.strokeStyle = value;
        else
            return this.ctx!.strokeStyle;
    };

    constructor(canvas: HTMLCanvasElement, options: DrawOptions) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        if (options && options.hasOwnProperty('backgroundColor')) {
            this.backgroundColor = options.backgroundColor!;
        }

        this.ctx!.lineJoin = "round";
        this.ctx!.lineCap = "round";

        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        // this.canvas.addEventListener('mouseup', this.mouseUpHandler);
        document.body.addEventListener('mouseup', this.mouseUpHandler);

        this.drawBackground();
    }
}

const _Draw = function (canvas: HTMLCanvasElement, options: DrawOptions) {
    return new Draw(canvas, options);
}

export { _Draw as Draw };