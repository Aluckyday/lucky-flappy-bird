var bird = {
    skyPosition : 0,
    skySpep : 2,
    birdTop : 220,
    startColor : 'blue',
    count : 0,
    startFalg : false,
    coordinateY : 0,
    top : 0,
    bottom : 580,
    init : function(){
        this.domElement();
        this.animation();
    },
    //dom元素获取
    domElement : function(){
        this.el = document.getElementById('game')
        this.oBird = document.getElementsByClassName('bird')[0];
        this.orestart = document.getElementsByClassName('start')[0];
        this.oscore = document.getElementsByClassName('score')[0];
        this.omask = document.getElementsByClassName('mask')[0];
        this.oend = document.getElementsByClassName('end')[0];
    },
    animation : function(){
        var self = this;
        this.suspebd = setInterval(function(){
            self.pageAnimation();
            if(self.startFalg){
               self.birdDecline(); 
            }
                if(++ self.count % 10 === 0){
                    if(!self.startFalg){
                        self.birdAnimation();   
                        self.fontAnimation();
                    }
                    self.birdmove(self.count);
                }
                self.gameOver(); 
        },30)
        this.start();
     
        
    },
    //页面动画
    pageAnimation : function(){
            this.skyPosition -= this.skySpep;
            this.el.style.backgroundPositionX = this.skyPosition + 'px'; 
    },
    //小鸟动画
    birdAnimation : function(){
            this.birdTop = this.birdTop === 220 ? 260 : 220;
            this.oBird.style.top = this.birdTop + 'px';  
    },
    birdmove : function(count){
        this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
    },
    //字体动画
    fontAnimation : function(){
        
            var prveColor = self.startColor;
            this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
            this.orestart.classList.remove('start-' + prveColor );
            this.orestart.classList.add('start-' + this.startColor);
    },
    //开始游戏
    start : function(){
    var self = this;
      this.orestart.onclick = function(){
        self.startFalg = true;
        self.oBird.style.left = 80 + 'px'
        self.orestart.style.display = 'none'
        self.oscore.style.display = 'block'
        self.skySpep = 5;
      }    
    },
    birdDecline : function(){
         this.birdTop += ++this.coordinateY;
         this.oBird.style.top = this.birdTop + 'px';
    } ,
    collisionDetection : function(){
        if(this.birdTop < this.top || this.birdTop > this.bottom){
            this.omask.style.display = 'block';
            this.oBird.style.display = 'none';
            this.oscore.style.display = 'none';
            this.oend.style.display = 'block';
            clearInterval(this.suspebd);   
        }   
    },
    //游戏结束
    gameOver : function(){
       this.collisionDetection();
    }  


   






}