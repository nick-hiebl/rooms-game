"use strict";(()=>{var y=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),x=1280,W=720;var P=(r,t,e)=>Math.min(e,Math.max(r,t)),d=r=>r>0?1:r===0?0:-1,H=(r,t)=>t*Math.floor(r/t);var a=class r{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){this.x-=t.x,this.y-=t.y}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new r(this.x,this.y)}setFrom(t){this.x=t.x,this.y=t.y}get magnitude(){return Math.hypot(this.x,this.y)}setMagnitude(t){this.x===0&&this.y==0||this.multiply(t/this.magnitude)}static add(t,e){return new r(t.x+e.x,t.y+e.y)}static diff(t,e){return new r(t.x-e.x,t.y-e.y)}static scale(t,e){return new r(t.x*e,t.y*e)}static sqrDist(t,e){let n=t.x-e.x,i=t.y-e.y;return n*n+i*i}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,n){return new r(t.x*(1-n)+e.x*n,t.y*(1-n)+e.y*n)}};var l=class r{constructor(t,e,n,i){this.x1=t,this.y1=e,this.x2=n,this.y2=i}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new a((this.x1+this.x2)/2,(this.y1+this.y2)/2)}xInRange(t){return this.x1<=t&&t<this.x2}yInRange(t){return this.y1<=t&&t<this.y2}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=P(t.position.x,this.x1,this.x2),n=P(t.position.y,this.y1,this.y2),i=new a(e,n),o=a.diff(t.position,i),h=o.magnitude||1;if(h>=t.radius){let m=a.diff(t.position,this.midpoint),p=this.width/2-Math.abs(m.x),b=this.height/2-Math.abs(m.y);return p<b?new a((p+t.radius)*d(m.x),0):new a(0,(b+t.radius)*d(m.y))}return a.scale(o,(t.radius-h)/h)}draw(t,e=0){t.fillRect(this.x1-e,this.y1-e,this.width+e*2,this.height+e*2)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new r(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,n,i){return new r(t,e,t+n,e+i)}static centerForm(t,e,n,i){return new r(t-n,e-i,t+n,e+i)}static aroundPoint(t,e,n){return new r(t.x-e,t.y-n,t.x+e,t.y+n)}static merged(t){let[e,n,i,o]=t.reduce(([h,m,p,b],f)=>[Math.min(f.x1,h),Math.min(f.y1,m),Math.max(f.x2,p),Math.max(f.y2,b)],[1/0,1/0,-1/0,-1/0]);return new r(e,n,i,o)}},I=class{constructor(t,e,n){this.center=t,this.radius=e,this.cornerCut=n}draw(t){t.fillOctagon(this.center.x,this.center.y,this.radius,this.cornerCut)}intersectsRectangle(t){if(!l.centerForm(this.center.x,this.center.y,this.radius,this.radius).intersectsRectangle(t))return!1;let n=t.midpoint;return Math.abs(n.x-this.center.x)+Math.abs(n.y-this.center.y)<(t.width+t.height)/2+this.radius*2-this.cornerCut}intersectsBy(t){let e=t.midpoint,n=Math.abs(this.center.x-e.x),i=Math.abs(this.center.y-e.y);return Math.max(0,Math.min(this.radius+t.width/2-n,this.radius+t.height/2-i))}collideRectangle(t){let e=t.midpoint,n=Math.abs(this.center.x-e.x),i=Math.abs(this.center.y-e.y);if(n>=this.radius+t.width/2||i>=this.radius+t.height/2)return;let o=(t.width+t.height)/2+this.radius*2-this.cornerCut;if(n+i>=o)return;if(this.intersectsRectangle(t)||console.error("Collision fuck up"),i<this.radius-this.cornerCut+t.height/2){let m=t.width/2+this.radius;this.center.x=e.x+m*d(this.center.x-e.x);return}if(n<this.radius-this.cornerCut+t.width/2){let m=t.height/2+this.radius;this.center.y=e.y+m*d(this.center.y-e.y);return}let h=o-(n+i);this.center.x+=h/2*d(this.center.x-e.x),this.center.y+=h/2*d(this.center.y-e.y)}};var U=Symbol("Up"),z=Symbol("Down"),q=Symbol("Left"),J=Symbol("Right"),j=Symbol("Jump"),Z=Symbol("Interact"),Q=Symbol("Escape"),tt=Symbol("Map"),c={Down:z,Escape:Q,Interact:Z,Jump:j,Left:q,Right:J,Up:U,Map:tt};var et=18,nt=8,N=130,it=N/1.2,R=class{constructor(t){this.collider=new I(t,et,nt),this.velocity=new a(0,0),this.direction=new a(0,-1)}getCursorCell(){let t=a.add(this.direction,this.collider.center);return new a(H(t.x,50),H(t.y,50))}onInput(t,e){t.isForKey(c.Interact)&&e.interactOnCell(this.getCursorCell())}update(t,e,n){let i=e.getHorizontalAxis(),o=e.getVerticalAxis(),h=new a(i,o).multiply(it);this.velocity.add(h.multiply(1));let m=this.velocity.magnitude;this.direction=this.velocity.copy(),this.direction.setMagnitude(50*.9),m>N&&this.velocity.multiply(N/m),h.x===0&&h.y===0&&this.velocity.multiply(.5);let p=this.velocity.copy().multiply(t);this.collider.center.add(p);for(let b of n.blocks)this.collider.collideRectangle(b)}collideWithBlock(){}draw(t){t.setColor("#0008"),t.setLineWidth(2);let e=this.getCursorCell();t.strokeRect(e.x,e.y,50,50),t.setColor("green"),this.collider.draw(t)}};var g=100,u=50,S=class{constructor(t,e,n){this.visited=!1;this.key=t,this.width=e,this.height=n,this.camera=new a(this.width/2,this.height/2),this.player=new R(this.camera.copy()),this.blocks=[];for(let i=0;i<this.width;i+=50)for(let o=0;o<this.height;o+=50)Math.random()<.2&&this.blocks.push(new l(i,o,i+50,o+50));this.blocks.push(new l(-u,-u,this.width/2-g,0),new l(this.width/2+g,-u,this.width+u,0),new l(this.width,-u,this.width+u,this.height/2-g),new l(this.width,this.height/2+g,this.width+u,this.height+u),new l(this.width/2+g,this.height,this.width+u,this.height+u),new l(-u,this.height,this.width/2-g,this.height+u),new l(-u,this.height/2+g,0,this.height+u),new l(-u,-u,0,this.height/2-g))}start(){this.visited=!0}update(t,e){this.player.update(t,e,this)}onInput(t){this.player.onInput(t,this)}interactOnCell(t){let e=-1;for(let n=0;n<this.blocks.length;n++){let i=this.blocks[n];if(i.x1===t.x&&i.y1===t.y&&i.width===50&&i.height===50){e=n;break}}if(e===-1){let n=l.widthForm(t.x,t.y,50,50);this.player.collider.intersectsBy(n)<5&&this.blocks.push(n)}else this.blocks.splice(e,1)}draw(t){t.setCamera(this.camera.copy().add(new a(u/2,u/2)));let e=t.dynamicWorldCanvas;e.clear(),e.translate(u,u),e.setColor("black"),e.setLineWidth(5),e.strokeRect(0,0,this.width,this.height),e.setColor("white"),e.fillRect(0,0,this.width,this.height),e.setColor("gray"),this.blocks.forEach(n=>n.draw(e)),this.player.draw(e),e.translate(-u,-u)}};var T=class{constructor(t){this.gameModeManager=t,this.currentRoom=new S("abc",900,600),this.startLevel(this.currentRoom)}startLevel(t){this.currentRoom=t,t.start()}onStart(){this.currentRoom.start()}update(t,e){this.currentRoom?.update(t,e)}onInput(t){this.currentRoom?.onInput(t)}draw(t){this.currentRoom?.draw(t)}};var st=["horizontal-movement","vertical-movement","map-c","exit-c","zoom-c"],k=class{constructor(){this.playMode=new T(this),this.currentMode=this.playMode,this.playMode.onStart()}update(t,e){this.currentMode.update(t,e)}switchToMode(t){this.currentMode=t,t.onStart()}onInput(t){!1||this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}enableSections(t){if(y){for(let e of st)document.getElementById(e)?.classList.add("hidden");for(let e of t)document.getElementById(e)?.classList.remove("hidden")}}};var F={" ":c.Jump,escape:c.Escape,esc:c.Escape,Escape:c.Escape,Esc:c.Escape,w:c.Up,a:c.Left,s:c.Down,d:c.Right,e:c.Interact,m:c.Map};function O(r){return window.TouchEvent&&r instanceof TouchEvent}var B=class r{constructor(t,e,n=!1,i=!1){this.keyMap=t,this.mousePosition=e,this.leftClicking=n,this.rightClicking=i}getHorizontalAxis(){return+!!this.keyMap[c.Right]-+!!this.keyMap[c.Left]}getVerticalAxis(){return+!!this.keyMap[c.Down]-+!!this.keyMap[c.Up]}isPressed(t){return!!this.keyMap[t]}isLeftClicking(){return this.leftClicking}isRightClicking(){return this.rightClicking}static empty(){return new r({},new a(0,0))}},v=class{constructor(){}isForKey(t){return!1}isClick(){return!1}isScroll(){return!1}},_=class extends v{constructor(e){super();this.input=e}isForKey(e){return e===this.input}},V=class extends v{constructor(e,n){super();this.position=e,this.isRight=n}isClick(){return!0}isRightClick(){return this.isRight}},C=class extends v{constructor(e,n){super();this.delta=e,this.discrete=!!n}isScroll(){return!0}},L=class{constructor(t){this.leftClicking=!1,this.rightClicking=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new a(0,0),this.canvas=document.getElementById("canvas")}init(){let t=n=>{this.listener&&this.listener(new _(n))};document.addEventListener("keydown",n=>{if(n.repeat)return;let i=F[n.key];i&&(this.isButtonDown[i]=!0,t(i))}),document.addEventListener("keyup",n=>{let i=F[n.key];i&&(this.isButtonDown[i]=!1)}),this.canvas.addEventListener(y?"touchmove":"mousemove",n=>{this.mousePosition=this.toCanvasPosition(n)}),this.canvas.addEventListener(y?"touchstart":"mousedown",n=>{y&&n.preventDefault(),this.mousePosition=this.toCanvasPosition(n);let i=O(n)||n instanceof MouseEvent&&n.button===0,o=n instanceof MouseEvent&&n.button===2;i?(this.listener?.(new V(this.mousePosition,!1)),this.leftClicking=!0):o&&(this.listener?.(new V(this.mousePosition,!0)),this.rightClicking=!0)}),this.canvas.addEventListener(y?"touchend":"mouseup",n=>{let i=O(n)||n instanceof MouseEvent&&n.button===0,o=n instanceof MouseEvent&&n.button===2;i?this.leftClicking=!1:o&&(this.rightClicking=!1)}),this.canvas.addEventListener("contextmenu",n=>{n.preventDefault()}),this.canvas.addEventListener(y?"touchend":"mouseleave",()=>{this.leftClicking=!1,this.rightClicking=!1}),this.canvas.addEventListener("wheel",n=>{this.listener?.(new C(n.deltaY))});let e=(n,i)=>{let o=document.getElementById(n);o&&(o.addEventListener("touchstart",h=>{h.preventDefault(),typeof i=="function"?this.listener?.(i()):(this.isButtonDown[i]=!0,t(i))}),o.addEventListener("touchcancel",h=>{h.preventDefault(),typeof i=="function"||(this.isButtonDown[i]=!1)}),o.addEventListener("touchend",h=>{h.preventDefault(),typeof i=="function"||(this.isButtonDown[i]=!1)}))};e("left",c.Left),e("right",c.Right),e("jump",c.Jump),e("down",c.Down),e("map",c.Map),e("exit",c.Escape),e("zoom-in",()=>new C(1,!0)),e("zoom-out",()=>new C(-1,!0))}toCanvasPosition(t){let e=O(t)?t.touches.item(0)||{clientX:0,clientY:0}:t;return a.scale(new a(e.clientX-this.canvas.offsetLeft+window.scrollX,e.clientY-this.canvas.offsetTop+window.scrollY),this.canvas.width/this.canvas.clientWidth*x/x)}getInputState(){return new B(this.isButtonDown,this.mousePosition,this.leftClicking,this.rightClicking)}};var rt="0",D=(r,t)=>r.toString(16).padStart(t,rt),G=(r,t,e,n=255)=>`#${D(r,2)}${D(t,2)}${D(e,2)}${D(n,2)}`,Y=(r,t,e,n=1)=>`hsla(${r},${Math.floor(t*100)}%,${Math.floor(e*100)}%,${n})`;var s=Symbol("ctx"),E=Symbol("canvas"),w=class r{static{E,s}constructor(t){this[E]=t;let e=t.getContext("2d");if(!e)throw Error("Unable to get 2d context");e.imageSmoothingEnabled=!1,this[s]=e,this[s].fillStyle="black",this[s].strokeStyle="black",this.width=this[E].width,this.height=this[E].height}fillRect(t,e,n,i){this[s].fillRect(t,e,n,i)}clear(){this[s].clearRect(0,0,this.width,this.height)}strokeRect(t,e,n,i){this[s].strokeRect(t,e,n,i)}strokeRectInset(t,e,n,i,o){this.strokeRect(t+o,e+o,n-o*2,i-o*2)}fillEllipse(t,e,n,i){this[s].beginPath(),this[s].ellipse(t,e,n,i,0,0,2*Math.PI),this[s].fill()}fillTriangle(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e+i),this[s].lineTo(t+n,e+i),this[s].lineTo(t+n/2,e),this[s].fill()}strokeEllipse(t,e,n,i){this[s].beginPath(),this[s].ellipse(t,e,n,i,0,0,2*Math.PI),this[s].stroke()}fillDiamond(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e-i),this[s].lineTo(t+n,e),this[s].lineTo(t,e+i),this[s].lineTo(t-n,e),this[s].lineTo(t,e-i),this[s].fill()}fillOctagon(t,e,n,i){let o=n-i;this[s].beginPath(),this[s].moveTo(t-o,e-n),this[s].lineTo(t+o,e-n),this[s].lineTo(t+n,e-o),this[s].lineTo(t+n,e+o),this[s].lineTo(t+o,e+n),this[s].lineTo(t-o,e+n),this[s].lineTo(t-n,e+o),this[s].lineTo(t-n,e-o),this[s].lineTo(t-o,e-n),this[s].fill()}outerCircleCorner(t,e,n,i){this[s].beginPath(),this[s].arc(t,e,n,i,i+Math.PI/2);let o=i+Math.PI/4;this[s].lineTo(t+d(Math.cos(o))*n,e+d(Math.sin(o))*n),this[s].fill()}drawLine(t,e,n,i){this[s].beginPath(),this[s].moveTo(t,e),this[s].lineTo(n,i),this[s].stroke()}drawQuadratic(t,e,n,i,o,h){this[s].beginPath(),this[s].moveTo(t,e),this[s].quadraticCurveTo(o,h,n,i),this[s].stroke()}scale(t,e){this[s].scale(t,e)}translate(t,e){this[s].translate(t,e)}translateCenterTo(t,e){this[s].translate(-t+this.width/2,-e+this.height/2)}setLineWidth(t){this[s].lineWidth=t}get lineWidth(){return this[s].lineWidth}setLineDash(t){this[s].setLineDash(t)}setColor(t){t!==this[s].fillStyle&&(this[s].fillStyle=t,this[s].strokeStyle=t)}setColorRGB(t,e,n,i=255){this.setColor(G(t,e,n,i))}setColorHSLA(t,e,n,i=1){this.setColor(Y(t,e,n,i))}createGradient(t,e,n,i){return this[s].createLinearGradient(t,e,n,i)}createRadialGradient(t,e,n,i,o,h){return this[s].createRadialGradient(t,e,n,i,o,h)}saveTransform(){this[s].save()}restoreTransform(){this[s].restore()}drawImage(t,e,n,i,o,h,m,p,b){let f;if(t instanceof r)f=t[E];else if(t instanceof Image){if(!t.complete)return;f=t}else throw Error("Drawing something unmanageable");this[s].drawImage(f,e,n,i,o,h,m,p,b)}static fromId(t){let e=document.getElementById(t);if(!e||!(e instanceof HTMLCanvasElement))throw new Error(`Could not find canvas with id: "${t}"`);return new r(e)}static fromScratch(t,e){let n=document.createElement("canvas");return n.width=t,n.height=e,new r(n)}};var M=Symbol("real-canvas");function ot(){let r=document.getElementById("canvas");if(!(r instanceof HTMLCanvasElement))throw new Error("Could not find canvas");return r.width=x,r.height=W,r}var A=class r{static{M}constructor(){let t=new w(ot());if(!(t instanceof w))throw Error("No canvas found!");this[M]=t,this.dynamicWorldCanvas=w.fromScratch(1280*3,720*4),this.camera=new a(0,0)}setCamera(t){this.camera=t}drawCanvas(t,e,n=1280,i=720){this[M].drawImage(t,e.x-n/2,e.y-i/2,n,i,0,0,this[M].width,this[M].height)}drawToScreen(){this[M].clear(),this.drawCanvas(this.dynamicWorldCanvas,this.camera)}static{this.instance=null}static getInstance(){return this.instance?this.instance:new r}};var at=1/20,K=class{constructor(){this.lastFrameTime=0;this.gameModeManager=new k,this.inputManager=new L(t=>this.onInput(t)),this.screenManager=new A,this.lastFrameTime=performance.now()}start(){this.inputManager.init(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,at);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},ht=()=>{new K().start()};window.onload=()=>{ht()};})();
//# sourceMappingURL=index.js.map