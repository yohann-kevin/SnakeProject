window.onload = function () {

    var canvasWidth = 900; //taille du canvas
    var canvasHeight = 600; //taille du canvas
    var blockSize = 30; //taille d'un block
    var ctx;
    var delay = 100; //delay de rafraichissement de la page
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;

    //appelle de fonction
    init();

    function init() {

        canvas = document.createElement('canvas'); //cree l'element canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "3px solid";
        //document.body.appendChild(canvas);//fixe le canvas a l'element html body
        document.getElementById("snake").appendChild(canvas); //fixe le canvas a mon main
        ctx = canvas.getContext('2d'); //indique le contexte
        //creer un serpent avec 3block placé en fonction d x et y
        snakee = new snake([
            [6, 4],
            [5, 4],
            [4, 4]
        ], 'right');
        applee = new Apple([10, 10]);
        refreshCanvas(); //appel la fonction refresh

    }

    function refreshCanvas() {

        //appelle la méthode advance
        snakee.advance();
        if (snakee.checkCollision()) {
            //game over
        } else {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); //efface le contenu
            //appelle la méthode draw
            snakee.draw();
            applee.draw();
            //refresh le canvas toute les 100 miliseconde
            setTimeout(refreshCanvas, delay);
        }
    }

    //déssine un block
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    //fonction constructeur
    function snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.draw = function () {
            //sauvegarde le contenu du canvas
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                //appelle la foction drawBlock
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }

        // permet a notre serpent de se déplacer
        this.advance = function () {
            //copie un élément de mon Array
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            //supprime le derniere element d'un array
            this.body.pop();
        };

        //réstreint les directions possible
        this.setDirection = function (newDirection) {
            var allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        //vérifie les collisions
        this.checkCollision = function () {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var maxX = widthInBlocks - 1;
            var minY = 0;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            //vérifie que le serpent ne s'est pas pris un mur
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }

            //vérifie si le serpent n'est pas passé sur son propre corp
            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
    }

    function Apple(position) {
        this.position = position;
        //déssine ma pomme
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = position[0] * blockSize + radius;
            var y = position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
    }

    //associe les touches a des directions
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 81:
                newDirection = "left";
                break;
            case 90:
                newDirection = "up";
                break;
            case 68:
                newDirection = "right";
                break;
            case 83:
                newDirection = "down";
                break;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}