//声明变量
var request = new XMLHttpRequest();
var btnText;
var audioCtx;
var bufferSource;
var gainNode;
var analyser;
var currntSongNum=0;
var when=0;                //当前音乐已播放的时间
var whenActive=false;
var currentMusicTime;   //当前播放的音乐的总时间
var hasGetTime=false;   //是否已经获取到了当前播放音乐的总时间
var firstPlay;          //是否为第一次按下播放键
var songs = [                  //用一个数组来存放三首歌曲以备切歌
  {
    artist: 'ClariS',
    name: 'ひらひら ひらら.mp3'
  },
  {
    artist: '张宇',
    name: '旅程.mp3'
  },
  {
    artist: '银临，AKi',
    name: '牵丝戏.mp3'
  }
]
//最开始的初始化
function init(){
	audioCtx = new  (window.AudioContext || window.webkitAudioContext)();			
	bufferSource = audioCtx.createBufferSource();
	gainNode = audioCtx.createGain();
	analyser = audioCtx.createAnalyser();
	bufferSource.addEventListener('ended', function () {
	        next();
	      })
    whenActive=true;
}
//切歌前的初始化
function reInit(){
	analyser.disconnect(0);
	gainNode.disconnect(0);
	bufferSource.disconnect(0);
	analyser=null;
	gainNode=null;
	//analyser.close();
	//gainNode.close();
	//bufferSource.close();   //bufferSource停止
	bufferSource.buffer=null;
	audioCtx.close();
	when=0;
}
//使用XMLHttpRequest来加载音乐文件
function getMusic(name) {
	request.abort();
	request.open("get", "music/" + name); // 文件位于music文件夹下，要获取的音频文件名为name
	request.responseType = "arraybuffer"; //设置respose的返回类型
	request.onload = function() {
		console.log(request.response); //ArrayBuffer 类型的返回数据
	};
	request.send();
}
//用decodeAudioData方法将arrayBuffer类型解析为buffer类型
function getData(){	
	hasGetTime=false;
	request.onload = function() {    
			audioCtx.decodeAudioData(request.response, function(buffer) {
				bufferSource.buffer = buffer;
				currentMusicTime=bufferSource.buffer.duration;
				console.log(currentMusicTime);
				hasGetTime=true;
				bufferSource.connect(gainNode);          //添加音量控制模块
				gainNode.connect(analyser);              //添加音频分析模块
				analyser.connect(audioCtx.destination);  			
				//播放音乐并显示相关信息
				bufferSource.start(0,when);
				draw(analyser);
				//timeDisplay();				
			}, function(err) {
				console.log(err)
			})
		};
}	
//音频可视化，在canvas上绘制
function draw(analyser){
	var canvas = document.getElementById('canvas'),
    cwidth = canvas.width,            //画布宽度
    cheight = canvas.height - 2,      //画布高度
    stripWidth = 8, //能量条的宽度
    space = 1, //能量条间的间距
    stripNum = cwidth / (stripWidth + space), //计算当前画布上能画多少条
    ctx = canvas.getContext('2d');
	//定义一个渐变样式用于画图
	gradient = ctx.createLinearGradient(0, 0, 0, 300);
	gradient.addColorStop(1, '#f8f8ff');
	gradient.addColorStop(0.5, '#ff7f50');
	gradient.addColorStop(0, '#ff0000');
	ctx.fillStyle = gradient;
	var drawStrip = function() {
		//音频转存到数组中
		var array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);
		var step = Math.round(array.length / stripNum); //计算采样步长
		ctx.clearRect(0, 0, cwidth, cheight); //清理画布准备画画
		for (var i = 0; i < stripNum; i++) {
			var value = array[i * step];
			ctx.fillRect(i * (stripWidth+space) /*频谱条的宽度+条间间距*/+80/*向右移动一下让它看起来更居中*/ , 
			             cheight - value , stripWidth, cheight);
        }
        requestAnimationFrame(drawStrip); 
    }
    requestAnimationFrame(drawStrip);
}
//点击事件
$(document).ready(function(){
	btnText=$("#play").text();
	//播放键被点击
    $("#play").click(function()
	{
		if(btnText=="play"){
			init();
			firstPlay=true;
			if(firstPlay){
				songList.songListEvent();
				firstPlay=false;
			}
		//document.getElementById("play").innerHTML = "pause";
		$("#play").text("pause");
		btnText=$("#play").text();
		//TODO
		//console.log(songs[currntSongNum].name);
		getMusic(songs[currntSongNum].name);
		getData();
		alert("即将为您播放："+songs[currntSongNum].artist+" "+songs[currntSongNum].name);
			
		//document.getElementById("musicInformation").innerHTML=songs[currntSongNum].artist+" "+songs[currntSongNum].name
		$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
		}
		else if(btnText == "pause") {
			$("#play").text("continue");
			btnText = $("#play").text();
			$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
			//TODO
			whenActive=false;
		    audioCtx.suspend();
			//bufferSource.stop(audioCtx.currentTime);
			alert("已暂停");
		}else if(btnText==="continue"){
			$("#play").text("pause")  ;
			btnText = $("#play").text();		
			whenActive=true;
			audioCtx.resume();
			$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
			alert("已继续播放");
		}
	});
	//下一首被点击
	$("#next").click(function(){
		console.log("下一首");
		reInit();
		init();
		currntSongNum===songs.length-1?currntSongNum=0:currntSongNum+=1;
		$("#play").text( "pause") ;
		btnText=$("#play").text();
		console.log(songs[currntSongNum].name);
		getMusic(songs[currntSongNum].name);
		getData();
		$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
		//alert("即将为您播放："+songs[currntSongNum].artist+" "+songs[currntSongNum].name);
	});
	//上一首
	$("#pre").click(function(){
		console.log("上一首");
		reInit();
		init();
		currntSongNum===0?currntSongNum=songs.length-1:currntSongNum-=1;
		$("#play").text("pause") ;
		btnText=$("#play").text();
		console.log(songs[currntSongNum].name);
		getMusic(songs[currntSongNum].name);
		getData();
		$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
	});
	$("#stop").click(function(){
		$("#play").text("play");
		btnText =$("#play").text();
		//bufferSource.stop();
		//timeDisplay();
		//document.getElementById("currentT").innerHTML="00：00";
		whenActive=false;
		reInit();
		// audioCtx.suspend();
		alert("stop");
	});
	$("#volumeUp").click(function(){
		gainNode.gain.value+=0.5;
		console.log(gainNode.gain.value);
	});
	$("#volumeDown").click(function(){
		gainNode.gain.value-=0.5;
		console.log(gainNode.gain.value);
	});
});

