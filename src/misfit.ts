export class Vector2{
    x = 0;
    y = 0;
    constructor(x: number = 0, y: number = 0){
        this.x = x; this.y = y;
    }
}

export function nullCheck<T>(arg: T | null, err: string){
    if(arg === null) throw err;
    return arg;
}

export class Entity{
    position: Vector2;
    constructor(){
        this.position = new Vector2();
    }
    update(dt: number){}
    draw(){}
}

export interface SpriteFrame{
    image: CanvasImageSource;
    width: number;
    height: number;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
}

export function newSpriteFrame(image: CanvasImageSource,
    width: number,
    height: number,
    sx: number = 0,
    sy: number = 0,
    sw: number | null = null,
    sh: number | null = null): SpriteFrame{
        if(sw === null) sw = width;
        if(sh === null) sh = height;
        return {image, width, height, sx, sy, sw, sh};
    }

export class Misfit{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    lastTimeStamp: number = 0;
    update: (dt: number) => void;
    keys: Map<string, boolean>;
    clearColor: string = 'black';

    constructor(root: HTMLElement | null, width: number, height: number, update: (dt:number)=>void){
        root = nullCheck(root, 'null root provided.');
        this.canvas = document.createElement('canvas');
        this.context = nullCheck(this.canvas.getContext('2d'), 'could not get context');
        this.canvas.setAttribute('width', `${width}`);
        this.canvas.setAttribute('height', `${height}`);
        root.appendChild(this.canvas);
        this.update = update;
        window.requestAnimationFrame(ts => this.loop(ts));
        this.keys = new Map();
        document.addEventListener('keydown', e => this.keys.set(e.key, true));
        document.addEventListener('keyup', e => this.keys.set(e.key, false));
        this.context.imageSmoothingEnabled = false;
    }

    loop(timeStamp: number){
        if(this.lastTimeStamp > 0){
            const dt = timeStamp - this.lastTimeStamp;
            this.update(dt / 1000);
        }
        this.lastTimeStamp = timeStamp;
        window.requestAnimationFrame(ts => this.loop(ts));
    }

    getKeyDown(key: string){
        return this.keys.get(key) ?? false;
    }

    static loadImage(path: string): Promise<CanvasImageSource>{
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => reject(err));
            img.src = path;
        });
    }

    drawSprite(frame: SpriteFrame, x: number, y: number,){
        const {image, width, height, sx, sy, sw, sh} = frame;
        this.context.drawImage(image, sx, sy, sw, sh, x, y, width, height);
    }

    clear(){
        this.context.fillStyle = this.clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}