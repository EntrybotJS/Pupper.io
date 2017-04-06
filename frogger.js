var vars = {
    size: 50,
    street: {
        height: () => {
            if ((vars.game.height() / 50) % 2 === 0) return vars.grid.fix((vars.game.height() / 2) - 100);
            else return vars.grid.fix((vars.game.height() / 2) - 50);
        },
        width: () => vars.game.width(),
        x: () => 0,
        y: () => vars.grid.fix(vars.game.height() / 2 + 50)
    },
    river: {
        height: () => {
            if(this.game.height % 50 === 0){
                return (vars.game.height() / 2) - 50;
            } else {
                return (vars.game.height() / 2) - 50 ;
            }
        },
        width: () => vars.game.width()
    },
    game: {
        width: () => {
            if(window.innerWidth % this.size === 0){
                return window.innerWidth;
            } else {
                return Math.floor(window.innerWidth / 50 ) * 50;
            }
        },
        height: () => Math.floor(window.innerHeight / 50) * 50
    },
    grid: {
        fix: (ch) => Math.floor(ch / 50) * 50,
    },
    random: (min, max) =>  Math.floor(Math.random() * (max - min + 1)) + min,
    obs:{
        quantity: () => {
            if (vars.game.width() < vars.street.height * 2) {
                return ((vars.street.height() / vars.size) * (vars.game.width() / vars.size)) * 0.2;
            } else {
                return ((vars.street.height() / vars.size) * (vars.game.width() / vars.size)) * 0.15;
            }
        },
        speed: () => {
            return vars.random(5,8);
        },
        y: () => {
            return vars.grid.fix(vars.random(vars.street.y(), vars.street.y() + vars.street.height()));
        },
        x: () => {
            return vars.grid.fix(vars.random(0, street.width));
        },
        color: () => {
            switch(vars.random(0,5)){
                case 0:
                return "white";
                case 1:
                return "lightgrey";
                case 2:
                return "gold";
                case 3:
                return "blue";
                case 4:
                return "red";
                case 5:
                return "yellow";
            }
        }
    }
};

var street;
var river;
var player;
var car = [];

function startGame() {
    if(screen.height < 768 && screen.width > screen.height){
        
    } else {
        street = new Street(vars.street.width() , vars.street.height(), "grey", 0, vars.street.y());
        river = new River(vars.grid.fix(window.innerWidth), vars.grid.fix(window.innerHeight / 2) - 50, "#0087FF", 0, vars.size);
        player = new Player(vars.size, vars.size, "lawngreen", vars.grid.fix(vars.game.width() / 2), vars.game.height() - vars.size);
        //spawn les obstacles
        for (i = 0; i < vars.obs.quantity() ; i++) {
            car[i] = new Obstacle(vars.size, vars.size, vars.obs.color(), vars.obs.x(), vars.obs.y(), vars.obs.speed());
        }
        game.start();
    }
    
}


var lastCalledTime;
var fps;

var game = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = vars.game.width();
        this.canvas.height = vars.game.height();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 16);
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
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 0.001);
        var mytop = this.y;
        var mybottom = this.y + (this.height - 0.001);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width - 0.001);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height - 0.001);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
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
        if(this.x > vars.street.width()){
            this.x = 0 - this.width;
            this.speed = null && vars.obs.speed();
            this.color = vars.obs.color();
            this.y = vars.obs.y();
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

window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

(function loop() {
    requestAnimationFrame(function () {
      $('#out').html(countFPS());
      loop();
    });
}());

function updateGame() {
    game.clear();
    street.update();
    river.update();
    for(i = 0; i < car.length; i++) {
        if(player.crashWith(car[i]) === true ) {
            location.reload();
        }
    }
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
        case 80:
            break;
    }
}