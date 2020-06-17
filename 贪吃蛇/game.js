const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d') // 创建一个 2d context
var audioBackground = wx.createInnerAudioContext(); //背景音乐
audioBackground.src = "audio/background.mp3";
var audioEat = wx.createInnerAudioContext(); //吃的声音
audioEat.src = "audio/eat.mp3";
var audioDie = wx.createInnerAudioContext(); //死亡声音
audioDie.src = "audio/end.mp3";
var audioStart = wx.createInnerAudioContext(); //死亡声音
audioStart.src = "audio/start.mp3";
var startX = 0,
  startY = 0; //手指轻触时放入坐标
var moveX = 0,
  moveY = 0; //手指移动时的坐标
var endX = 0,
  endY = 0; //手指离开时的坐标
var dx = 0,
  dy = 0; //移动增量
var direction = "right"; //移动方向
var windowWidth = 0; //屏幕的宽
var windowHeight = 0; //屏幕的高
var timer = null; //定时器
var isCollision = false; //是否碰撞上食物
var point = 0; //得分
const imageStart = wx.createImage();
imageStart.src = 'images/start.png';
var started = false; //游戏运行或结束
var stopped = false; //后台暂停
//蛇头对象
var snakeHead = {
  x: 100,
  y: 100,
  r: 15,
  deg: 0,
  snakeDirection: "right",
  color: '#CD5C5C',
  drawHead: function () {
    //画出嘴脸this.
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.deg); //旋转
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.r, Math.PI / 7, -Math.PI / 7, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -this.r / 2, 2, Math.PI * 2, 0, true);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.restore();
  }
}
//蛇身数组  
var snakeBody = [];
//食物数组
var foods = [];
var level = 0;
var timeLevel = [800, 500, 300, 200, 100];
//绘制函数
function draw(obj) {
  ctx.save();
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  // ctx.arc(x,y,r,sAngle,eAngle,counterclockwise) 
  // x:x坐标; y:y坐标；r:半径；
  // sAngle: 起始角（弧度）；eAngle:结束角（弧度）；counterclockwise: false=顺时针 | true=逆时针
  ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
}

//碰撞函数,返回bolean值
function collision(obj1, obj2) {
  var r1 = obj1.r,
    r2 = obj2.r;
  var dis = (obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y)
  if (dis < (r1 + r2) * (r1 + r2)) {
    audioEat.stop();
    audioEat.play();
    point++;
    return true;
  } else return false;
}
// 碰到屏幕边界
function JudgeStared() {
  if (snakeHead.x < 0 || snakeHead.x > windowWidth || snakeHead.y < 0 || snakeHead.y > windowHeight) started = false;
}
// 触摸结束 改变蛇头 方向
wx.onTouchEnd(function (res) {
  snakeHead.snakeDirection = direction;
})

wx.onTouchMove(function (res) {
  moveX = res.changedTouches[0].clientX // 重新判断当前触摸点x坐标
  moveY = res.changedTouches[0].clientY // 重新判断当前触摸点y坐标
  dx = moveX - startX;
  dy = moveY - startY;
  // 不容许 转向 180度
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      direction = direction == "left" ? direction : "right"
    } else if (dx < 0) {
      direction = direction == "right" ? direction : "left"
    };
  } else if (Math.abs(dx) < Math.abs(dy)) {
    if (dy > 0) {
      direction = direction == "top" ? direction : "buttom"
    } else if (dy < 0) {
      direction = direction == "buttom" ? direction : "top"
    };
  }
})

wx.onTouchStart(function (res) {
  startX = res.changedTouches[0].clientX // 重新判断当前触摸点x坐标
  startY = res.changedTouches[0].clientY // 重新判断当前触摸点y坐标
})

//创建食物对象
//food构造函数
function Food() {
  this.x = parseInt(Math.random() * windowWidth); // 食物x坐标
  this.y = parseInt(Math.random() * windowHeight); // 食物y坐标
  this.r = parseInt(Math.random() * 10 + 10); // 食物半径
  this.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
  //重新随机位置和颜色
  this.reset = function () {
    this.x = parseInt(Math.random() * windowWidth);
    this.y = parseInt(Math.random() * windowHeight);
    this.r = parseInt(Math.random() * 10 + 10);
    this.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
  }
}
//创建食物对象数组
function makeFoods() {
  for (var i = 0; i < 15; i++) {
    //push20个食物对象
    foods.push(new Food());
  }
  console.log('2:makeFoods()', foods)
}

//获取屏幕宽高并且初始化食物对象,蛇身对象
function window() {
  console.log('1:window()')
  wx.getSystemInfo({
    success(res) {
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
      canvas.width = windowWidth;
      canvas.height = windowHeight;
    }
  });

  makeFoods(); //初始化20个食物
  //绘制食物
  for (var i = 0; i < foods.length; i++) {
    draw(foods[i]);
  }
  // snakeBody.push({
  //   x: snakeHead.x,
  //   y: snakeHead.y,
  //   r: snakeHead.r,
  //   color: "#708090"
  // });
  start();
}