//进度条动画两边的时间显示
function timeDisplay(){
	var timer = window.setInterval(function(){
	if(hasGetTime){
// 		var currentT=audioCtx.currentTime;
// 		console.log(currentMusicTime);
		var per;
		let str2=timeFormat(currentMusicTime);
		if(when===currentMusicTime){
			when="00:00";		
			progressBar.bar.style.width=0 + '%';
			//document.getElementById("currentT").innerHTML=when;
		    $("#currentT").text(when);
		}
		else{		 
		  //currentT=audioCtx.currentTime;
		  if(whenActive){
			  when+=1;
		  }
		  per=when/currentMusicTime*100;
		  let str1=timeFormat(when);
		  console.log(when);
		  console.log(currentMusicTime);
		  console.log(per);
		  //progressBar.bar.style.width=per + "%";
		   progressBar.bar.css("width",per+"%");  //jQuery操作css属性
		   $("#currentT").text(str1);
		}
        $("#time").text(str2);
	}
	},1000);	
}
//改变时间显示的格式
function timeFormat(time){
	var min=Math.floor(time/60);
	var seconds=Math.floor(time%60);
	if(min<10){
		min="0"+min;
	}
	if(seconds<10){
		seconds="0"+seconds;
	}
	var string=min+":"+seconds;
	return string;
}
//定义processBar，包含两个方法setBar、getStyle
var progressBar = {
            set: function(id) {
                var self = this;
                //self.progressBar =document.getElementById(id);
				//id选择器创建jquery对象
				self.progressBar=$(id);
				//通过class选择器创建Jquery对象
				self.bar = $('.progressBar')
				self.thumb = $(".progressThumb");
				
				self.progressBar.click(function(e) {   //添加监听
                    if (e.button == 0) { // 判断点击左键
                        self.mDown = true;
                        self.beginX = e.offsetX;
                        self.positionX = e.offsetX;
                        self.beginClientX = e.clientX;
                        // self.progressBarLong = parseInt(self.getStyle(self.progressBar, 'width'));
                        self.progressBarLong=parseInt(self.progressBar.css("width"));
						var per = parseInt(self.positionX / self.progressBarLong * 100);
                        //self.bar.style.width = per + '%';
						self.bar.css("width",per+"%");
						reInit();
						init();
						when=per/100*currentMusicTime;
						console.log(when);
						getMusic(songs[currntSongNum].name);
						getData();
						// document.getElementById("musicInformation").innerHTML=songs[currntSongNum].artist+" "+songs[currntSongNum].name
						$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
						//bufferSource.start(when);					
                    }
                });
                  $(document).ready(function(){
                  	$(document).mousemove(function(e){
                  		if (self.mDown) {
                  		    var moveX = e.clientX - self.beginClientX;
                  		    self.positionX = (self.beginX + moveX > self.progressBarLong) ? self.progressBarLong : (self.beginX + moveX < 0) ? 0 : self.beginX + moveX;
                  		    var per = parseInt(self.positionX / self.progressBarLong * 100); //解析字符串获得number
                  		    //self.bar.style.width = per + '%';
                  			self.bar.css("width",per+"%");
							reInit();
                  			init();
                  			when=per/100*currentMusicTime;
                  			console.log(when);
                  			getMusic(songs[currntSongNum].name);
                  			getData();
                  			$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
							//document.getElementById("musicInformation").innerHTML=songs[currntSongNum].artist+" "+songs[currntSongNum].name
                  		}
                  	});	
				    $(document).mouseup(function(e){
							if (e.button == 0) { 
		                    self.mDown = false;		    	
							}
				    });
                });
  },
  }
