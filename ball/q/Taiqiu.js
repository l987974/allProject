function Vector(a, b) {
  this.x = a || 0
  this.y = b || 0
}
Vector.prototype.reset = function (a, b) {
  this.x = a
  this.y = b
}
Vector.prototype.getClone = function () {
  return new Vector(this.x, this.y)
}
Vector.prototype.cut = function (a) {
  this.setLength(Math.min(a, this.getLength()))
}
Vector.prototype.cutNew = function (a) {
  var a = Math.min(a, this.getLength()),
    b = this.getClone()
  b.setLength(a)
  return b
}
Vector.prototype.equals = function (a) {
  return this.x == a.x && this.y == a.y
}
Vector.prototype.plus = function (a) {
  this.x += a.x
  this.y += a.y
}
Vector.prototype.plusNew = function (a) {
  return new Vector(this.x + a.x, this.y + a.y)
}
Vector.prototype.minus = function (a) {
  this.x -= a.x
  this.y -= a.y
}
Vector.prototype.minusNew = function (a) {
  return new Vector(this.x - a.x, this.y - a.y)
}
Vector.prototype.negate = function () {
  this.x = -this.x
  this.y = -this.y
}
Vector.prototype.negateNew = function () {
  return new Vector(-this.x, -this.y)
}
Vector.prototype.scale = function (a) {
  this.x *= a
  this.y *= a
}
Vector.prototype.scaleNew = function (a) {
  return new Vector(this.x * a, this.y * a)
}
Vector.prototype.getLength = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y)
}
Vector.prototype.setLength = function (a) {
  var b = this.getLength()
  b ? this.scale(a / b) : (this.x = a)
}
Vector.prototype.getAngle = function () {
  return Math.atan2(this.y, this.x)
}
Vector.prototype.setAngle = function (a) {
  var b = this.getLength()
  this.x = b * Math.cos(a)
  this.y = b * Math.sin(a)
}
Vector.prototype.rotate = function () {
  var a, b
  b = arguments
  b.length == 1
    ? ((a = Math.cos(b[0])), (b = Math.sin(b[0])))
    : ((a = b[0]), (b = b[1]))
  var d = this.x * b + this.y * a
  this.x = this.x * a - this.y * b
  this.y = d
}
Vector.prototype.rotateNew = function (a) {
  var b = new Vector(this.x, this.y)
  b.rotate(a)
  return b
}
Vector.prototype.dot = function (a) {
  return this.x * a.x + this.y * a.y
}
Vector.prototype.getNormal = function () {
  return new Vector(-this.y, this.x)
}
Vector.prototype.isPerpTo = function (a) {
  return this.dot(a) == 0
}
Vector.prototype.angleBetween = function (a) {
  a = this.dot(a) / (this.getLength() * a.getLength())
  return Math.acos(a)
}
;(function () {
  function a() {
    for (var a in q)
      f[a] = new Quark.Bitmap({
        image: q[a],
        x: c.offset.x,
        y: c.offset.y,
        eventEnabled: !1,
      })
  }
  function b() {
    a()
    d()
    e()
    c.ui.init()
    g()
    c.initEvent()
    c.initCue()
    c.initLine()
    c.initShotTxt()
    c.initScore()
    c.initWin()
    c.initLose()
    c.loop = c.shoot
    l.update = function () {
      c.frames++
      c.loop()
    }
  }
  function d() {
    var a = Quark.getDOM('container'),
      e = new Quark.DOMContext({ canvas: a })
    canvas = Quark.createDOM('canvas', {
      width: h,
      height: i,
      style: { position: 'absolute' },
    })
    canvasContext = new Quark.CanvasContext({ canvas: canvas })
    a.appendChild(canvas)
    l = c.stage = new Quark.Stage({
      container: a,
      width: h,
      height: i,
      context: e,
    })
    o = new Quark.Timer(1e3 / k)
    o.addListener(l)
    o.addListener(Q.Tween)
    o.start()
    l.addChild(f.table)
    c.initPlayers()
  }
  function g() {
    c.Ball.createBalls()
    var a = (c.point = new Quark.Bitmap({
      image: c.Ball.images[0],
      rect: [0, 0, c.r * 2, c.r * 2],
      regX: c.r,
      regY: c.r,
    }))
    l.addChild(c.point)
    a.alpha = 0.3
    l.step()
    for (var a = 0, e = c.Ball.balls.length; a < e; a++) {
      var n = c.Ball.balls[a]
      n.bitmap.drawable.domDrawable.style.borderRadius = j + 'px'
      n.light.drawable.domDrawable.style.borderRadius = j + 'px'
    }
    c.point.drawable.domDrawable.style.borderRadius = c.r + 'px'
    l.addChild(f.ballRoad)
    l.addChild(f.cue)
    f.ballRoad.y = p.y - 60
    f.ballRoad.x = p.x + 180
    c.xx = f.ballRoad.x + f.ballRoad.width - j - 6
  }
  function e() {
    c.frames = 0
    fpsContainer = Quark.getDOM('fps')
    setInterval(function () {
      fpsContainer.innerHTML = 'FPS:' + c.frames
      c.frames = 0
    }, 1e3)
  }
  var c = Q.use('BallGame'),
    j = (c.r = 14),
    h = 960,
    i = 600,
    k = 60,
    s = (c.params = Quark.getUrlParams()),
    n = (c.mouseR = s.r || Q.supportTouch ? 90 : 0),
    l = c.stage,
    f = (c.bitmaps = {}),
    q = (c.images = {}),
    p = (c.offset = { x: 55, y: 70 })
  c.canShot = !0
  var o
  window.onload = (function (a) {
    var c = new Quark.ImageLoader()
    c.addEventListener('complete', function (a) {
      a.target.removeAllEventListeners()
      for (var c in a.images) q[c] = a.images[c].image
      b()
    })
    c.load(a)
  })([
    { id: 'table', src: 'ball/q/res/table.jpg' },
    { id: 'cue', src: 'ball/q/res/cue.png' },
    { id: 'light', src: 'ball/q/res/light.png' },
    { id: 'ballRoad', src: 'ball/q/res/ballRoad.png' },
    { id: 'player-txt', src: 'ball/q/res/player-txt.png' },
    { id: 'ball1', src: 'ball/q/res/ball1.png' },
    { id: 'ball9', src: 'ball/q/res/ball9.png' },
    { id: 'shot-txt', src: 'ball/q/res/shot-txt.png' },
    { id: 'num', src: 'ball/q/res/number.png' },
    { id: 'win', src: 'ball/q/res/win.png' },
    { id: 'lose', src: 'ball/q/res/lose.png' },
    { id: 'loading', src: 'ball/q/res/loading.gif' },
    { id: 'num1', src: 'ball/q/res/num.png' },
  ])
  c.shoot = function () {
    var a = (c.line.rotation * Math.PI) / 180
    c.point.x = c.mouse.x - n * Math.cos(a)
    c.point.y = c.mouse.y - n * Math.sin(a)
    if (c.isDown && ((c.power += c.powerV), c.power > 27 || c.power < 1))
      c.powerV *= -1
  }
  window.shoot = function (a, c) {
    BallGame.whiteBall.v.reset(a, c)
    BallGame.loop = BallGame.Ball.update
  }
  window.print = function () {
    for (var a = 0; a < BallGame.Ball.balls.length; a++) {
      var c = BallGame.Ball.balls[a]
      console.log(c.x - p.x, c.y - p.y, c.num)
    }
  }
})()
;(function () {
  function a(a, e) {
    this.p1 = a
    this.p2 = e
  }
  var b = (BallGame.lines = []),
    d = [
      [27.1, 50.7, 27.1, 385.5],
      [50.4, 408.9, 399.1, 408.9],
      [446, 408.9, 795, 408.9],
      [818.5, 385.6, 818.5, 50.9],
      [795.1, 27.5, 445.9, 27.5],
      [399.1, 27.5, 50.5, 27.5],
    ]
  BallGame.holePoint = [
    [26, 25],
    [421, 17],
    [817, 23],
    [820, 407],
    [422, 416],
    [26, 408],
  ]
  ;(function () {
    var g, e, c
    g = 0
    for (e = d.length; g < e; g++)
      (c = d[g]),
        (c = new a(
          new Vector(c[0] + BallGame.offset.x, c[1] + BallGame.offset.y),
          new Vector(c[2] + +BallGame.offset.x, c[3] + +BallGame.offset.y)
        )),
        (b[g] = c)
  })()
})()
;(function () {
  var a = Q.use('BallGame')
  a.initCue = function () {
    var b = (a.cue = a.bitmaps.cue),
      d = a.mouse
    b.regY = 15
    b.regX = 0
    b.update = function () {
      this.x = a.whiteBall.x
      this.y = a.whiteBall.y
      var b = Math.atan2(d.y - this.y, d.x - this.x)
      this.rotation = (b / Math.PI) * 180 + 180
      this.x -= (a.power * 3 + 10) * Math.cos(b)
      this.y -= (a.power * 3 + 10) * Math.sin(b)
    }
  }
  a.initLine = function () {
    var b = (a.line = new Quark.Bitmap({
      image: a.Ball.images[0],
      regX: 0,
      width: 1,
      height: 3,
      rect: [16, 16, 1, 3],
    }))
    b.alpha = 0.5
    b.update = function () {
      var b = a.mouse
      this.x = a.whiteBall.x
      this.y = a.whiteBall.y
      var g = b.x - this.x,
        b = b.y - this.y
      this.rotation = (Math.atan2(b, g) / Math.PI) * 180
      this.scaleX = Math.sqrt(g * g + b * b) - a.mouseR
    }
    a.stage.addChild(a.line)
  }
})()
;(function () {
  function a(a, e) {
    var b = Q.createDOM('canvas', { width: 4 * c, height: 4 * c }),
      f = b.getContext('2d')
    f.moveTo(c, c)
    f.fillStyle = a
    f.fillRect(0, 0, 4 * c, 4 * c)
    if (e) {
      f.fillStyle = '#eee'
      if (e > 8)
        f.fillRect(0, 0, 4 * c, c / 3),
          f.fillRect(0, 2 * c - c / 3, 4 * c, (c / 3) * 2),
          f.fillRect(0, 4 * c - c / 3, 4 * c, c / 3),
          f.arc(c + 2 * c, c + 2 * c, (c / 3) * 2, 0, Math.PI * 2),
          f.fill(),
          (f.fillStyle = a),
          (f.textAlign = 'center'),
          (f.textBaseline = 'middle'),
          (f.font = c + 'px/1 Consolas, tahoma, Srial, helvetica, sans-serif'),
          f.fillText(e, 3 * c, 3 * c)
      f.fillStyle = '#eee'
      f.beginPath()
      f.arc(c, c, (c / 3) * 2, 0, Math.PI * 2)
      f.arc(3 * c, 3 * c, (c / 3) * 2, 0, Math.PI * 2)
      f.fill()
      f.fillStyle = a
      f.textAlign = 'center'
      f.textBaseline = 'middle'
      f.font = c + 'px/1 Consolas, tahoma, Srial, helvetica, sans-serif'
      f.fillText(e, c, c)
      f.fillText(e, 3 * c, 3 * c)
    }
    return b.toDataURL()
  }
  function b() {
    for (var a = !0, c = 0, e = i.length; c < e; c++)
      i[c].v.getLength() > 0.01 && (a = !1)
    return a
  }
  function d() {
    var a = !1,
      c = h.type,
      b = h.type.length,
      f = !1
    if (b == 0) e.setBad()
    else {
      for (var d = 0; d < b; d++)
        if (c[d] == 8) {
          e.player.num != 7 ? e.setLose() : e.setWin()
          return
        } else c[d] == 0 && (f = !0)
      for (d = 0; d < b; d++)
        !e.player.type && c[d] != 0
          ? (e.initPlayerType(c[d]),
            f || (e.player.addScore(10), (a = !0)),
            e.player.num++)
          : e.player.type == c[d]
          ? (f || (e.player.addScore(10), (a = !0)), e.player.num++)
          : e.player.next.type == c[d] && e.player.next.num++
      console.log(e.player1.num + ' ' + e.player2.num)
      f
        ? (e.changePlayer(),
          (e.whiteBall.isDown = Q.supportTouch ? !1 : !0),
          (e.whiteBall.visible = !0),
          (e.whiteBall.update = e.Ball.prototype.checkBounds))
        : a
        ? e.setGood()
        : e.setBad()
    }
  }
  function g(a, e) {
    if (!a.isDie && !e.isDie) {
      var b = a.v.getLength(),
        f = e.v.getLength()
      if (
        !(b < 0.1 && f < 0.1) &&
        ((f = a.loc.minusNew(e.loc)), f.getLength() <= 2 * c)
      ) {
        var d = f.getAngle(),
          b = Math.sin(d),
          d = Math.cos(d)
        f.rotate(d, -b)
        a.loc.rotate(d, -b)
        a.v.rotate(d, -b)
        e.loc.rotate(d, -b)
        e.v.rotate(d, -b)
        f = 2 * c - Math.abs(a.loc.x - e.loc.x)
        a.v.x == 0
          ? ((e.loc.x -= e.v.x > 0 ? f : -f),
            (e.loc.y -= (e.v.y * f) / Math.abs(e.v.x)))
          : e.v.x == 0
          ? ((a.loc.x -= a.v.x > 0 ? f : -f),
            (a.loc.y -= (a.v.y * f) / Math.abs(a.v.x)))
          : a.loc.x < e.loc.x
          ? ((a.loc.x -= f * 0.5), (e.loc.x += f * 0.5))
          : ((a.loc.x += f * 0.5), (e.loc.x -= f * 0.5))
        a.loc.rotate(d, b)
        a.v.rotate(d, b)
        e.loc.rotate(d, b)
        e.v.rotate(d, b)
        f = a.loc.minusNew(e.loc)
        d = f.getAngle()
        b = Math.sin(d)
        d = Math.cos(d)
        f.rotate(d, -b)
        a.loc.rotate(d, -b)
        a.v.rotate(d, -b)
        e.loc.rotate(d, -b)
        e.v.rotate(d, -b)
        f = a.v.x
        a.v.x = e.v.x
        e.v.x = f
        a.loc.rotate(d, b)
        a.v.rotate(d, b)
        e.loc.rotate(d, b)
        e.v.rotate(d, b)
      }
    }
  }
  var e = Q.use('BallGame'),
    c = e.r,
    j = e.lines,
    h = (e.Ball = function (a) {
      this.num = 0
      this.v = new Vector()
      this.ry = this.rx = 0
      this.constructor.superClass.constructor.call(this, a)
      this.height = this.width = 32
      this.loc = new Vector(this.x, this.y)
      this.bitmap = new Quark.Bitmap({
        image: k[this.num],
        width: 2 * c,
        height: 2 * c,
        regX: c,
        regY: c,
        x: 16,
        y: 16,
        rect: [0, 0, 2 * c, 2 * c],
        eventEnabled: !1,
      })
      this.light = new Quark.Bitmap({
        image: e.images.light,
        regX: 16,
        regY: 16,
        x: 16,
        y: 16,
        eventEnabled: !1,
      })
      this.init()
    }),
    i = (h.balls = []),
    k = (h.images = [])
  h.scale = 0.99
  Quark.inherit(h, Quark.DisplayObjectContainer)
  h.prototype.init = function () {
    this.addChild(this.bitmap)
    this.addChild(this.light)
    this.type = this.num == 0 ? 0 : this.num < 8 ? 1 : this.num == 8 ? 8 : -1
  }
  h.createBalls = function () {
    for (
      var b = [
          '#ffffff',
          '#E1AE07',
          '#064771',
          '#D7141A',
          '#1E1D63',
          '#E9520B',
          '#0A5326',
          '#900910',
          '#000',
        ],
        d = 0;
      d < 9;
      d++
    )
      (k[d] = new Image()), (k[d].src = a(b[d], d))
    for (d = 0; d < 8; d++)
      (k[d + 9] = new Image()), (k[d + 9].src = a(b[d + 1], d + 9))
    b = Math.sqrt(3) + 0.1
    d = c
    b = [
      0,
      -330,
      0,
      0,
      -d,
      b * d,
      d,
      b * d,
      -2 * d,
      2 * b * d,
      0,
      2 * b * d,
      2 * d,
      2 * b * d,
      -3 * d,
      3 * b * d,
      -d,
      3 * b * d,
      d,
      3 * b * d,
      3 * d,
      3 * b * d,
      -4 * d,
      4 * b * d,
      -2 * d,
      4 * b * d,
      0,
      4 * b * d,
      2 * d,
      4 * b * d,
      4 * d,
      4 * b * d,
    ]
    for (d = 0; d < 16; d++) {
      var g = new h({
        num: d,
        regX: 16,
        regY: 16,
        x: 600 + b[2 * d + 1] + e.offset.x,
        y: 219 + b[2 * d] + e.offset.y,
      })
      h.balls[d] = g
      e.stage.addChild(g)
    }
    e.whiteBall = e.Ball.balls[0]
    e.whiteBall.alpha = 1
    e.stage.addChild(e.whiteBall)
  }
  h.prototype.move = function () {
    this.v.getLength() < 0.1
      ? ((this.v.x = 0), (this.v.y = 0))
      : (this.loc.plus(this.v),
        this.bounce(),
        this.v.scale(h.scale),
        (this.x = this.loc.x),
        (this.y = this.loc.y),
        this.bitmap.setRect([this.rx, this.ry, 2 * c, 2 * c]),
        (this.bitmap.rotation = (this.v.getAngle() * 180) / Math.PI),
        (this.rx -= this.v.getLength()),
        this.checkHole())
  }
  h.prototype.update = h.prototype.move
  h.prototype.checkHole = function () {
    for (var a = e.holePoint, c = 0; c < 6; c++) {
      var b = this.x - a[c][0] - e.offset.x,
        d = this.y - a[c][1] - e.offset.y
      if (b * b + d * d < 500 && !this.isDie) {
        m()
        this.isDie = !0
        this.update = this.inHole
        e.Ball.type.push(this.type)
        console.log(this.num)
        break
      }
    }
  }
  h.prototype.inHole = function () {
    if (this.alpha < 0.1 || this.scaleX < 0.1 || this.scaleY < 0.1) {
      this.update =
        this.num == 0
          ? null
          : function () {
              this.x += 4
              this.bitmap.setRect([this.rx, this.ry, 2 * c, 2 * c])
              this.rx -= 4
              this.bitmap.rotation = 0
              if (this.x > e.xx)
                (this.update = null), (this.x = e.xx), (e.xx = this.x - 2 * c)
            }
      this.v = new Vector()
      this.alpha = this.scaleY = this.scaleX = 1
      if (this.num == 0) this.visible = !1
      this.x = e.bitmaps.ballRoad.x + c
      this.y = e.bitmaps.ballRoad.y + e.bitmaps.ballRoad.height / 2 + 1
    }
    this.scaleX -= 0.07
    this.scaleY -= 0.07
    this.alpha -= 0.07
  }
  h.prototype.bounce = function () {
    minx = e.offset.x + 27 - 0
    miny = e.offset.y + 28 - 0
    maxx = e.offset.x + 818 + 0
    maxy = e.offset.y + 408 + 0
    for (var a = 0, c = j.length; a < c; a++) if (this.checkLine(j[a])) return
    if (
      this.loc.x < minx ||
      this.loc.y < miny ||
      this.loc.x > maxx ||
      (this.loc.y > maxy && !this.isDie)
    )
      (this.isDie = !0),
        (this.update = this.inHole),
        e.Ball.type.push(this.type),
        console.log(this.num + 'aaaaaaaaaaaaaaaaaaaaaaaaa lose')
  }
  h.prototype.touchMove = function () {
    if (e.isDown) this.update = this.checkBounds()
  }
  h.prototype.checkBounds = function () {
    minx = e.offset.x + 27
    miny = e.offset.y + 28
    maxx = e.offset.x + 818
    maxy = e.offset.y + 408
    this.loc.x = e.mouse.x
    this.loc.y = e.mouse.y
    if (this.loc.x < minx + c) this.loc.x = minx + c
    else if (this.loc.x > maxx - c) this.loc.x = maxx - c
    if (this.loc.y < miny + c) this.loc.y = miny + c
    else if (this.loc.y > maxy - c) this.loc.y = maxy - c
    this.x = this.loc.x
    this.y = this.loc.y
    for (var a = 1, b = i.length, d = c * c * 4; a < b; a++) {
      var f = this.loc.x - i[a].loc.x,
        g = this.loc.y - i[a].loc.y
      if (f * f + g * g <= d) {
        this.alpha = 0.5
        if (Q.supportTouch) e.whiteBall.isDown = !1
        return
      }
    }
    this.alpha = 1
    if (
      e.whiteBall.isDown &&
      e.isDown &&
      ((this.update = this.move),
      (this.isDie = !1),
      e.startShoot(),
      !Q.supportTouch)
    )
      e.isDown = !1
  }
  h.prototype.checkLine = function (a) {
    var c = a.p1.minusNew(a.p2).getAngle(),
      b = !1,
      d = Math.cos(c),
      c = Math.sin(c),
      g = e.r
    this.v.getLength() > g && (g = this.v.getLength())
    a.p1.rotate(d, -c)
    a.p2.rotate(d, -c)
    this.loc.rotate(d, -c)
    this.v.rotate(d, -c)
    var h = a.p1.y,
      i = a.p1.x,
      j = a.p2.x
    if (i > j)
      var k = i,
        i = j,
        j = k
    var k = this.loc.y,
      r = this.loc.x
    if (r > i && r < j && k + g > h && k - g < h)
      (this.loc.y = this.v.y > 0 ? h - g : h + g), (this.v.y *= -1), (b = !0)
    a.p1.rotate(d, c)
    a.p2.rotate(d, c)
    this.loc.rotate(d, c)
    this.v.rotate(d, c)
    return b
  }
  h.update = function () {
    if (b()) (e.loop = function () {}), d()
    else {
      var a,
        c,
        h = i.length,
        f,
        j
      a = 0
      for (h = i.length; a < h - 1; a++)
        if (((f = i[a]), f.isDie && f.num != 0)) i.splice(a, 1), h--, a--
        else for (c = a + 1; c < h; c++) (j = i[c]), g(f, j)
    }
  }
})()
;(function () {
  var a = Q.use('BallGame'),
    b = (a.Num = function (a) {
      this.num = 0
      a = a || {}
      b.superClass.constructor.call(this, a)
      this.id = a.id || Q.UIDUtil.createUID('Num')
      if (!this.max) this.max = 1
      this.width = this.max * 20
      this.height = 24
      this.init()
    })
  Q.inherit(b, Q.DisplayObjectContainer)
  b.prototype.init = function () {
    this.rects = [
      [0, 0, 20, 24],
      [20, 0, 20, 24],
      [40, 0, 20, 24],
      [60, 0, 20, 24],
      [80, 0, 20, 24],
      [100, 0, 20, 24],
      [120, 0, 20, 24],
      [140, 0, 20, 24],
      [160, 0, 20, 24],
      [180, 0, 20, 24],
    ]
    for (var b = 0; b < this.max; b++) {
      var g = this.rects[0]
      this.addChild(
        new Q.Bitmap({ image: a.images.num, rect: g, x: (g[2] - 2) * b })
      )
    }
    this.setValue(this.num)
  }
  b.prototype.setValue = function (a) {
    this.num = a
    for (var a = a.toString(), b = this.children.length; a.length < b; )
      a = '0' + a
    for (b -= 1; b >= 0; b--)
      this.getChildAt(b).setRect(this.rects[Number(a.charAt(b))])
  }
})()
;(function () {
  function a(a, g) {
    b.loop = b.Ball.update
    var e = b.Ball.balls[0]
    e.v = new Vector(a - e.loc.x, g - e.loc.y)
    e.v.setLength(b.power)
    b.power = 1
    b.powerV = 0.4
    b.Ball.type = []
    b.cue.visible = !1
    b.line.visible = !1
    b.point.visible = !1
  }
  var b = Q.use('BallGame')
  b.initEvent = function () {
    var d = (b.mouse = { x: 0, y: 0 }),
      g = b.stage
    b.power = 1
    b.powerV = 0.4
    b.isDown = !1
    window.onmousemove = function (a) {
      d.x = a.clientX
      d.y = a.clientY
    }
    window.onmousedown = function (a) {
      b.isDown = !0
      d.x = a.clientX
      d.y = a.clientY
    }
    window.onmouseup = function () {
      if (b.isDown && b.canShot) a(d.x, d.y), (b.canShot = !1)
      b.isDown = !1
    }
    g.container.ontouchstart = function (a) {
      a.preventDefault()
      b.isDown = !0
    }
    g.container.ontouchmove = function (a) {
      a.preventDefault()
      d.x = a.touches[0].clientX
      d.y = a.touches[0].clientY
    }
    g.container.ontouchend = function (e) {
      e.preventDefault()
      if (b.isDown && b.canShot) a(d.x, d.y), (b.canShot = !1)
      if (b.isDown && !b.whiteBall.isDown) b.whiteBall.isDown = !0
      b.isDown = !1
    }
  }
})()
;(function () {
  var a = Q.use('BallGame'),
    b = (a.Player = function (a) {
      this.id = a
      this.type = null
      this.num = this.score = 0
      this.ball = {}
    })
  b.prototype.initType = function (a) {
    this.type = a
  }
  b.prototype.init = function () {
    this.num = this.score = 0
  }
  b.prototype.shot = function (b, g) {
    var e = a.Ball.balls
    e[0].v = b
    e[0].v.setAngle(g)
  }
  a.initPlayers = function () {
    var d = (a.player1 = new b(1)),
      g = (a.player2 = new b(2))
    d.addScore = function (b) {
      this.score += b
      a.score1.setValue(this.score)
    }
    g.addScore = function (b) {
      this.score += b
      a.score2.setValue(this.score)
    }
    d.next = g
    g.next = d
    a.player = d
  }
})()
;(function () {
  var a = Q.use('BallGame')
  ;(a.ui = {}).init = function () {
    var b = a.stage,
      c = a.images,
      d = a.offset.x,
      g = a.offset.y,
      i = (a.boardPlayer1 = new Quark.Bitmap({
        image: c['player-txt'],
        rect: [0, 0, 175, 28],
        eventEnabled: !1,
      })),
      c = (a.boardPlayer2 = new Quark.Bitmap({
        image: c['player-txt'],
        rect: [175, 0, 175, 28],
        eventEnabled: !1,
      }))
    a.playerPos = [d + 120, d + 680]
    i.scaleX = 0.6
    i.scaleY = 0.6
    i.x = d + 20
    i.y = g - 50
    c.scaleX = 0.6
    c.scaleY = 0.6
    c.x = d + 723
    c.y = g - 50
    c.alpha = 0.2
    b.addChild(i)
    b.addChild(c)
    a.bitmaps.ball1.y = g - 50
    a.bitmaps.ball9.y = g - 50
  }
  a.initPlayerType = function (b) {
    a.stage.addChild(a.bitmaps.ball1)
    a.stage.addChild(a.bitmaps.ball9)
    var c = a.player
    b == 1
      ? ((a.bitmaps.ball1.x = a.playerPos[c.id - 1]),
        (a.bitmaps.ball9.x = a.playerPos[c.next.id - 1]),
        (a.player.type = b),
        (a.player.ball = a.bitmaps.ball1),
        (a.player.next.ball = a.bitmaps.ball9),
        (a.player.next.ball.alpha = 0.3),
        (a.player.next.type = -1))
      : ((a.bitmaps.ball9.x = a.playerPos[c.id - 1]),
        (a.bitmaps.ball1.x = a.playerPos[c.next.id - 1]),
        (a.player.ball = a.bitmaps.ball9),
        (a.player.next.ball = a.bitmaps.ball1),
        (a.player.next.ball.alpha = 0.3),
        (a.player.type = b),
        (a.player.next.type = 1))
  }
  a.initScore = function (b) {
    a.Player.score = b
  }
  a.changePlayer = function () {
    a.player == a.player1
      ? ((a.boardPlayer1.alpha = 0.2),
        (a.score1.alpha = 0.2),
        (a.boardPlayer2.alpha = 1),
        (a.score2.alpha = 1),
        (a.player = a.player2))
      : ((a.boardPlayer2.alpha = 0.2),
        (a.score2.alpha = 0.2),
        (a.boardPlayer1.alpha = 1),
        (a.score1.alpha = 1),
        (a.player = a.player1))
    a.player.ball.alpha = 1
    a.player.next.ball.alpha = 0.3
  }
  a.initShotTxt = function () {
    var b = (a.shotTxt = a.bitmaps['shot-txt'])
    a.stage.addChild(b)
    b.x = a.offset.x
    b.y = a.offset.y + 100
    b.alpha = 0
  }
  a.setGood = function () {
    var d = a.shotTxt
    d.setRect([0, 0, 200, 60])
    Q.Tween.to(
      d,
      { x: a.offset.x + 330, alpha: 1 },
      {
        time: 300,
        ease: Q.Easing.Quadratic.EaseIn,
        onComplete: function () {
          Q.Tween.to(
            d,
            { alpha: 0, x: a.offset.x + 800 },
            {
              time: 300,
              delay: 500,
              onComplete: function () {
                d.x = 0
                b()
              },
            }
          )
        },
      }
    )
  }
  a.setBad = function () {
    var d = a.shotTxt
    d.setRect([200, 0, 150, 60])
    Q.Tween.to(
      d,
      { x: a.offset.x + 350, alpha: 1 },
      {
        time: 300,
        ease: Q.Easing.Quadratic.EaseIn,
        onComplete: function () {
          Q.Tween.to(
            d,
            { alpha: 0, x: a.offset.x + 800 },
            {
              time: 300,
              delay: 500,
              onComplete: function () {
                d.x = 0
                a.changePlayer()
                b()
              },
            }
          )
        },
      }
    )
  }
  var b = (a.startShoot = function () {
    a.canShot = !0
    a.loop = a.shoot
    a.cue.visible = !0
    a.line.visible = !0
    a.point.visible = !0
  })
  a.initScore = function () {
    a.score1 = new a.Num({ max: 2, x: a.offset.x + 40, y: a.offset.y - 30 })
    a.score2 = new a.Num({ max: 2, x: a.offset.x + 730, y: a.offset.y - 30 })
    a.score2.alpha = 0.2
    a.stage.addChild(a.score1)
    a.stage.addChild(a.score2)
  }
  a.initWin = function () {
    a.winTxt = new Q.Bitmap({
      image: a.images.win,
      x: 0,
      alpha: 0,
      y: a.offset.y + 150,
      eventEnabled: !1,
    })
    a.stage.addChild(a.winTxt)
  }
  a.initLose = function () {
    a.loseTxt = new Q.Bitmap({
      image: a.images.lose,
      x: 0,
      alpha: 0,
      y: a.offset.y + 150,
      eventEnabled: !1,
    })
    a.stage.addChild(a.loseTxt)
  }
  a.setWin = function () {
    Q.Tween.to(
      a.winTxt,
      { x: a.offset.x + 330, alpha: 1 },
      {
        time: 350,
        ease: Q.Easing.Quadratic.EaseIn,
        onComplete: function () {
          a.cue.visible = !1
          a.line.visible = !1
          a.point.visible = !1
          a.loop = function () {}
        },
      }
    )
  }
  a.setLose = function () {
    Q.Tween.to(
      a.loseTxt,
      { x: a.offset.x + 290, alpha: 1 },
      {
        time: 350,
        ease: Q.Easing.Quadratic.EaseIn,
        onComplete: function () {
          a.cue.visible = !1
          a.line.visible = !1
          a.point.visible = !1
          a.loop = function () {}
          for (var b = 0, c = a.Ball.balls.length; b < c; b++)
            setTimeout(
              function (b) {
                a.Ball.balls[b].update = a.Ball.prototype.inHole
              },
              b * 2e3,
              b
            )
        },
      }
    )
  }
  var d = 0,
    g = 5
  window.m = function () {
    Q.Tween.to(
      a.stage,
      { x: g },
      {
        time: 10,
        onComplete: function () {
          Q.Tween.to(
            a.stage,
            { x: -g },
            {
              time: 20,
              onComplete: function () {
                Q.Tween.to(
                  a.stage,
                  { x: 0 },
                  {
                    time: 10,
                    onComplete: function () {
                      d++
                      g -= 1
                      d < 2 ? m() : (d = 0)
                    },
                  }
                )
              },
            }
          )
        },
      }
    )
  }
})()