//动画函数
function animation() {
  console.log('移动速度：', timeLevel[level])
  //添加新的身体
  snakeBody.push({
    x: snakeHead.x,
    y: snakeHead.y,
    r: snakeHead.r,
    color: "#708090"
  });

  //边界
  // if (snakeHead.x > windowWidth) snakeHead.snakeDirection = "left";
  // if (snakeHead.x <= 0) snakeHead.snakeDirection = "right";
  // if (snakeHead.y <= 0) snakeHead.snakeDirection = "buttom";
  // if (snakeHead.y > windowHeight) snakeHead.snakeDirection = "top";

  //判定方向
  switch (snakeHead.snakeDirection) {
    case 'top':
      snakeHead.y -= 2 * snakeHead.r;
      snakeHead.deg = -Math.PI / 2;
      break;
    case 'buttom':
      snakeHead.y += 2 * snakeHead.r;
      snakeHead.deg = Math.PI / 2;
      break;
    case 'left':
      snakeHead.x -= 2 * snakeHead.r;
      snakeHead.deg = Math.PI;
      break;
    case 'right':
      snakeHead.x += 2 * snakeHead.r;
      snakeHead.deg = 0;
      break;
  }
  //判定是否触壁
  JudgeStared();
  //检验碰撞，移动食物
  for (var i = 0; i < foods.length; i++) {
    isCollision = collision(snakeHead, foods[i]);
    //碰撞则重新绘制
    //发生碰撞
    if (isCollision) {
      foods[i].reset();
      break;
    }
  }
  //检验碰撞，自己身体 snakeBody
  for (var i = 0; i < snakeBody.length; i++) {
    let isCollision1 = collision(snakeHead, snakeBody[i]);
    //碰撞则重新绘制
    //发生碰撞
    if (isCollision1) {
      started = false
    }
  }
  //开始绘制
  //绘制食物
  ctx.save();
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  ctx.fillStyle = "#8A2BE2";
  ctx.fillRect(0, 0, windowWidth, windowHeight);
  for (var i = 0; i < foods.length; i++) {
    draw(foods[i]);
  }

  //绘制身体
  //没有碰撞食物则移除最后一节身体(下标为0，cover掉)
  //否则不做移除，长度增加，改isCollision为false表示未碰撞
  if (!isCollision) {
    snakeBody.shift();
  } else {
    // 控制第几关 最多三关
    if (snakeBody.length / 5 >= level + 1) {
      level = Math.min(Math.ceil(snakeBody.length / 5), 4)
      setInt()
    }
    isCollision = false;
  }
  //绘制身体数组
  for (var i = 0; i < snakeBody.length; i++) {
    draw(snakeBody[i]);
  }
  //绘制蛇头
  snakeHead.drawHead();
  //绘制得分
  ctx.save();
  ctx.fillStyle = '#B0C4DE';
  ctx.font = "normal 20px 幼圆";
  ctx.fillText('当前得分:' + point, 135, 220);
  ctx.fillText('第' + (level+1)+'关', 150, 200);
  ctx.restore();
  if (!started) end();
}

function end() {
  clearInterval(timer); //清除定时器
  audioDie.play(); //死亡语音
  audioBackground.stop(); //背景音乐
  ctx.save();
  ctx.drawImage(imageStart, 0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "#8A2BE2";
  ctx.fillRect(windowWidth * 5 / 7, 0, windowWidth * 2 / 7, windowHeight * 1 / 10);
  ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2, false);
  ctx.fillStyle = "#6495ED";
  ctx.fill();
  ctx.fillStyle = '#FF7F50';
  ctx.font = "normal 20px 幼圆";
  ctx.fillText('.游戏结束.', canvas.width / 2 - 50, canvas.height / 2 - 25);
  ctx.fillText('您的得分是' + point + "分", canvas.width / 2 - 60, canvas.height / 2);
  ctx.fillText('->点击屏幕重新开始<-', canvas.width / 2 - 100, canvas.height / 2 + 25);
  ctx.restore();
  //重置参数
  level = point = 0;
  snakeHead.x = 100;
  snakeHead.y = 100;
  snakeHead.snakeDirection = "right";
  direction = 'right';
  started = false;
  snakeBody.length = 0;
  wx.onTouchStart(function (res) {
    if (!started) {
      start();
    }
  })
}

function start() {
  console.log('4:start')

  function r() {
    ctx.clearRect(0, 0, windowWidth, windowHeight); // 清除画布
    ctx.drawImage(imageStart, 0, 0, canvas.width, canvas.height); // 画图片 背景图
    ctx.beginPath();
    ctx.fillStyle = "#8A2BE2";
    ctx.fillRect(windowWidth * 5 / 7, 0, windowWidth * 2 / 7, windowHeight * 1 / 10);
    ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2, false);
    ctx.fillStyle = "#6495ED"; // 中间圆圈（显示文字） 背景色
    ctx.fill();

    ctx.fillStyle = '#FF7F50'; // 中间文字 颜色
    ctx.font = "normal 20px 幼圆";
    ctx.fillText('<贪吃小虫>', canvas.width / 2 - 50, canvas.height / 2 - 30);
    ctx.fillText('->点击屏幕开始<-', canvas.width / 2 - 75, canvas.height / 2 + 20);

    audioBackground.loop = true; // 背景音乐 循环播放
    audioBackground.play(); // 背景音乐 循环播放
    //调用定时器
    if (stopped) //来源后台
    {
      audioBackground.play()
      // audioStart.play();
      started = true;
      stopped = false;
      setInt()
      ctx.clearRect(0, 0, windowWidth, windowHeight);
    } else {
      wx.onTouchStart(function (res) {
        if (!started) {
          audioStart.play();
          started = true;
          setInt()
          ctx.clearRect(0, 0, windowWidth, windowHeight);
        }
      })
    }
  }
  if (imageStart.complete) {
    r()
  } else {
    imageStart.onload = function () {
      console.log('5:imageStart.onload')
      r()
    }
  }
}

function setInt() {
  clearInterval(timer);
  timer = setInterval(animation, timeLevel[level]);
}
//函数调用部分......................................
window();
//前台
wx.onShow(function () {
  console.log('3:onShow')
  start();
})

wx.onHide(function () {
  clearInterval(timer); //清除定时器，暂停
  // started=false;//停止运行
  stopped = true; //切后台
  audioBackground.stop();
})
wx.showShareMenu({
  withShareTicket: true
})