var songList={
	shiftSong:function(num){
		currntSongNum=num;
		reInit();
		init();
		getMusic(songs[currntSongNum].name);
		getData();
		$("#musicInformation").text(songs[currntSongNum].artist+" "+songs[currntSongNum].name);
	
	},
	songListEvent:function() {		
		    var self=this;
			self.song0=$("#song0");
			self.song1=$("#song1");
            self.song2=$("#song2");				
			const oriStyle=self.song0.css("background");	
			$(document).ready(function() {
				self.song0.click(function(e){
					if (e.button == 0) { // 判断点击左键
					   self.shiftSong(0);
					}
				});
				self.song1.click(function(e){
					if (e.button == 0) { // 判断点击左键
					   self.shiftSong(1);
					}
				});
				self.song2.click(function(e) {
					if (e.button == 0) { // 判断点击左键
					   self.shiftSong(2);
					}
				})
			});
			
		    
				var currnetSongTimer=window.setInterval(function(){
					switch(currntSongNum){
						case 0:{
							self.song0.css("background","#EFEDEF");
							self.song1.css("background",oriStyle);
							self.song2.css("background",oriStyle);
						}
						  break;
						case 1:
						{
							self.song1.css("background","#EFEDEF");
							self.song0.css("background",oriStyle);
							self.song2.css("background",oriStyle);
						}
						 break;
						case 2:
						 {
						 	self.song2.css("background","#EFEDEF");
						 	self.song0.css("background",oriStyle);
						 	self.song1.css("background",oriStyle);
						 }
						 break;
					}
				},1000);
				
			}					
}
progressBar.set("bar");
timeDisplay();

