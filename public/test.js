// hsv変換し、10px*10pxごとにモザイク化
var canvas;
var ctx;

onload = function() {
  canvas = document.getElementById('canvas3');
  if ( ! canvas || ! canvas.getContext ) {
    return false;
  }
  ctx = canvas.getContext('2d');

  var img = new Image();

  img.onload = function(){
    var width = img.width;
    var height = img.height;
    canvas.width = width;
    canvas.height = height;
    console.log(canvas.width+"/"+canvas.height);
    draw(img);
  }
  
};


function draw(img){
  var w,h,imageData,rgbData;
  var rgbArray = new Array();
  var rgbArray2 = new Array();
	var image = img;
	// image.src = "huku.jpg";
  ctx.drawImage(image,0,0);

  w = image.width;
  h = image.height;
	console.log(w+","+h);

	// 50pxで区切る
	var w2 = Math.ceil(w/20);
	var h2 = Math.ceil(h/20);

	imageData = ctx.getImageData(0,0,w,h);
	rgbData = imageData.data;

  // 50pxごとに線を引く
  ctx.beginPath();
  for(var i=0;i<h2;i++){
    ctx.moveTo((i+1)*50,0);
    ctx.lineTo((i+1)*50,h);
  }
  for(var j=0;j<w2;j++){
    ctx.moveTo(0,(j+1)*50);
    ctx.lineTo(w,(j+1)*50);
  }
  ctx.closePath(); ctx.stroke();

// RGB取得
for(var i=0;i<h;i++){
    rgbArray[i] = new Array();
	for(var j=0;j<w;j++){
        var n = j*4 + i*w*4;
        var hsv = hsvChange(rgbData[n],rgbData[n+1],rgbData[n+2]);
        rgbArray[i][j] = new Array(3);
        rgbArray[i][j][0] = hsv[0];
        rgbArray[i][j][1] = hsv[1];
        rgbArray[i][j][2] = hsv[2];
     }
  }
 
var result = simpilication(rgbArray,w,h); 

var str = new Array();
var str2 = new Array();
var aveArray = new Array();

for(var i=0;i<h2;i++){
  aveArray[i] = new Array();
  str[i] = new Array();

  for(var j=0;j<w2;j++){
    aveArray[i][j] = new Array();
    var sum0=0,sum1=0,sum2=0;

    var cellWidth=0,cellHeight;
    for(var i2=0;i2<20;i2++){
      var i3 = i*20+i2;
      cellWidth++;
      if(i3>=h){
        break;
      }else{
        cellHeight=0;
        for(var j2=0;j2<20;j2++){
          var j3 = j*20+j2;
          cellHeight++;
          if(j3>=w){
            break;
          }else{
            sum0 += rgbArray[i3][j3][0];
            sum1 += rgbArray[i3][j3][1];
            sum2 += rgbArray[i3][j3][2];
            str[i].push(rgbArray[i3][j3][0]);
            str2.push(sum0);
          }
        } 
      }
    }    
    aveArray[i][j][0] = sum0/(cellWidth*cellHeight);
    aveArray[i][j][1] = sum1/(cellWidth*cellHeight);
    aveArray[i][j][2] = sum2/(cellWidth*cellHeight);

    // 確認
    var rgb = HSVtoRGB(aveArray[i][j][0],aveArray[i][j][1],aveArray[i][j][2]);
    ctx.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    ctx.fillRect(j*20,i*20,20,20);

  }
}

var arrayHue = simpleH(aveArray);
var arrayHueLength = new Array(arrayHue.length);
for(var i=0;i<arrayHue.length;i++){
  arrayHueLength[i] = arrayHue[i].length;
}

console.log(arrayHue.length);
console.log(arrayHueLength);
console.log(aveArray);


}

//面積の大きい順番に抽出
function pickUp(array){
  // 1番目、2番め、3番目に多い要素数を持つグループの抽出
  var maxColor,secondColor,tirdColor;

  var max=0,next=array[0];
  for(var i=0;i<array.length;i++){
    if(max<=next){
      maxColor = i;
      max = next;
    }
    next = array[i+1];
  }

  max=0,next=array[0];
  for(var i=0;i<array.length;i++){
    if(max<=next && (i!=maxColor)){
      secondColor = i;
      max = next;
    }
    next = array[i+1];
  }

  max=0,next=array[0];
  for(var i=0;i<array.length;i++){
    if(max<=next && (i!=maxColor) && (i!=secondColor)){
      tirdColor = i;
      max = next;
    }
    next = array[i+1];
  }

  console.log(maxColor+"/"+secondColor+"/"+tirdColor);
  return Array(maxColor,secondColor,tirdColor);
}

