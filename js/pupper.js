/*
*   pupper.js for Pupper.io
*   by: Entrybot
*   4/7/2017
*   DO NOT COPY MODIFY OR RE-USE
*   ferluc.julien@gmail.com
*/

/*############################### RELOAD ON RESIZE ##############################*/
window.onresize = function() {
            location.reload();
        };


/*############################### GLOBAL FUNCTIONS AND VARIABLES OBJECT ##############################*/
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
                if((vars.grid.fix(window.innerWidth) / 50) % 2 === 0){
                    return vars.grid.fix(window.innerWidth) - 50;
                }
                else {
                    return vars.grid.fix(window.innerWidth);
                }
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
                //Desktop/Tablet
                return ((vars.street.height() / vars.size) * (vars.game.width() / vars.size)) * 0.30;
            } else {
                //Mobile
                return ((vars.street.height() / vars.size) * (vars.game.width() / vars.size)) * 0.15;
            }
        },
        speed: () => {
            var r = vars.random(5,7);
            return r;
        },
        y: () => {
            return vars.grid.fix(vars.random(vars.street.y(), vars.street.y() + vars.street.height() - 20));
        },
        x: () => {
            return vars.grid.fix(vars.random(0, street.width));
        },
        color: () => {
            var color;
            switch(vars.random(0,20)){
                case 0:
                color = "white";
                break;
                case 1:
                color = "#f2f2f2";
                break;
                case 2:
                color = "gold";
                break;
                case 3:
                color = "66ccff";
                break;
                case 4:
                color = "#FF3333";
                break;
                case 5:
                color = "yellow";
                break;
                case 6:
                color = "#999999";
                break;
                case 7:
                color = "#ff9980";
                break;
                case 8:
                color = "#aaff00";
                break;
                case 9:
                color = "#c2d6d6";
                break;
                case 10:
                color = "#1a1a1a";
                break;
                case 11:
                color = "#404040";
                break;
                case 12:
                color = "#ffffff";
                break;
                case 13:
                color = "#ffffff";
                break;
                case 14:
                color = "#000000";
                break;
                case 15:
                color = "#404040";
                break;
                case 16:
                color = "#ffb366";
                break;
                case 17:
                color = "#806600";
                break;
                case 18:
                color = "#ffff4d";
                break;
                case 19:
                color = "#55552b";
                break;
                case 20:
                color = "#ff9900";
                break;
            }
            return color;
        }
    }
};


        /*############################### GLOBAL VARIABLES ##############################*/
        var street;
        var river;
        var player;
        var img = new Image();
        img.src = 'animals.png';
        var car = [];




        /*############################### GAME AND OBJECT INITIALISATION ##############################*/
        function startGame() {
            if(screen.height < 768 && screen.width > screen.height){
                
            } else {
                street = new Street(vars.street.width() , vars.street.height(), "grey", 0, vars.street.y());
                river = new River(vars.grid.fix(window.innerWidth), vars.grid.fix(window.innerHeight / 2) - 50, "#0087FF", 0, vars.size);
                player = new Player(vars.size, vars.size, "lawngreen", vars.grid.fix(vars.game.width() / 2), vars.game.height() - vars.size, img);
                //spawn les obstacles
                for (i = 0; i < vars.obs.quantity() ; i++) {
                    car[i] = new Obstacle(vars.size, vars.size, vars.obs.color(), vars.obs.x(), vars.obs.y(), vars.obs.speed());
                }
                game.start();
            }
        }



        /*############################### GAME OBJECT ##############################*/
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



        /*############################### PLAYER OBJECT FACTORY ##############################*/
        function Player(width, height, color, x, y, image) {
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.image = image;
            this.update = function() {
                ctx = game.context;
                ctx.fillStyle = color;
                //ctx.drawImage(this.image, this.x, this.y, this.width, this.height, 0, 20, 50, 50);
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = "black";
                ctx.fillText("Player",this.x + 3, this.y + 9, vars.size);
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



        /*############################### OBSTACLE OBJECT FACTORY ##############################*/
        function Obstacle(width, height, color, x, y, speed) {
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.color = color;
            this.speed = speed;
            this.update = () => {
                ctx = game.context;
                this.x += this.speed;
                if(this.x > vars.street.width()){
                    this.x = 0 - this.width;
                    this.color = vars.obs.color();
                    this.y = vars.obs.y();
                    this.speed = vars.obs.speed();
                }
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            },
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



        /*############################### STREET OBJECT FACTORY ##############################*/
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



        /*############################### RIVER OBJECT FACTORY ##############################*/
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



        /*############################### FPS COUNTER ##############################*/
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



        /*############################### GAME UPDATE FOR GLOBAL OBJECTS ##############################*/
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
                for(j = 0; j < car.length; j++){
                    if(car[i].crashWith(car[j]) === true){
                        if(i !== j){
                            if(car[i].x < car[j].x){
                                car[j].speed = car[i].speed;
                            }
                        }
                    }
                }
                car[i].update();
            }
        }



        /*############################### FINGER SWIPE TESTING ##############################*/
        $('canvas').on('swipe', Swipe(event));

        function Swipe(e){
            console.log(e);
        }



        /*############################### PLAYER MOVEMENT FUNCTION ##############################*/
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


        /*############################### PREVENT TOUCH SCROLLING ##############################*/
        document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        }, false);
        document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        }, false);
        document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        }, false);