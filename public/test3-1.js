var x1,x2,y1,y2; //マウスが押された時のxy座標、話された時のxy座標
var canvas1,canvas2,canvas3,ctx1,ctx2,ctx3;
var img = new Image();

onload = function(){
	canvas1 = document.getElementById("canvas1");
	ctx1 = canvas1.getContext("2d");
	canvas2 = document.getElementById("canvas2");
	ctx2 = canvas2.getContext("2d");
	canvas3 = document.getElementById("canvas3");
	ctx3 = canvas3.getContext("2d");
	console.log(canvas3.width,canvas3.height);
	drawSquare(canvas2,ctx2);
}



// ファイル読み込み
var dataUrl,canvasflag;
var obj = document.getElementById("selfile");
obj.addEventListener("change", function(evt) {
	canvasflag = true;
	var file = evt.target.files;
	var reader = new FileReader();
	reader.readAsDataURL(file[0]);
	reader.onload = function(){
		img.src = reader.result;
	}

	img.addEventListener("load",function(){
		console.log(canvas3.width,canvas3.height);
		if(canvasflag){
			if(img.width>400){
				canvasResize(canvas1,img.width,img.height,img);
				ctx1 = canvas1.getContext("2d");
				ctx1.drawImage(img,0,0,canvas1.width,canvas1.height);
				ctx3.clearRect(0,0,canvas3.width,canvas3.height);
				canvasResize(canvas2,img.width,img.height,img);
				canvasResize(canvas3,img.width,img.height,img);
				console.log(canvas3.width,canvas3.height);
			}else{
				ctx1.drawImage(img,0,0,img.width,img.height);
			}
		canvasflag=false;
		}		
	},false);
}, false);

// 画像のリサイズ
function canvasResize(canvas,width,height,img){
	var reWidth,reHeight;
	var scale = 400/width;

	reWidth = scale * width;
	reHeight = scale * height;

	canvas.width = reWidth;
	canvas.height = reHeight;
}

// 画像の切り抜き
function trim(){
	var x1_2,y1_2,x2_2,y2_2;
	x1_2 = x1<x2 ? (x2_2=x2,x1) : (x2_2=x1,x2);
	y1_2 = y1<y2 ? (y2_2=y2,y1) : (y2_2=y1,y2);

	img.onload = function(){
		ctx3.drawImage(img,x1_2,y1_2,Math.abs(x2-x1),Math.abs(y2-y1),0,0,Math.abs(x2-x1),Math.abs(y2-y1));
	}
	img.src = canvas1.toDataURL();
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);
	console.log(canvas1.width,canvas1.height);
	console.log(canvas2.width,canvas2.height);
	console.log(canvas3.width,canvas3.height);

}


// 切り抜く領域の選択
function drawSquare(canvas,ctx){
	var drawflag;

	canvas.onmousedown =
		function(e){
	    	var rect = e.target.getBoundingClientRect();
			x1 =  Math.round(e.clientX - rect.left);
			y1 =  Math.round(e.clientY - rect.top);
			ctx.clearRect(0,0,canvas.width,canvas.height);
			drawflag = true;
		}
	canvas.onmousemove =			
		function(e){
			if(drawflag){
				var rect = e.target.getBoundingClientRect();
				var mouseX =  Math.round(e.clientX - rect.left);
				var mouseY =  Math.round(e.clientY - rect.top);
				ctx.clearRect(0,0,canvas.width,canvas.height);
				ctx.strokeRect(x1,y1,mouseX-x1,mouseY-y1)
			}
		}    	
	canvas.onmouseup = 
		function(e){
	    	var rect = e.target.getBoundingClientRect();
			x2 =  Math.round(e.clientX - rect.left);
			y2 =  Math.round(e.clientY - rect.top);
			drawflag = false;
			ctx.beginPath();
		 	ctx.strokeRect(x1, y1, x2-x1, y2-y1);
	 		console.log(x1,y1,x2,y2);
	 		console.log(x2-x1,y2-y1);
		}
}
