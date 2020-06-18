
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
    pipeLength : 7,
    pipeArr : [],
    score : 0,
    pipeListIndex : 6,

    //初始化游戏
    init : function(){
        var self = this;
        this.domElement();
        this.animation();
        this.headle();
        this.btn[0].onclick = function(){
            self.oAudio[1].play();
        }
        this.btn[1].onclick = function(){
            self.oAudio[1].pause();
        }


        if(localStorage.getItem('ply')){
        //   this.start();
        }
        
        document.onkeydown = function(event){        //在全局中绑定按下事件  
            if(event.which === 38 || event.which === 87){
                self.coordinateY = -10;
            }
            
            }
      
    },
    
    //dom元素获取
    domElement : function(){
        this.el = document.getElementById('game')
        this.oBird = document.getElementsByClassName('bird')[0];
        this.orestart = document.getElementsByClassName('start')[0];
        this.oscore = document.getElementsByClassName('score')[0];
        this.omask = document.getElementsByClassName('mask')[0];
        this.oend = document.getElementsByClassName('end')[0];
        this.oOverScore = document.getElementsByClassName('final-score')[0];
        this.rankList = document.getElementsByClassName('rank-list')[0];
        this.oRestart = document.getElementsByClassName('restart')[0];
        this.oAudio = document.getElementsByTagName('audio');
        this.btn = document.getElementsByTagName('button');

        this.scoreArr = this.getScore();
    },
    getScore : function () {
        var scoreArr = getLocal('score')
        return scoreArr ? scoreArr : [];
    },
    animation : function(){
        var self = this;
        this.suspebd = setInterval(function(){
            self.pageAnimation();
            if(self.startFalg){
               self.birdDecline();
               self.pipeMove(); 
               self.judgePipe(); 
            }
                if(++ self.count % 10 === 0){
                    if(!self.startFalg){
                        self.birdAnimation();   
                        self.fontAnimation();
                    }
                    self.birdmove(self.count);
                }
                
        },30)
        this.headle();
     
        
    },
    //页面动画
    pageAnimation : function(){
            this.skyPosition -= this.skySpep;
            this.el.style.backgroundPositionX = this.skyPosition + 'px'; 
    },
    //小鸟动画
    birdAnimation : function(){
        //循环切换小鸟top值
            this.birdTop = this.birdTop === 220 ? 260 : 220;
            this.oBird.style.top = this.birdTop + 'px';  
    },
    birdmove : function(count){
        this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
    },
    //柱子移动
    pipeMove : function(){
        for(var i = 0; i < this.pipeLength; i++){
            var upPipe = this.pipeArr[i].up
            var downPipe = this.pipeArr[i].down
            var x = upPipe.offsetLeft - this.skySpep
            if(x <  -52){
                upPipe.style.left = this.pipeArr[this.pipeListIndex].up.offsetLeft + 300 + 'px';
                downPipe.style.left = this.pipeArr[this.pipeListIndex].up.offsetLeft + 300 + 'px';
                this.pipeListIndex = ++ this.pipeListIndex % this.pipeLength;
                continue;
            }
            var upHeight = 50 + Math.floor(Math.random() * 175);
            var downHeight = 600 -150 - upHeight;
            upPipe.style.left = x + 'px'
            downPipe.style.left = x + 'px'
        }

    },
    //字体动画
    fontAnimation : function(){
            var prveColor = this.startColor;
            //循环切换className
            this.startColor = this.startColor === 'blue' ? 'white' : 'blue';

            this.orestart.classList.remove('start-' + prveColor );

            this.orestart.classList.add('start-' + this.startColor);
    },
    //开始游戏
    headle : function(){
        this.headleClick();
        this.handleStart();
        this.handleRestart();
        
        
    },
    
    handleStart: function () {
        this.orestart.onclick = this.start.bind(this);
      },    
    handleRestart : function(){
        this.oRestart.onclick = function(){
            localStorage.setItem('ply',true)
            window.location.reload();
        }
    },
    start : function(){
        this.startFalg = true;
        this.oBird.style.left = 80 + 'px'
        this.oBird.style.transition = 'none'
        this.orestart.style.display = 'none'
        this.oscore.style.display = 'block'
        this.skySpep = 5;
        this.oAudio[0].play();
        console.log(this.oAudio)
        for(var i = 0; i < this.pipeLength; i++){
            this.createPipe(300 * (i + 1));   
        }

       
              
      
          
    },
    headleClick : function(){
        var self = this;
        this.el.onclick = function(Event){
            if(!Event.target.classList.contains('start')){
                self.coordinateY = -10;  
            }
        };
    },
    //随机获取柱子高度
    createPipe : function(x){
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 -150 - upHeight;

        var oUpPipe = createEle('div',['pipe','pipe-up'],{
            height : upHeight + 'px',
            left : x + 'px'
        })
      
        var oDownPipe = createEle('div',['pipe','pipe-bottom'],{
            height : downHeight + 'px',
            left : x + 'px'
        })
        this.el.appendChild(oUpPipe)
        this.el.appendChild(oDownPipe)
        this.pipeArr.push({
            up : oUpPipe,
            down : oDownPipe,
            y : [upHeight,upHeight + 150]
        })
    },
    birdDecline : function(){
         this.birdTop += ++this.coordinateY;
         this.oBird.style.top = this.birdTop + 'px';
         this.collisionDetection();
         this.addScore();
         
    } ,
    addScore : function(){  
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if(pipeX < 13){
            this.oscore.innerText = ++ this.score;
            switch(this.score){
                case 10:
                    this.skySpep = 8;
                    break;
                case 20:
                    this.skySpep = 10;
                    break;
                case 30:
                    this.skySpep = 12;
                    break;
                case 40: 
                    this.skySpep = 14;
                    break;
                case 50: 
                    this.skySpep = 16;
                    break;
                case 60 : 
                    this.skySpep = 18;
                    break;
                case 70 : 
                    this.skySpep = 20;
                    break;
                case 100 : 
                    this.skySpep = 22;
                    break;
                case 150 : 
                    this.skySpep = 24;
                    break;
                case 200 : 
                    this.skySpep = 26
                    break;
                case this.score > 300 :
                    this.skySpep = 30;
            }
            console.log(this.score)
        }
      
            
        
      
    },
    judgePipe : function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y
        var birdY = this.birdTop;
        if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])){
            this.gameOver();
        }
    },
    collisionDetection : function(){
        if(this.birdTop < this.top || this.birdTop > this.bottom){
            this.gameOver();
        }   
    },
    setScore : function () {
        this.scoreArr.push({
            score : this.score,
            time : this.getDates(),
        }),
        this.scoreArr.sort(function(a,b){
            return b.score - a.score;
        }); 
        setLocal('score',this.scoreArr)
        return this.scoreArr
    },
    getDates : function(){
        var d = new Date();
        var year = d.getFullYear();
        var month = forMatNumber(d.getMonth() + 1);


        var day = forMatNumber(d.getDate());

        var hour = forMatNumber(d.getHours());

        var minute = forMatNumber(d.getMinutes());

        var secode = forMatNumber(d.getSeconds());

        return `${year}.${month}.${day} ${hour}:${minute}:${secode}`;
    },
    //游戏结束
    gameOver : function(){
            clearInterval(this.suspebd); 
            this.setScore();
            this.omask.style.display = 'block';
            this.oBird.style.display = 'none';
            this.oscore.style.display = 'none';
            this.oend.style.display = 'block';
            this.oOverScore.innerText = this.score;
            this.oAudio[0].pause()

            this.rendRankList();
    } ,
    rendRankList : function(){
        var templist = '';
        for( let i = 0; i < 8; i++){
            var degreeClass = '';
            switch (i) {
              case 0:
                degreeClass = 'first';
                break;
              case 1:
                degreeClass = 'second';
                break;
              case 2:
                degreeClass = 'third';
                break;
            }
            templist +=`
        <li class="rank-item">
            <span class="rank-degree ${degreeClass}">${i + 1}</span>
            <span class="rank-score">${this.scoreArr[i].score}</span>
            <span class="rank-time">${this.scoreArr[i].time}</span>
        </li>
            `
        }
        this.rankList.innerHTML = templist;
    },

   






}