function simpilication(hsvArray,width,height){
  var h,s,v;
  var simpleHsv = new Array();
  var simpleHsv2 = new Array(); //四捨五入したやつ

  for(var i=0;i<height;i++){
    simpleHsv[i] = new Array();
    for(var j=0;j<width;j++){
      simpleHsv[i][j] = new Array(3);
      v = (hsvArray[i][j][2]+12.75)/25.5;
      s = (hsvArray[i][j][1]+0.05)/0.1;
      h = (hsvArray[i][j][0]+0.25)/0.5;
      simpleHsv[i][j][0] = h;
      simpleHsv[i][j][1] = s;
      simpleHsv[i][j][2] = v;

    }
  }

  for(var i=0;i<height;i++){
    simpleHsv2[i] = new Array();
    for(var j=0;j<width;j++){
      simpleHsv2[i][j] = new Array(3);
      v2 = Math.round(v);
      s2 = Math.round(s);
      h2 = Math.round(h);

      simpleHsv2[i][j][0] = h2;
      simpleHsv2[i][j][1] = s2;
      simpleHsv2[i][j][2] = v2;

    }
  }

  console.log(simpleHsv);
  console.log(simpleHsv2);
  return Array(simpleHsv,simpleHsv2);
}

function simpleH(hsvArray){
  var box=new Array(13); //12個にグループ分け
  for(var i=0;i<13;i++){
    box[i] = new Array();
  }

  for(var i=0;i<hsvArray.length;i++){
    for(var j=0;j<hsvArray[i].length;j++){
      if(hsvArray[i][j][0]<30){
        box[0].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=30 && hsvArray[i][j][0]<60){
        box[1].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=60 && hsvArray[i][j][0]<90){
        box[2].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=90 && hsvArray[i][j][0]<120){
        box[3].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=120 && hsvArray[i][j][0]<150){
        box[4].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=150 && hsvArray[i][j][0]<180){
        box[5].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=180 && hsvArray[i][j][0]<210){
        box[6].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=210 && hsvArray[i][j][0]<240){
        box[7].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=240 && hsvArray[i][j][0]<270){
        box[8].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=270 && hsvArray[i][j][0]<300){
        box[9].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=300 && hsvArray[i][j][0]<330){
        box[10].push(hsvArray[i][j]);
      }else if(hsvArray[i][j][0]>=330 && hsvArray[i][j][0]<360){
        box[11].push(hsvArray[i][j]);
      }else{
        box[12].push(hsvArray[i][j]);
      }      
    }
  }
  console.log(box);

  return box;
}

// HSV変換
function hsvChange(r,g,b){
  var h,s,v;
  var max,min;
  max = Math.max(r,g,b);
  min = Math.min(r,g,b);

  if(max == min){
    h=0;
  }else if(min==r){
    h = (60*(b-g)/(max-min)) + 180;
  }else if(min==g){
    h = (60*(r-b)/(max-min)) + 300;
  }else if(min==b){
    h = (60*(g-r)/(max-min)) + 60;
  }
  v = max;
  s = (max-min)*255/max;
  return Array(h,s,v);
}

// HSVからRGB
function HSVtoRGB (h, s, v) {
  var r, g, b; // 0..255
  while (h < 0) {
    h += 360;
  }
  h = h % 360;
  // 特別な場合 saturation = 0
  if (s == 0) {
    // → RGB は V に等しい
    v = Math.round(v);
    return {'r': v, 'g': v, 'b': v};
  }
  s = s / 255;
  var i = Math.floor(h / 60) % 6,
      f = (h / 60) - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)
  switch (i) {
    case 0 :
      r = v;  g = t;  b = p;  break;
    case 1 :
      r = q;  g = v;  b = p;  break;
    case 2 :
      r = p;  g = v;  b = t;  break;
    case 3 :
      r = p;  g = q;  b = v;  break;
    case 4 :
      r = t;  g = p;  b = v;  break;
    case 5 :
      r = v;  g = p;  b = q;  break;
  }
  return Array(Math.round(r),Math.round(g),Math.round(b));
}
