var vars = {
    size: 50,
    game: {
        width: () => {
            if(window.innerWidth % this.size === 0){
                console.log("w ok");
                return window.innerWidth;
            } else {
                console.log("w changed");
                return Math.floor(window.innerWidth / 50 ) * 50;
            }
        },
        height: () => {
            if(window.innerHeight % this.size === 0){
                console.log("h ok");
                return window.innerHeight;
            } else {
                console.log("h changed");
                return Math.floor(window.innerHeight / 50) * 50;
            }
        }
    },
    grid: {
        fix: (ch) => {
            if((ch) % this.size !== 0){
                return Math.floor(ch / 50) * 50;
            } else {
                return ch;
            }
        }
    }
};

var street;
var river;
var player;
var car = [];

function startGame() {
    street = new Street(Math.floor((window.innerWidth) / 50) * 50 , vars.grid.fix(window.innerHeight / 2), "grey", 0, vars.grid.fix(window.innerHeight / 2));
    river = new River(Math.floor((window.innerWidth) / 50) * 50 , vars.grid.fix(window.innerHeight / 2), "cyan", 0, vars.size);
    player = new Player(vars.size, vars.size, "limegreen", vars.grid.fix(vars.game.width() / 2), vars.game.height() - vars.size);
    //spawn les obstacles
    for (i = 0; i < Math.floor((Math.random() * 5) + 3); i++) {
        x = 0;
        y = vars.grid.fix((Math.random() * window.innerHeight / 2) + window.innerHeight / 2);
        speed = 4;
        color = "red";
        car[i] = new Obstacle(vars.size, vars.size, color, x, y, speed);
        console.log("spawned" + i + " y: " + car[i].y + " x: "+ car[i].x);
    }
    game.start();
}

var game = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = vars.game.width();
        this.canvas.height = vars.game.height();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function Obstacle(width, height, color, x, y, speed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.update = () => {
        ctx = game.context;
        ctx.fillStyle = color;
        this.x += speed;
        if(this.x + this.width > window.innerWidth){
            this.x = 0;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function Street(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = () => {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function River(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = () => {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function updateGame() {
    game.clear();
    street.update();
    river.update();
    player.update();
    for(i = 0; i < car.length; i++) {
        car[i].update();
    }
}

document.onkeydown = Move;
function Move(e) {
    e = e || window.event;
    switch (e.which) {
        //up
        case 38:
            if((player.y - vars.size) > 0 - 50) player.y -= vars.size;
            break;

        //down
        case 40:
            if((player.y + vars.size) < game.canvas.height) player.y += vars.size;
            break;

        //right
        case 39:
            if((player.x + vars.size) < game.canvas.width) player.x += vars.size;
            break;

        //left
        case 37:
            if((player.x - vars.size) > 0 - 50) player.x -= vars.size;
            break;
    }
}