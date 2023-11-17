"use strict";(()=>{var g=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),v=1280,Y=720;var N=(o,t,e)=>Math.min(e,Math.max(o,t)),p=o=>o>0?1:o===0?0:-1,x=(o,t)=>t*Math.floor(o/t);var a=class o{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){this.x-=t.x,this.y-=t.y}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new o(this.x,this.y)}setFrom(t){this.x=t.x,this.y=t.y}get magnitude(){return Math.hypot(this.x,this.y)}setMagnitude(t){this.x===0&&this.y==0||this.multiply(t/this.magnitude)}static add(t,e){return new o(t.x+e.x,t.y+e.y)}static diff(t,e){return new o(t.x-e.x,t.y-e.y)}static scale(t,e){return new o(t.x*e,t.y*e)}static sqrDist(t,e){let n=t.x-e.x,i=t.y-e.y;return n*n+i*i}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,n){return new o(t.x*(1-n)+e.x*n,t.y*(1-n)+e.y*n)}};var d=class o{constructor(t,e,n,i){this.x1=t,this.y1=e,this.x2=n,this.y2=i}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new a((this.x1+this.x2)/2,(this.y1+this.y2)/2)}xInRange(t){return this.x1<=t&&t<this.x2}yInRange(t){return this.y1<=t&&t<this.y2}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=N(t.position.x,this.x1,this.x2),n=N(t.position.y,this.y1,this.y2),i=new a(e,n),r=a.diff(t.position,i),c=r.magnitude||1;if(c>=t.radius){let l=a.diff(t.position,this.midpoint),b=this.width/2-Math.abs(l.x),f=this.height/2-Math.abs(l.y);return b<f?new a((b+t.radius)*p(l.x),0):new a(0,(f+t.radius)*p(l.y))}return a.scale(r,(t.radius-c)/c)}draw(t,e=0){t.fillRect(this.x1-e,this.y1-e,this.width+e*2,this.height+e*2)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new o(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,n,i){return new o(t,e,t+n,e+i)}static centerForm(t,e,n,i){return new o(t-n,e-i,t+n,e+i)}static aroundPoint(t,e,n){return new o(t.x-e,t.y-n,t.x+e,t.y+n)}static merged(t){let[e,n,i,r]=t.reduce(([c,l,b,f],y)=>[Math.min(y.x1,c),Math.min(y.y1,l),Math.max(y.x2,b),Math.max(y.y2,f)],[1/0,1/0,-1/0,-1/0]);return new o(e,n,i,r)}},S=class{constructor(t,e,n){this.center=t,this.radius=e,this.cornerCut=n}draw(t){t.fillOctagon(this.center.x,this.center.y,this.radius,this.cornerCut)}intersectsRectangle(t){if(!d.centerForm(this.center.x,this.center.y,this.radius,this.radius).intersectsRectangle(t))return!1;let n=t.midpoint;return Math.abs(n.x-this.center.x)+Math.abs(n.y-this.center.y)<(t.width+t.height)/2+this.radius*2-this.cornerCut}intersectsBy(t){let e=t.midpoint,n=Math.abs(this.center.x-e.x),i=Math.abs(this.center.y-e.y);return Math.max(0,Math.min(this.radius+t.width/2-n,this.radius+t.height/2-i))}collideRectangle(t){let e=t.midpoint,n=Math.abs(this.center.x-e.x),i=Math.abs(this.center.y-e.y);if(n>=this.radius+t.width/2||i>=this.radius+t.height/2)return;let r=(t.width+t.height)/2+this.radius*2-this.cornerCut;if(n+i>=r)return;if(this.intersectsRectangle(t)||console.error("Collision fuck up"),i<this.radius-this.cornerCut+t.height/2){let l=t.width/2+this.radius;this.center.x=e.x+l*p(this.center.x-e.x);return}if(n<this.radius-this.cornerCut+t.width/2){let l=t.height/2+this.radius;this.center.y=e.y+l*p(this.center.y-e.y);return}let c=r-(n+i);this.center.x+=c/2*p(this.center.x-e.x),this.center.y+=c/2*p(this.center.y-e.y)}};var z=Symbol("Up"),q=Symbol("Down"),U=Symbol("Left"),J=Symbol("Right"),j=Symbol("Jump"),Q=Symbol("Interact"),tt=Symbol("Escape"),et=Symbol("Map"),u={Down:q,Escape:tt,Interact:Q,Jump:j,Left:U,Right:J,Up:z,Map:et};var O=130,st=O/1.2,k=class{constructor(t){this.collider=new S(t,14,6),this.velocity=new a(0,0),this.direction=new a(0,-1)}getCursorCell(){let t=a.add(this.direction,this.collider.center);return new a(x(t.x,36),x(t.y,36))}onInput(t,e){t.isForKey(u.Interact)&&e.interactOnCell(this.getCursorCell())}update(t,e,n){let i=e.getHorizontalAxis(),r=e.getVerticalAxis(),c=new a(i,r).multiply(st);this.velocity.add(c.multiply(1));let l=this.velocity.magnitude;this.direction=this.velocity.copy(),this.direction.setMagnitude(36*.9),l>O&&this.velocity.multiply(O/l),c.x===0&&c.y===0&&this.velocity.multiply(.5);let b=this.velocity.copy().multiply(t);this.collider.center.add(b);for(let f of n.blocks)this.collider.collideRectangle(f)}collideWithBlock(){}draw(t){t.setColor("#0008"),t.setLineWidth(2);let e=this.getCursorCell();t.strokeRect(e.x,e.y,36,36),t.setColor("green"),this.collider.draw(t)}};var w=36*2,h=50,T=class{constructor(t,e,n){this.visited=!1;this.backgroundDirty=!0;this.key=t,this.width=e,this.height=n,this.camera=new a(this.width/2,this.height/2),this.player=new k(this.camera.copy()),this.blocks=[];for(let i=0;i<this.width;i+=36)for(let r=0;r<this.height;r+=36)Math.random()<.2&&this.blocks.push(new d(i,r,i+36,r+36));this.blocks.push(new d(-h,-h,this.width/2-w,0),new d(this.width/2+w,-h,this.width+h,0),new d(this.width,-h,this.width+h,this.height/2-w),new d(this.width,this.height/2+w,this.width+h,this.height+h),new d(this.width/2+w,this.height,this.width+h,this.height+h),new d(-h,this.height,this.width/2-w,this.height+h),new d(-h,this.height/2+w,0,this.height+h),new d(-h,-h,0,this.height/2-w))}start(){this.visited=!0}update(t,e){this.player.update(t,e,this)}onInput(t){this.player.onInput(t,this)}interactOnCell(t){let e=-1;for(let n=0;n<this.blocks.length;n++){let i=this.blocks[n];if(i.x1===t.x&&i.y1===t.y&&i.width===36&&i.height===36){e=n;break}}if(e===-1){let n=d.widthForm(t.x,t.y,36,36);this.player.collider.intersectsBy(n)<5&&(this.backgroundDirty=!0,this.blocks.push(n))}else this.backgroundDirty=!0,this.blocks.splice(e,1)}draw(t){if(t.setCamera(this.camera.copy().add(new a(h,h))),this.backgroundDirty){this.backgroundDirty=!1;let n=t.staticWorldCanvas;n.clear(),n.translate(h,h),n.setColor("black"),n.setLineWidth(5),n.strokeRect(0,0,this.width,this.height),n.setColor("white"),n.fillRect(0,0,this.width,this.height),n.setColor("gray"),this.blocks.forEach(i=>i.draw(n)),n.translate(-h,-h)}let e=t.dynamicWorldCanvas;e.clear(),e.translate(h,h),this.player.draw(e),e.translate(-h,-h)}};var D=class{constructor(t){this.gameModeManager=t,this.currentRoom=new T("abc",x(900,2*36),x(600,2*36)),this.startLevel(this.currentRoom)}startLevel(t){this.currentRoom=t,t.start()}onStart(){this.currentRoom.start()}update(t,e){this.currentRoom?.update(t,e)}onInput(t){this.currentRoom?.onInput(t)}draw(t){this.currentRoom?.draw(t)}};var rt=["horizontal-movement","vertical-movement","map-c","exit-c","zoom-c"],V=class{constructor(){this.playMode=new D(this),this.currentMode=this.playMode,this.playMode.onStart()}update(t,e){this.currentMode.update(t,e)}switchToMode(t){this.currentMode=t,t.onStart()}onInput(t){!1||this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}enableSections(t){if(g){for(let e of rt)document.getElementById(e)?.classList.add("hidden");for(let e of t)document.getElementById(e)?.classList.remove("hidden")}}};var X={" ":u.Jump,Escape:u.Escape,KeyW:u.Up,KeyA:u.Left,KeyS:u.Down,KeyD:u.Right,KeyE:u.Interact,KeyM:u.Map};function _(o){return window.TouchEvent&&o instanceof TouchEvent}var K=class o{constructor(t,e,n=!1,i=!1){this.keyMap=t,this.mousePosition=e,this.leftClicking=n,this.rightClicking=i}getHorizontalAxis(){return+!!this.keyMap[u.Right]-+!!this.keyMap[u.Left]}getVerticalAxis(){return+!!this.keyMap[u.Down]-+!!this.keyMap[u.Up]}isPressed(t){return!!this.keyMap[t]}isLeftClicking(){return this.leftClicking}isRightClicking(){return this.rightClicking}static empty(){return new o({},new a(0,0))}},I=class{constructor(){}isForKey(t){return!1}isClick(){return!1}isScroll(){return!1}},B=class extends I{constructor(e){super();this.input=e}isForKey(e){return e===this.input}},L=class extends I{constructor(e,n){super();this.position=e,this.isRight=n}isClick(){return!0}isRightClick(){return this.isRight}},E=class extends I{constructor(e,n){super();this.delta=e,this.discrete=!!n}isScroll(){return!0}},A=class{constructor(t){this.leftClicking=!1,this.rightClicking=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new a(0,0),this.canvas=document.getElementById("canvas")}init(){let t=n=>{this.listener&&this.listener(new B(n))};document.addEventListener("keydown",n=>{let i=n.code;if(n.repeat)return;let r=X[i];r&&(this.isButtonDown[r]=!0,t(r))}),document.addEventListener("keyup",n=>{let i=n.code,r=X[i];r&&(this.isButtonDown[r]=!1)}),this.canvas.addEventListener(g?"touchmove":"mousemove",n=>{this.mousePosition=this.toCanvasPosition(n)}),this.canvas.addEventListener(g?"touchstart":"mousedown",n=>{g&&n.preventDefault(),this.mousePosition=this.toCanvasPosition(n);let i=_(n)||n instanceof MouseEvent&&n.button===0,r=n instanceof MouseEvent&&n.button===2;i?(this.listener?.(new L(this.mousePosition,!1)),this.leftClicking=!0):r&&(this.listener?.(new L(this.mousePosition,!0)),this.rightClicking=!0)}),this.canvas.addEventListener(g?"touchend":"mouseup",n=>{let i=_(n)||n instanceof MouseEvent&&n.button===0,r=n instanceof MouseEvent&&n.button===2;i?this.leftClicking=!1:r&&(this.rightClicking=!1)}),this.canvas.addEventListener("contextmenu",n=>{n.preventDefault()}),this.canvas.addEventListener(g?"touchend":"mouseleave",()=>{this.leftClicking=!1,this.rightClicking=!1}),this.canvas.addEventListener("wheel",n=>{this.listener?.(new E(n.deltaY))});let e=(n,i)=>{let r=document.getElementById(n);r&&(r.addEventListener("touchstart",c=>{c.preventDefault(),typeof i=="function"?this.listener?.(i()):(this.isButtonDown[i]=!0,t(i))}),r.addEventListener("touchcancel",c=>{c.preventDefault(),typeof i=="function"||(this.isButtonDown[i]=!1)}),r.addEventListener("touchend",c=>{c.preventDefault(),typeof i=="function"||(this.isButtonDown[i]=!1)}))};e("left",u.Left),e("right",u.Right),e("jump",u.Jump),e("down",u.Down),e("map",u.Map),e("exit",u.Escape),e("zoom-in",()=>new E(1,!0)),e("zoom-out",()=>new E(-1,!0))}toCanvasPosition(t){let e=_(t)?t.touches.item(0)||{clientX:0,clientY:0}:t;return a.scale(new a(e.clientX-this.canvas.offsetLeft+window.scrollX,e.clientY-this.canvas.offsetTop+window.scrollY),this.canvas.width/this.canvas.clientWidth*v/v)}getInputState(){return new K(this.isButtonDown,this.mousePosition,this.leftClicking,this.rightClicking)}};var ot="0",P=(o,t)=>o.toString(16).padStart(t,ot),$=(o,t,e,n=255)=>`#${P(o,2)}${P(t,2)}${P(e,2)}${P(n,2)}`,Z=(o,t,e,n=1)=>`hsla(${o},${Math.floor(t*100)}%,${Math.floor(e*100)}%,${n})`;var s=Symbol("ctx"),R=Symbol("canvas"),M=class o{static{R,s}constructor(t){this[R]=t;let e=t.getContext("2d");if(!e)throw Error("Unable to get 2d context");e.imageSmoothingEnabled=!1,this[s]=e,this[s].fillStyle="black",this[s].strokeStyle="black",this.width=this[R].width,this.height=this[R].height}fillRect(t,e,n,i){this[s].fillRect(t,e,n,i)}clear(){this[s].clearRect(0,0,this.width,this.height)}strokeRect(t,e,n,i){this[s].strokeRect(t,e,n,i)}strokeRectInset(t,e,n,i,r){this.strokeRect(t+r,e+r,n-r*2,i-r*2)}fillEllipse(t,e,n,i){this[s].beginPath(),this[s].ellipse(t,e,n,i,0,0,2*Math.PI),this[s].fill()}fillTriangle(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e+i),this[s].lineTo(t+n,e+i),this[s].lineTo(t+n/2,e),this[s].fill()}strokeEllipse(t,e,n,i){this[s].beginPath(),this[s].ellipse(t,e,n,i,0,0,2*Math.PI),this[s].stroke()}fillDiamond(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e-i),this[s].lineTo(t+n,e),this[s].lineTo(t,e+i),this[s].lineTo(t-n,e),this[s].lineTo(t,e-i),this[s].fill()}fillOctagon(t,e,n,i){let r=n-i;this[s].beginPath(),this[s].moveTo(t-r,e-n),this[s].lineTo(t+r,e-n),this[s].lineTo(t+n,e-r),this[s].lineTo(t+n,e+r),this[s].lineTo(t+r,e+n),this[s].lineTo(t-r,e+n),this[s].lineTo(t-n,e+r),this[s].lineTo(t-n,e-r),this[s].lineTo(t-r,e-n),this[s].fill()}outerCircleCorner(t,e,n,i){this[s].beginPath(),this[s].arc(t,e,n,i,i+Math.PI/2);let r=i+Math.PI/4;this[s].lineTo(t+p(Math.cos(r))*n,e+p(Math.sin(r))*n),this[s].fill()}drawLine(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e),this[s].lineTo(n,i),this[s].stroke()}drawQuadratic(t,e,n,i,r,c){this[s].beginPath(),this[s].moveTo(t,e),this[s].quadraticCurveTo(r,c,n,i),this[s].stroke()}scale(t,e){this[s].scale(t,e)}translate(t,e){this[s].translate(t,e)}translateCenterTo(t,e){this[s].translate(-t+this.width/2,-e+this.height/2)}setLineWidth(t){this[s].lineWidth=t}get lineWidth(){return this[s].lineWidth}setLineDash(t){this[s].setLineDash(t)}setColor(t){t!==this[s].fillStyle&&(this[s].fillStyle=t,this[s].strokeStyle=t)}setColorRGB(t,e,n,i=255){this.setColor($(t,e,n,i))}setColorHSLA(t,e,n,i=1){this.setColor(Z(t,e,n,i))}createGradient(t,e,n,i){return this[s].createLinearGradient(t,e,n,i)}createRadialGradient(t,e,n,i,r,c){return this[s].createRadialGradient(t,e,n,i,r,c)}saveTransform(){this[s].save()}restoreTransform(){this[s].restore()}drawImage(t,e,n,i,r,c,l,b,f){let y;if(t instanceof o)y=t[R];else if(t instanceof Image){if(!t.complete)return;y=t}else throw Error("Drawing something unmanageable");this[s].drawImage(y,e,n,i,r,c,l,b,f)}static fromId(t){let e=document.getElementById(t);if(!e||!(e instanceof HTMLCanvasElement))throw new Error(`Could not find canvas with id: "${t}"`);return new o(e)}static fromScratch(t,e){let n=document.createElement("canvas");return n.width=t,n.height=e,new o(n)}};var C=Symbol("real-canvas");function at(){let o=document.getElementById("canvas");if(!(o instanceof HTMLCanvasElement))throw new Error("Could not find canvas");return o.width=v,o.height=Y,o}var H=class o{static{C}constructor(){let t=new M(at());if(!(t instanceof M))throw Error("No canvas found!");this[C]=t,this.staticWorldCanvas=M.fromScratch(1280*3,720*4),this.dynamicWorldCanvas=M.fromScratch(1280*3,720*4),this.camera=new a(0,0)}setCamera(t){this.camera=t}drawCanvas(t,e,n=1280,i=720){this[C].drawImage(t,e.x-n/2,e.y-i/2,n,i,0,0,this[C].width,this[C].height)}drawToScreen(){this[C].clear(),this.drawCanvas(this.staticWorldCanvas,this.camera),this.drawCanvas(this.dynamicWorldCanvas,this.camera)}static{this.instance=null}static getInstance(){return this.instance?this.instance:new o}};var ht=1/20,F=class{constructor(){this.lastFrameTime=0;this.gameModeManager=new V,this.inputManager=new A(t=>this.onInput(t)),this.screenManager=new H,this.lastFrameTime=performance.now()}start(){this.inputManager.init(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,ht);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},ct=()=>{new F().start()};window.onload=()=>{ct()};})();
//# sourceMappingURL=index.js.map
