TweenLite.set("#circle", {transformOrigin:"50% 50%"})

Draggable.create("#box", {
  type:"x,y",
  bounds:"#container",
  overshootTolerance:0,
  throwProps:true
})

Draggable.create("#circle", {
  type:"rotation",
  throwProps:true
})