import { Misfit, Entity, Vector2, SpriteFrame, newSpriteFrame } from "./misfit";


class Player extends Entity{
    velocity: Vector2;
    speed = 300;
    spriteFrame: SpriteFrame;
    constructor(spriteFrame: SpriteFrame){
        super();
        this.velocity = new Vector2();
        this.spriteFrame = spriteFrame;
    }
    update(dt: number): void {
        this.velocity.x = 0;
        if(game.getKeyDown('a')) this.velocity.x -= dt * this.speed;
        if(game.getKeyDown('d')) this.velocity.x += dt * this.speed;
        
        this.position.x += this.velocity.x;
    }
    draw(): void {
        game.drawSprite(this.spriteFrame, this.position.x, this.position.y);
    }
}

function loop(dt: number){
    for (const ent of entities) {
        ent.update(dt);
    }
    game.clear();
    for (const ent of entities) {
        ent.draw();
    }
}

const game = new Misfit(document.getElementById('root'), 600, 600, loop);
const entities: Entity[] = [];

async function main(){
    const playerSheet = await Misfit.loadImage('./images/player.png');
    const playerSf = newSpriteFrame(playerSheet, 32, 32, 0, 0, 16, 16);
    const player = new Player(playerSf);
    player.position.x = 300;
    player.position.y = 300;
    entities.push(player);
}

window.onload = main;