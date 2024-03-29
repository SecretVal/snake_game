// COPIED FROM: https://github.com/tsoding/zzzwe/blob/master/index.js
class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(that) {
        return new V2(this.x + that.x, this.y + that.y);
    }

    sub(that) {
        return new V2(this.x - that.x, this.y - that.y);
    }

    scale(s) {
        return new V2(this.x * s, this.y * s);
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const n = this.len();
        return n === 0 ? new V2(0, 0) : new V2(this.x / n, this.y / n);
    }

    dist(that) {
        return this.sub(that).len();
    }

    static polar(mag, dir) {
        return new V2(Math.cos(dir) * mag, Math.sin(dir) * mag);
    }
}
function fillRect(context,pos,size,color = PLAYER_COLOR) {
    context.beginPath();
    context.rect(pos.x, pos.y,size,size)
    context.fillStyle = color;
    context.fill();
}

function random(max) {
    return Math.floor(Math.random() * max)
}

const PLAYER_POS = new V2(10,10);
const PLAYER_COLOR = "red";
const PLAYER_SIZE = 50;
const SPEED = 500;


const APPLE_SIZE = PLAYER_SIZE;
const APPLE_COLOR = "green";

const directionMap = Object.freeze({
    // up
    "KeyW": new V2(0, -SPEED),
    // down
    "KeyS": new V2(0, SPEED),
    // left
    "KeyA": new V2(-SPEED, 0),
    // right
    "KeyD": new V2(SPEED, 0),
})

class Player {
    constructor(pos, color=PLAYER_COLOR, size=PLAYER_SIZE) {
        this.pos = pos;
        this.color = color;
        this.size = size,
        this.vel = new V2(0,0);
        this.activeDirection = new Set();
        this.pressedKey = "";
    }
    update(dt) {
        if (this.pressedKey in directionMap) {
            this.vel = directionMap[this.pressedKey];
        }
        this.pos = this.pos.add(this.vel.scale(dt))

        if (this.pos.x > window.innerWidth) {
            this.pos.x = 0;
        }

        if (this.pos.x < 0) {
            this.pos.x = window.innerWidth;
        }

        if (this.pos.y > window.innerHeight) {
            this.pos.y = 0;
        }

        if (this.pos.y < 0) {
            this.pos.y = window.innerHeight;
        }
    }

    render(context) {
        fillRect(context,this.pos, this.size);
    }

    keyDown(e) {
        this.pressedKey = e.code;
    }
}

class Apple {
    constructor(pos, size=APPLE_SIZE, color=APPLE_COLOR){
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.eaten = false;
    }

    render(context) {
        fillRect(context, this.pos, this.size, this.color)
    }
}

class Game {
    constructor() {
        this.player = new Player(PLAYER_POS)
        this.apples = [];
    }

    update(dt) {
        this.player.update(dt);

        // TODO: check if apples gets eaten by player
    }

    render(context) {
        const height = window.innerHeight;
        const width = window.innerWidth;

        game_canvas.height = height;
        game_canvas.width = width;
        context.clearRect(0,0,height, width)

        this.player.render(context);

        for (let i in this.apples) {
            console.log(this.apples[i].eaten)
            this.apples[i].render(context);
        }
    }

    keyDown(e) {
        if (e.code in directionMap) {
            this.player.keyDown(e)
        } else if(e.code == "KeyB") {
            this.apples.push(new Apple(new V2(random(window.innerWidth),random(window.innerHeight))))
        }
    }
}

const game_canvas = document.getElementById("game");
const context = game_canvas.getContext("2d");
let game = new Game();

let start;
function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const dt = (timestamp - start) * 0.001;
    start = timestamp;

    game.update(dt);
    game.render(context);

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

document.addEventListener('keydown', event => {
    game.keyDown(event);
});
