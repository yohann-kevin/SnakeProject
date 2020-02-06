window.onload = function(){
    
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    
    init();

    function init(){
        
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "3px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new snake([[6,4],[5,4],[4,4]]);
        refreshCanvas();

    }

    function refreshCanvas(){

        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        snakee.advance();
        snakee.draw();
        setTimeout(refreshCanvas,delay);

    }

    function darwBlock(ctx, position){

        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function snake(body){
        this.body = body;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0 ; i < this.body.length ; i++){
                darwBlock(ctx, this.body[i]);
            }
            ctx.restore();       
        };
        this.advance= function(){

            var nextPosition = this.body[0].slice();
            nextPosition[0] += 1;
            this.body.unshift(nextPosition);
            this.body.pop();
        };
    }
    
}