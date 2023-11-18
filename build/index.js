"use strict";(()=>{var ct=Symbol("Up"),mt=Symbol("Down"),lt=Symbol("Left"),ut=Symbol("Right"),dt=Symbol("Jump"),pt=Symbol("Interact"),ft=Symbol("Escape"),bt=Symbol("Map"),d={Down:mt,Escape:ft,Interact:pt,Jump:dt,Left:lt,Right:ut,Up:ct,Map:bt};var C=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),k=1280,Z=720;var E=(h,t,e)=>Math.min(e,Math.max(h,t)),M=h=>h>0?1:h===0?0:-1,w=(h,t)=>t*Math.floor(h/t);var yt="0",W=(h,t)=>h.toString(16).padStart(t,yt),et=(h,t,e,i=255)=>`#${W(h,2)}${W(t,2)}${W(e,2)}${W(i,2)}`,it=(h,t,e,i=1)=>`hsla(${h},${Math.floor(t*100)}%,${Math.floor(e*100)}%,${i})`;var a=Symbol("ctx"),T=Symbol("canvas"),x=class h{static{T,a}constructor(t){this[T]=t;let e=t.getContext("2d");if(!e)throw Error("Unable to get 2d context");e.imageSmoothingEnabled=!1,this[a]=e,this[a].fillStyle="black",this[a].strokeStyle="black",this.width=this[T].width,this.height=this[T].height}fillRect(t,e,i,o){this[a].fillRect(t,e,i,o)}clear(){this[a].clearRect(0,0,this.width,this.height)}strokeRect(t,e,i,o){this[a].strokeRect(t,e,i,o)}strokeRectInset(t,e,i,o,s){this.strokeRect(t+s,e+s,i-s*2,o-s*2)}fillEllipse(t,e,i,o){this[a].beginPath(),this[a].ellipse(t,e,i,o,0,0,2*Math.PI),this[a].fill()}fillTriangle(t,e,i,o){this[a].beginPath(),this[a].moveTo(t,e+o),this[a].lineTo(t+i,e+o),this[a].lineTo(t+i/2,e),this[a].fill()}strokeEllipse(t,e,i,o){this[a].beginPath(),this[a].ellipse(t,e,i,o,0,0,2*Math.PI),this[a].stroke()}fillDiamond(t,e,i,o){this[a].beginPath(),this[a].moveTo(t,e-o),this[a].lineTo(t+i,e),this[a].lineTo(t,e+o),this[a].lineTo(t-i,e),this[a].lineTo(t,e-o),this[a].fill()}fillOctagon(t,e,i,o){let s=i-o;this[a].beginPath(),this[a].moveTo(t-s,e-i),this[a].lineTo(t+s,e-i),this[a].lineTo(t+i,e-s),this[a].lineTo(t+i,e+s),this[a].lineTo(t+s,e+i),this[a].lineTo(t-s,e+i),this[a].lineTo(t-i,e+s),this[a].lineTo(t-i,e-s),this[a].lineTo(t-s,e-i),this[a].fill()}outerCircleCorner(t,e,i,o){this[a].beginPath(),this[a].arc(t,e,i,o,o+Math.PI/2);let s=o+Math.PI/4;this[a].lineTo(t+M(Math.cos(s))*i,e+M(Math.sin(s))*i),this[a].fill()}drawLine(t,e,i,o){this[a].beginPath(),this[a].moveTo(t,e),this[a].lineTo(i,o),this[a].stroke()}drawQuadratic(t,e,i,o,s,n){this[a].beginPath(),this[a].moveTo(t,e),this[a].quadraticCurveTo(s,n,i,o),this[a].stroke()}scale(t,e){this[a].scale(t,e)}translate(t,e){this[a].translate(t,e)}translateCenterTo(t,e){this[a].translate(-t+this.width/2,-e+this.height/2)}setLineWidth(t){this[a].lineWidth=t}get lineWidth(){return this[a].lineWidth}setLineDash(t){this[a].setLineDash(t)}setColor(t){t!==this[a].fillStyle&&(this[a].fillStyle=t,this[a].strokeStyle=t)}setColorRGB(t,e,i,o=255){this.setColor(et(t,e,i,o))}setColorHSLA(t,e,i,o=1){this.setColor(it(t,e,i,o))}createGradient(t,e,i,o){return this[a].createLinearGradient(t,e,i,o)}createRadialGradient(t,e,i,o,s,n){return this[a].createRadialGradient(t,e,i,o,s,n)}saveTransform(){this[a].save()}restoreTransform(){this[a].restore()}drawImage(t,e,i,o,s,n,c,l,u){let m;if(t instanceof h)m=t[T];else if(t instanceof Image){if(!t.complete)return;m=t}else throw Error("Drawing something unmanageable");this[a].drawImage(m,e,i,o,s,n,c,l,u)}static fromId(t){let e=document.getElementById(t);if(!e||!(e instanceof HTMLCanvasElement))throw new Error(`Could not find canvas with id: "${t}"`);return new h(e)}static fromScratch(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,new h(i)}};var r=class h{constructor(t,e){this.x=t,this.y=e}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){this.x-=t.x,this.y-=t.y}multiply(t){return this.x*=t,this.y*=t,this}copy(){return new h(this.x,this.y)}setFrom(t){this.x=t.x,this.y=t.y}get magnitude(){return Math.hypot(this.x,this.y)}setMagnitude(t){this.x===0&&this.y==0||this.multiply(t/this.magnitude)}static add(t,e){return new h(t.x+e.x,t.y+e.y)}static diff(t,e){return new h(t.x-e.x,t.y-e.y)}static scale(t,e){return new h(t.x*e,t.y*e)}static sqrDist(t,e){let i=t.x-e.x,o=t.y-e.y;return i*i+o*o}static manhattanDist(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static dist(t,e){return Math.hypot(t.x-e.x,t.y-e.y)}static lerp(t,e,i){return new h(t.x*(1-i)+e.x*i,t.y*(1-i)+e.y*i)}};var ot=document.location.toString().includes("localhost"),U=.5,st=.05,wt=.001,rt=[.05,.1,.15,.2,.3,.5],at=rt.slice();at.reverse();var A=60,nt=10,_=class{constructor(t){this.gameModeManager=t,this.playMode=t.playMode,this.cameraPosition=new r(0,0),this.setCameraPos(),this.zoom=U,this.mousePosition=new r(0,0),this.isClicked=!1,this.hoverPosition=new r(0,0),this.canvasW=0,this.canvasH=0,this.roomCanvasMap=new Map,this.drawIcons=[]}setCameraPos(){let t=this.playMode.roomWeb.currentRoom;this.cameraPosition=r.add(this.getRoomPosition(t),new r(t.width/2,t.height/2))}onStart(){this.setCameraPos(),this.mousePosition=new r(0,0),this.isClicked=!1,this.hoverPosition=new r(0,0),this.predrawRooms(),this.drawIcons=this.getIconsToShow()}getIconsToShow(){return[]}predrawRooms(){for(let t of this.playMode.roomWeb.rooms){if(!ot&&!t.visited)continue;let e=this.roomCanvasMap.get(t.key)||x.fromScratch(t.width*1/36*nt,t.height*1/36*nt);t.drawForMap(e),this.roomCanvasMap.set(t.key,e)}}toWorldPosition(t){return r.add(r.scale(t,1/this.zoom),this.cameraPosition)}update(t,e){let i=this.toWorldPosition(e.mousePosition);this.hoverPosition=this.toWorldPosition(e.mousePosition);let o;for(let s of this.drawIcons){if(o){s.isHovered=!1;continue}r.sqrDist(s.position,i)<32?(s.isHovered=!0,o=s):s.isHovered=!1}e.isLeftClicking()&&this.isClicked?this.cameraPosition.subtract(r.diff(i,this.mousePosition)):this.isClicked=!1}onInput(t){if(t.isClick()){let e=this.toWorldPosition(t.position),i=this.positionToRoomIndex(e),o=this.playMode.roomWeb.createRoom(i,2,2);o&&!this.roomCanvasMap.get(o.key)&&this.predrawRooms();let s=t;s.isRightClick()||(this.mousePosition=this.toWorldPosition(s.position),this.isClicked=!0)}else if(t.isScroll()){let e=t;e.discrete?e.delta>0?this.zoom=rt.find(i=>i>this.zoom)||U:this.zoom=at.find(i=>i<this.zoom)||st:this.zoom=E(this.zoom+e.delta*-wt,st,U)}}getRoomPosition(t){let{x:e,y:i}=t.position;return new r(e*864,i*576)}positionToRoomIndex(t){let e=new r(w(t.x,864),w(t.y,576));return new r(e.x/864,e.y/576)}draw(t){let e=this.playMode.roomWeb.currentRoom,i=t.uiCanvas;this.canvasW=i.width,this.canvasH=i.height,i.setColor("black"),i.fillRect(0,0,i.width,i.height),i.saveTransform(),i.translate(i.width/2,i.height/2),i.scale(this.zoom,this.zoom),i.translate(-this.cameraPosition.x,-this.cameraPosition.y);let o=e.player;for(let n of this.playMode.roomWeb.rooms){let c=this.roomCanvasMap.get(n.key);if(!ot&&!n.visited||!c)continue;let l=this.getRoomPosition(n);i.drawImage(c,0,0,c.width,c.height,l.x,l.y,n.width,n.height)}let s=new r(w(this.hoverPosition.x,864),w(this.hoverPosition.y,576));if(i.setColor("#fff6"),i.setLineWidth(4),i.strokeRect(s.x,s.y,864,576),o){let n=this.getRoomPosition(e),c=r.add(n,new r(e.width/2,e.height/2));i.translate(c.x,c.y),i.setLineWidth(8),i.setLineDash([]),i.setColor("white"),i.fillEllipse(0,0,A,A),i.setColor("black"),i.strokeEllipse(0,0,A,A),i.translate(-c.x,-c.y)}i.setColor("pink"),i.fillEllipse(this.hoverPosition.x,this.hoverPosition.y,5,5),i.restoreTransform()}};var R=class{constructor(t,e,i){this.fromKey=t,this.toKey=e,this.direction=i}isExitEvent(){return!0}isOpenMapEvent(){return!1}};var f=class h{constructor(t,e,i,o){this.x1=t,this.y1=e,this.x2=i,this.y2=o}intersectsPoint(t){return this.x1<=t.x&&t.x<=this.x2&&this.y1<=t.y&&t.y<=this.y2}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}get midpoint(){return new r((this.x1+this.x2)/2,(this.y1+this.y2)/2)}xInRange(t){return this.x1<=t&&t<this.x2}yInRange(t){return this.y1<=t&&t<this.y2}intersectsRectangle(t){return t.x1<=this.x2&&this.x1<=t.x2&&t.y1<=this.y2&&this.y1<=t.y2}uncollideCircle(t){let e=E(t.position.x,this.x1,this.x2),i=E(t.position.y,this.y1,this.y2),o=new r(e,i),s=r.diff(t.position,o),n=s.magnitude||1;if(n>=t.radius){let c=r.diff(t.position,this.midpoint),l=this.width/2-Math.abs(c.x),u=this.height/2-Math.abs(c.y);return l<u?new r((l+t.radius)*M(c.x),0):new r(0,(u+t.radius)*M(c.y))}return r.scale(s,(t.radius-n)/n)}draw(t,e=0){t.fillRect(this.x1-e,this.y1-e,this.width+e*2,this.height+e*2)}stroke(t,e=0){t.strokeRectInset(this.x1,this.y1,this.width,this.height,e)}inset(t){return new h(this.x1+t,this.y1+t,this.x2-t,this.y2-t)}static widthForm(t,e,i,o){return new h(t,e,t+i,e+o)}static centerForm(t,e,i,o){return new h(t-i,e-o,t+i,e+o)}static aroundPoint(t,e,i){return new h(t.x-e,t.y-i,t.x+e,t.y+i)}static merged(t){let[e,i,o,s]=t.reduce(([n,c,l,u],m)=>[Math.min(m.x1,n),Math.min(m.y1,c),Math.max(m.x2,l),Math.max(m.y2,u)],[1/0,1/0,-1/0,-1/0]);return new h(e,i,o,s)}},H=class{constructor(t,e,i){this.center=t,this.radius=e,this.cornerCut=i}draw(t){t.fillOctagon(this.center.x,this.center.y,this.radius,this.cornerCut)}intersectsRectangle(t){if(!f.centerForm(this.center.x,this.center.y,this.radius,this.radius).intersectsRectangle(t))return!1;let i=t.midpoint;return Math.abs(i.x-this.center.x)+Math.abs(i.y-this.center.y)<(t.width+t.height)/2+this.radius*2-this.cornerCut}intersectsBy(t){let e=t.midpoint,i=Math.abs(this.center.x-e.x),o=Math.abs(this.center.y-e.y);return Math.max(0,Math.min(this.radius+t.width/2-i,this.radius+t.height/2-o))}collideRectangle(t){let e=t.midpoint,i=Math.abs(this.center.x-e.x),o=Math.abs(this.center.y-e.y);if(i>=this.radius+t.width/2||o>=this.radius+t.height/2)return;let s=(t.width+t.height)/2+this.radius*2-this.cornerCut;if(i+o>=s)return;this.intersectsRectangle(t)||console.error("Collision fuck up");let n=t.width/2+this.radius,c=e.x+n*M(this.center.x-e.x),l=Math.abs(this.center.x-c),u=t.height/2+this.radius,m=e.y+u*M(this.center.y-e.y),I=Math.abs(this.center.y-m);if(o<this.radius-this.cornerCut+t.height/2||i<this.radius-this.cornerCut+t.width/2){l<I?this.center.x=c:this.center.y=m;return}let tt=s-(i+o);this.center.x+=tt/2*M(this.center.x-e.x),this.center.y+=tt/2*M(this.center.y-e.y)}};var $=500,vt=$/1.2,O=class{constructor(t){this.collider=new H(t,14,6),this.velocity=new r(0,0),this.direction=new r(0,-1)}getCursorCell(){let t=this.direction;return t?new r(w(t.x,36),w(t.y,36)):null}onInput(t,e){if(t.isForKey(d.Interact)||t.isClick()){let i=this.getCursorCell();i&&e.interactOnCell(i)}}update(t,e,i){let o=e.getHorizontalAxis(),s=e.getVerticalAxis(),n=new r(o,s).multiply(vt);this.velocity.add(n.multiply(1));let c=this.velocity.magnitude;c>$&&this.velocity.multiply($/c),n.x===0&&n.y===0&&this.velocity.multiply(.5);let l=this.velocity.copy().multiply(t);this.collider.center.add(l);for(let u of i.blocks)this.collider.collideRectangle(u);this.direction=r.add(e.mousePosition,i.camera),r.dist(this.direction,this.collider.center)>144&&(this.direction=null)}collideWithBlock(){}draw(t){let e=this.getCursorCell();e&&(t.setColor("#0005"),t.setLineWidth(2),t.strokeRect(e.x,e.y,36,36)),t.setColor("green"),this.collider.draw(t)}};var Ct=36*2,g=50,X=h=>Math.floor(Math.random()*h),F=class{constructor(t,e,i){this.visited=!1;this.backgroundDirty=!0;this.color=`hsl(${X(360)}, ${X(20)+50}%, ${X(30)+60}%)`,this.key=v(t),this.width=w(e,864),this.height=w(i,576),this.position=t,this.collider=f.widthForm(0,0,this.width,this.height),this.camera=new r(this.width/2,this.height/2),this.player=new O(this.camera.copy()),this.blocks=[];for(let m=36;m<this.width-36;m+=36)for(let I=36;I<this.height-36;I+=36)Math.random()<.02&&this.blocks.push(new f(m,I,m+36,I+36));let o=this.width/864,s=this.height/576,n=g,c=Ct,l=864,u=576;this.exits=[];for(let m=0;m<o;m++)this.blocks.push(f.widthForm(-n+m*l,-n,l/2-c+n,n),f.widthForm((m+1/2)*l+c,-n,l/2-c+n,n),f.widthForm(-n+m*l,s*u,l/2-c+n,n),f.widthForm((m+1/2)*l+c,s*u,l/2-c+n,n)),this.exits.push([f.widthForm((m+1/2)*l-c,-n,c*2,n),new R(this.position,new r(this.position.x+m,this.position.y-1),"up")],[f.widthForm((m+1/2)*l-c,s*u,c*2,n),new R(this.position,new r(this.position.x+m,this.position.y+s),"down")]);for(let m=0;m<s;m++)this.blocks.push(f.widthForm(-n,-n+m*u,n,u/2-c+n),f.widthForm(-n,(m+1/2)*u+c,n,u/2-c+n),f.widthForm(o*l,-n+m*u,n,u/2-c+n),f.widthForm(o*l,(m+1/2)*u+c,n,u/2-c+n)),this.exits.push([f.widthForm(-n,(m+1/2)*u-c,n,c*2),new R(this.position,new r(this.position.x-1,this.position.y+m),"left")],[f.widthForm(o*l,(m+1/2)*u-c,n,c*2),new R(this.position,new r(this.position.x+o,this.position.y+m),"right")])}start(){this.visited=!0,this.backgroundDirty=!0}update(t,e,i){this.player.update(t,e,this);let o=this.exits.find(([s])=>s.intersectsPoint(this.player.collider.center));o&&i.onLevelEvent(o[1]),this.camera=this.player.collider.center.copy(),this.camera.x=E(this.camera.x,864/2,this.width-864/2),this.camera.y=E(this.camera.y,576/2,this.height-576/2)}onInput(t){this.player.onInput(t,this)}interactOnCell(t){let e=-1;for(let i=0;i<this.blocks.length;i++){let o=this.blocks[i];if(o.x1===t.x&&o.y1===t.y&&o.width===36&&o.height===36){e=i;break}}if(e!==-1){this.backgroundDirty=!0,this.blocks.splice(e,1);return}else{let i=f.widthForm(t.x,t.y,36,36);if(!this.collider.intersectsPoint(i.midpoint)||this.exits.some(([s])=>s.intersectsRectangle(i)))return;this.player.collider.intersectsBy(i)<5&&(this.backgroundDirty=!0,this.blocks.push(i))}}draw(t){if(t.setCamera(this.camera.copy().add(new r(g,g))),t.uiCanvas.clear(),this.backgroundDirty){this.backgroundDirty=!1;let i=t.staticWorldCanvas;i.clear(),i.translate(g,g),i.setColor("black"),i.setLineWidth(5),i.strokeRect(0,0,this.width,this.height),i.setColor(this.color),i.fillRect(0,0,this.width,this.height),i.setColor("gray"),this.blocks.forEach(o=>o.draw(i)),i.translate(-g,-g)}let e=t.dynamicWorldCanvas;e.clear(),e.translate(g,g),this.player.draw(e),e.translate(-g,-g)}drawForMap(t){let i=o=>t.fillRect(o*4,o*4,t.width-o*4*2,t.height-o*4*2);t.setColor("grey"),i(1),t.setColor(this.color),i(2)}enterFrom(t){let i={up:new r(864/2,576-10),right:new r(10,576/2),down:new r(864/2,10),left:new r(864-10,576/2)},o=r.diff(t.toKey,this.position);this.player.collider.center=r.add(new r(o.x*864,o.y*576),i[t.direction]),this.start()}};var Et=h=>{let[t,e]=h.split(",").map(i=>parseInt(i));return new r(t,e)},v=h=>`${h.x},${h.y}`,me={up:new r(0,-1),down:new r(0,1),left:new r(-1,0),right:new r(1,0)},K=class{constructor(){this.map=new Map,this.rooms=[],this.currentRoom=this.createRoomWithoutCheckingNeighbors(new r(0,0))}createRoom(t,e=1,i=1){let o=!1;for(let s=0;s<e;s++){let n=v(new r(t.x+s,t.y-1)),c=v(new r(t.x+s,t.y+i));if(this.map.has(n)||this.map.has(c)){o=!0;break}}if(!o)for(let s=0;s<i;s++){let n=v(new r(t.x-1,t.y+s)),c=v(new r(t.x+e,t.y+s));if(this.map.has(n)||this.map.has(c)){o=!0;break}}if(o)return this.createRoomWithoutCheckingNeighbors(t,e,i)}createRoomWithoutCheckingNeighbors(t,e=1,i=1){let o=[];for(let n=0;n<e;n++)for(let c=0;c<i;c++){let l=v(new r(t.x+n,t.y+c));o.push(l);let u=this.map.get(l);if(u)return u}let s=new F(t,864*e,576*i);for(let n of o)this.map.set(n,s);return this.rooms.push(s),s}currentRoomPosition(){return Et(this.currentRoom.key)}navigate(t){let{fromKey:e,direction:i,toKey:o}=t,s=v(o);if(!this.map.get(v(e))){console.error("Exited a room that does not exist!",e,Array.from(this.map.keys()));return}let c=this.map.get(s);if(c)this.currentRoom=c;else{let l=this.createRoom(o,1,1);l||console.error("Failed creating new room!",o),this.currentRoom=l}this.currentRoom.enterFrom(t)}};var G=class{constructor(t){this.gameModeManager=t,this.roomWeb=new K,this.startLevel(this.roomWeb.currentRoom)}startLevel(t){t.start()}onStart(){this.roomWeb.currentRoom.start()}onLevelEvent(t){if(t.isExitEvent()){let e=t;this.roomWeb.navigate(e)}else t.isOpenMapEvent()}update(t,e){this.roomWeb.currentRoom.update(t,e,this)}onInput(t){this.roomWeb.currentRoom.onInput(t)}draw(t){this.roomWeb.currentRoom.draw(t)}};var Rt=["horizontal-movement","vertical-movement","map-c","exit-c","zoom-c"],N=class{constructor(){this.playMode=new G(this),this.mapMode=new _(this),this.currentMode=this.playMode,this.playMode.onStart()}update(t,e){this.currentMode.update(t,e)}switchToMode(t){this.currentMode=t,t.onStart()}onInput(t){let e=!1;this.currentMode===this.playMode?t.isForKey(d.Map)&&(e=!0,this.switchToMode(this.mapMode)):this.currentMode===this.mapMode&&(t.isForKey(d.Escape)||t.isForKey(d.Map))&&(e=!1,this.switchToMode(this.playMode)),e||this.currentMode.onInput(t)}draw(t){this.currentMode.draw(t)}enableSections(t){if(C){for(let e of Rt)document.getElementById(e)?.classList.add("hidden");for(let e of t)document.getElementById(e)?.classList.remove("hidden")}}};var ht={" ":d.Jump,Escape:d.Escape,KeyW:d.Up,KeyA:d.Left,KeyS:d.Down,KeyD:d.Right,KeyE:d.Interact,KeyM:d.Map};function q(h){return window.TouchEvent&&h instanceof TouchEvent}var J=class h{constructor(t,e,i=!1,o=!1){this.keyMap=t,this.mousePosition=e,this.leftClicking=i,this.rightClicking=o}getHorizontalAxis(){return+!!this.keyMap[d.Right]-+!!this.keyMap[d.Left]}getVerticalAxis(){return+!!this.keyMap[d.Down]-+!!this.keyMap[d.Up]}isPressed(t){return!!this.keyMap[t]}isLeftClicking(){return this.leftClicking}isRightClicking(){return this.rightClicking}static empty(){return new h({},new r(0,0))}},P=class{constructor(){}isForKey(t){return!1}isClick(){return!1}isScroll(){return!1}},j=class extends P{constructor(e){super();this.input=e}isForKey(e){return e===this.input}},B=class extends P{constructor(e,i){super();this.position=e,this.isRight=i}isClick(){return!0}isRightClick(){return this.isRight}},D=class extends P{constructor(e,i){super();this.delta=e,this.discrete=!!i}isScroll(){return!0}},Y=class{constructor(t){this.leftClicking=!1,this.rightClicking=!1,this.isButtonDown={},this.listener=t,this.mousePosition=new r(0,0),this.canvas=document.getElementById("canvas")}init(){let t=i=>{this.listener&&this.listener(new j(i))};document.addEventListener("keydown",i=>{let o=i.code;if(i.repeat)return;let s=ht[o];s&&(this.isButtonDown[s]=!0,t(s))}),document.addEventListener("keyup",i=>{let o=i.code,s=ht[o];s&&(this.isButtonDown[s]=!1)}),this.canvas.addEventListener(C?"touchmove":"mousemove",i=>{this.mousePosition=this.toCanvasPosition(i)}),this.canvas.addEventListener(C?"touchstart":"mousedown",i=>{C&&i.preventDefault(),this.mousePosition=this.toCanvasPosition(i);let o=q(i)||i instanceof MouseEvent&&i.button===0,s=i instanceof MouseEvent&&i.button===2;o?(this.listener?.(new B(this.mousePosition,!1)),this.leftClicking=!0):s&&(this.listener?.(new B(this.mousePosition,!0)),this.rightClicking=!0)}),this.canvas.addEventListener(C?"touchend":"mouseup",i=>{let o=q(i)||i instanceof MouseEvent&&i.button===0,s=i instanceof MouseEvent&&i.button===2;o?this.leftClicking=!1:s&&(this.rightClicking=!1)}),this.canvas.addEventListener("contextmenu",i=>{i.preventDefault()}),this.canvas.addEventListener(C?"touchend":"mouseleave",()=>{this.leftClicking=!1,this.rightClicking=!1}),this.canvas.addEventListener("wheel",i=>{this.listener?.(new D(i.deltaY))});let e=(i,o)=>{let s=document.getElementById(i);s&&(s.addEventListener("touchstart",n=>{n.preventDefault(),typeof o=="function"?this.listener?.(o()):(this.isButtonDown[o]=!0,t(o))}),s.addEventListener("touchcancel",n=>{n.preventDefault(),typeof o=="function"||(this.isButtonDown[o]=!1)}),s.addEventListener("touchend",n=>{n.preventDefault(),typeof o=="function"||(this.isButtonDown[o]=!1)}))};e("left",d.Left),e("right",d.Right),e("jump",d.Jump),e("down",d.Down),e("map",d.Map),e("exit",d.Escape),e("zoom-in",()=>new D(1,!0)),e("zoom-out",()=>new D(-1,!0))}toCanvasPosition(t){let e=q(t)?t.touches.item(0)||{clientX:0,clientY:0}:t;return r.scale(new r(e.clientX-this.canvas.offsetLeft+window.scrollX-this.canvas.clientWidth/2,e.clientY-this.canvas.offsetTop+window.scrollY-this.canvas.clientHeight/2),this.canvas.width/this.canvas.clientWidth*k/k)}getInputState(){return new J(this.isButtonDown,this.mousePosition,this.leftClicking,this.rightClicking)}};var S=Symbol("real-canvas");function It(){let h=document.getElementById("canvas");if(!(h instanceof HTMLCanvasElement))throw new Error("Could not find canvas");return h.width=k,h.height=Z,h}var z=class h{static{S}constructor(){let t=new x(It());if(!(t instanceof x))throw Error("No canvas found!");this[S]=t,this.staticWorldCanvas=x.fromScratch(1280*3,720*4),this.dynamicWorldCanvas=x.fromScratch(1280*3,720*4),this.uiCanvas=x.fromScratch(k,Z),this.camera=new r(0,0)}setCamera(t){this.camera=r.diff(t,new r(1280/2,720/2))}drawCanvas(t,e,i=1280,o=720){this[S].drawImage(t,e.x,e.y,i,o,0,0,this[S].width,this[S].height)}drawToScreen(){this[S].clear(),this.drawCanvas(this.staticWorldCanvas,this.camera),this.drawCanvas(this.dynamicWorldCanvas,this.camera),this.drawCanvas(this.uiCanvas,new r(0,0),1280,720)}static{this.instance=null}static getInstance(){return this.instance?this.instance:new h}};var kt=1/20,Q=class{constructor(){this.lastFrameTime=0;this.gameModeManager=new N,this.inputManager=new Y(t=>this.onInput(t)),this.screenManager=new z,this.lastFrameTime=performance.now()}start(){this.inputManager.init(),requestAnimationFrame(()=>this.mainLoop())}onInput(t){this.gameModeManager.onInput(t)}mainLoop(){let t=performance.now(),e=Math.min((t-this.lastFrameTime)/1e3,kt);this.gameModeManager.update(e,this.inputManager.getInputState()),this.gameModeManager.draw(this.screenManager),this.screenManager.drawToScreen(),requestAnimationFrame(()=>this.mainLoop()),this.lastFrameTime=t}},St=()=>{new Q().start()};window.onload=()=>{St()};})();
//# sourceMappingURL=index.js.map
