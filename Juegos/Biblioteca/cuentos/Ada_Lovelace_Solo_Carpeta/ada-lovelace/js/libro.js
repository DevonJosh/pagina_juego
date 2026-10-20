(()=>{'use strict';
const $=s=>document.querySelector(s), data=window.ADA_CONTENIDO, sound=window.BookSounds||{play(){},stop(){},wrong(){},right(){}};
const left=$('#leftPage'),right=$('#rightPage'),book=$('#book'),modeDialog=$('#modes'),endDialog=$('#ending');
const audio=$('#narrator'),bgm=$('#bgm'),turnSound=$('#pageSound');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs=t=>String(t).split(/\n\s*\n/).map(p=>`<p>${escape(p).replace(/\n/g,' ')}</p>`).join('');
const iconShapes={
 bird:'<path d="M10 48Q25 13 45 37Q58 12 79 30L62 43L86 47L60 56Q38 74 10 48Z" fill="#6c9cad"/><path d="M30 43Q42 57 59 46" fill="none" stroke="#374b4c" stroke-width="4"/><circle cx="64" cy="36" r="3" fill="#45301e"/>',
 idea:'<path d="M35 62Q15 37 30 20Q50 1 70 20Q86 38 65 62Z" fill="#f4cf62"/><path d="M35 63H65V79H35Z" fill="#b28f58"/><path d="M40 85H60M50 2V9M9 30L19 34M81 34L91 30" fill="none" stroke="#805630" stroke-width="4"/>',
 plan:'<rect x="15" y="12" width="63" height="77" rx="5" fill="#f7e7b6"/><path d="M25 33H62M25 44H59M25 55H48" stroke="#ac874d" stroke-width="4"/><path d="M42 77L47 63L79 29L88 38L55 73Z" fill="#c78d4e"/>',
 math:'<rect x="20" y="9" width="60" height="83" rx="7" fill="#426b71"/><rect x="29" y="18" width="42" height="18" rx="3" fill="#e1e7b6"/><path d="M30 48H42M36 42V54M57 48H69M30 66L41 77M41 66L30 77M58 68H70M58 76H70" stroke="#f3d799" stroke-width="4"/>',
 gear:'<path d="M38 8H62L65 20L77 25L88 22L98 42L87 51L88 62L96 70L81 89L68 82L57 86L52 98L29 91L29 77L20 68L7 68L3 43L16 38L24 28L21 16Z" fill="#b78a40"/><circle cx="50" cy="52" r="20" fill="#f1d48f"/><circle cx="50" cy="52" r="9" fill="#71532e"/>',
 cards:'<rect x="12" y="21" width="73" height="51" rx="4" fill="#f6df9c"/><rect x="19" y="30" width="73" height="51" rx="4" fill="#eac683"/><g fill="#8a683e"><rect x="29" y="41" width="7" height="10"/><rect x="43" y="41" width="7" height="10"/><rect x="71" y="41" width="7" height="10"/><rect x="29" y="59" width="7" height="10"/><rect x="57" y="59" width="7" height="10"/><rect x="71" y="59" width="7" height="10"/></g>',
 machine:'<rect x="15" y="75" width="74" height="12" rx="3" fill="#7b5538"/><path d="M24 20V75M40 20V75M58 20V75M76 20V75" stroke="#9b7037" stroke-width="7"/><path d="M15 22H86M15 55H86" stroke="#c49a4c" stroke-width="8"/><circle cx="53" cy="56" r="13" fill="#e0bc65"/><circle cx="53" cy="56" r="5" fill="#805f37"/>',
 notebook:'<rect x="20" y="11" width="62" height="79" rx="6" fill="#386172"/><rect x="27" y="19" width="47" height="62" rx="2" fill="#f6e6b8"/><path d="M36 34H64M36 47H64M36 60H59" stroke="#ba9455" stroke-width="3"/>',
 robot:'<path d="M50 15V6" stroke="#6e6251" stroke-width="4"/><circle cx="50" cy="6" r="5" fill="#d1a553"/><rect x="16" y="18" width="68" height="57" rx="12" fill="#70a6aa"/><circle cx="35" cy="39" r="7" fill="#f9edc4"/><circle cx="65" cy="39" r="7" fill="#f9edc4"/><path d="M34 57Q50 69 66 57" stroke="#345962" stroke-width="4" fill="none"/><path d="M28 76V89M71 76V89M7 38V57M93 38V57" stroke="#6c7873" stroke-width="8"/>',
 star:'<path d="M50 5L63 34L95 39L71 61L77 94L50 78L22 94L28 61L5 39L37 34Z" fill="#e9b641"/>',
 flower:'<g fill="#f4c8be"><ellipse cx="50" cy="27" rx="15" ry="24"/><ellipse cx="73" cy="46" rx="24" ry="15"/><ellipse cx="64" cy="73" rx="15" ry="24" transform="rotate(-35 64 73)"/><ellipse cx="32" cy="71" rx="15" ry="24" transform="rotate(35 32 71)"/><ellipse cx="26" cy="43" rx="24" ry="15"/></g><circle cx="50" cy="49" r="18" fill="#e7bb4d"/>',
 diamond:'<path d="M50 8L90 48L50 91L10 48Z" fill="#6ca9ae"/><path d="M50 8L36 47L50 91L65 47Z" fill="#a4d3d0"/>',
 red:'<circle cx="50" cy="50" r="34" fill="#d97865"/>',blue:'<circle cx="50" cy="50" r="34" fill="#689eb9"/>',yellow:'<circle cx="50" cy="50" r="34" fill="#e6b64d"/>',
 game:'<rect x="7" y="28" width="87" height="48" rx="18" fill="#6e90a4"/><path d="M23 52H47M35 40V64" stroke="#f6e3ad" stroke-width="7"/><circle cx="70" cy="46" r="6" fill="#d78a75"/><circle cx="82" cy="59" r="6" fill="#e6bf61"/>',
 music:'<path d="M38 23V76M38 23L77 14V65M38 36L77 27" stroke="#5a8387" stroke-width="9" fill="none"/><ellipse cx="25" cy="77" rx="17" ry="12" fill="#5a8387"/><ellipse cx="64" cy="66" rx="17" ry="12" fill="#5a8387"/>'
};
function icon(name,label=''){return `<svg viewBox="0 0 100 100" ${label?`role="img" aria-label="${escape(label)}"`:'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">${iconShapes[name]||iconShapes.star}</svg>`;}
const activityData=[
 {id:'actividad-1',type:'activity',kind:'order',chapter:1,title:'Ordena el invento de Ada',instructions:'Toca dos tarjetas para intercambiar sus lugares. Ordena los pasos del invento, del primero al último.',hint:'Primero observa a los pájaros; al final comprende lo que aprendió.',cards:[['Observar a los pájaros','bird'],['Imaginar una máquina voladora','idea'],['Dibujar y estudiar materiales','plan'],['Comprender el vuelo con matemáticas','math']]},
 {id:'actividad-2',type:'activity',kind:'pairs',chapter:2,title:'Las piezas de la Gran Máquina',instructions:'Elige una tarjeta y después su función. Encuentra las cuatro parejas.',hint:'Los engranajes transmiten movimiento.',cards:[['Engranajes','gear','Transmiten movimiento'],['Tarjetas perforadas','cards','Permiten indicar instrucciones'],['Máquina Diferencial','machine','Realiza cálculos matemáticos'],['Cuaderno','notebook','Permite registrar ideas y procedimientos']]},
 {id:'actividad-3',type:'activity',kind:'robot',chapter:3,title:'Programa tu primera máquina',instructions:'Añade flechas para llevar al robot hasta la estrella. Después toca Ejecutar para probar tu programa.',hint:'La estrella está arriba y a la derecha. Cada flecha mueve una casilla.'},
 {id:'actividad-4',type:'activity',kind:'pattern',chapter:3,title:'Descubre el patrón secreto',instructions:'Observa las figuras y elige cuál continúa. Hay tres patrones para descubrir.',hint:'Busca el grupo de figuras que se repite.'},
 {id:'actividad-5',type:'activity',kind:'invent',chapter:4,title:'Soy un inventor del futuro',instructions:'Elige un invento y descubre cómo podría ayudar. ¡Todas las ideas pueden ser un buen comienzo!',hint:'La imaginación y el conocimiento trabajan mejor juntos.'}
];
let items=[],pos=0,mode='activities',started=false,busy=false,solved=true,auto=false,epoch=0,turnTimer=0,autoTimer=0,narrationTimer=0,narrationId='',fade=0,firstNarration=true;
const timers=new Set();function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
function clearPageTimers(){for(const id of timers)clearTimeout(id);timers.clear();clearTimeout(autoTimer);clearTimeout(narrationTimer);epoch++;}
function buildItems(){items=[{id:'portada',type:'cover',title:'Ada Lovelace'}];for(const page of data.pages){items.push(page);if(mode==='activities'&&page.page%3===0){const d=data.decisions.find(d=>d.chapter===page.chapter);if(d)items.push(d);items.push(...activityData.filter(a=>a.chapter===page.chapter));}}items.push(data.moral);}
function illustration(chapter){return `assets/paginas/capitulo-${chapter||4}.png`;}
function imageSide(chapter){return `<div class="illustration-page"><img src="${illustration(chapter)}" alt="${escape(chapter===1?'Ada observa a los pájaros y diseña sus inventos':chapter===2?'Ada y Charles Babbage exploran una máquina de engranajes':chapter===3?'Ada escribe sus notas e instrucciones':'El legado de Ada inspira a nuevas generaciones')}"></div>`;}
function pageInner(content,cls=''){return `<div class="page-inner ${cls}">${content}</div>`;}
function titleHtml(kicker,title){return `<p class="page-kicker">${escape(kicker)}</p><h2 class="page-title">${escape(title)}</h2>`;}
function feedbackHtml(){return '<p id="feedback" class="feedback" role="status" aria-live="polite"></p>';}
function actionsHtml(check=false){return `<div class="actions">${check?'<button id="check" type="button">Comprobar</button>':''}<button id="skip" type="button" class="secondary">Saltar actividad →</button></div>`;}
function render(){
 const item=items[pos];solved=item.type!=='activity'&&item.type!=='decision';left.className='paper left-paper';right.className='paper right-paper';
 if(item.type==='cover'){
  left.innerHTML='<div class="cover-page"><img src="assets/portada.png" alt="Portada de Ada Lovelace: El hada de los números"></div>';
  right.innerHTML=pageInner(`${titleHtml('Una historia para descubrir','Ada Lovelace')}<p class="subtitle">El hada de los números</p><div class="story-text"><p>Un viaje por la curiosidad, las matemáticas y la imaginación.</p><p>Acompaña a Ada desde sus primeros inventos hasta las ideas que la convirtieron en una pionera de la programación.</p></div><button id="begin" class="continue" type="button">Abrir la historia →</button><p class="gentle-note">${mode==='story'?'Solo historia':'Historia con decisiones y actividades'}</p>`);
  $('#begin').onclick=()=>move(1);
 }else if(item.type==='story'||item.type==='moral'){
  left.innerHTML=imageSide(item.chapter||4);
  right.innerHTML=pageInner(`${titleHtml(item.type==='moral'?'Moraleja':`Capítulo ${item.chapter} · ${item.chapterTitle}`,item.title)}<div class="story-text">${paragraphs(item.text)}</div><span class="page-number">${item.page||'✦'}</span>`,'narrative');
 }else if(item.type==='decision')renderDecision(item);
 else renderActivity(item);
 $('#progress').textContent=`${pos+1} / ${items.length} · ${item.type==='activity'?'Actividad':item.type==='decision'?'Decisión':item.type==='moral'?'Moraleja':item.type==='cover'?'Portada':`Capítulo ${item.chapter}`}`;
 updateControls();
}
function updateControls(){book.dataset.busy=String(busy);
 $('#prev').disabled=busy||pos===0;$('#next').disabled=busy||!solved;$('#next').setAttribute('aria-label',pos===items.length-1?'Finalizar historia':'Página siguiente');$('#changeMode').disabled=busy;
 const src=(window.ADA_AUDIOS||{})[items[pos].id];$('#narrate').disabled=busy||!src;$('#narrate').textContent=src?'▶ Escuchar narración':'Narración próximamente';$('#auto').setAttribute('aria-pressed',String(auto));$('#auto').textContent=auto?'Auto: activada':'Auto: desactivada';
}
function renderDecision(item){
 left.innerHTML=pageInner(`${titleHtml('Elige un camino',item.title)}<p class="instructions">Las dos opciones exploran ideas de Ada. Elige la que despierte tu curiosidad.</p><div id="decisionResult" class="decision-result"><p>¿Qué descubrirás al seguir este camino?</p></div><img class="activity-art" src="${illustration(item.chapter)}" alt="Ada explora nuevas ideas">`);
 right.innerHTML=pageInner(`<p class="activity-top">Toca una opción para descubrir qué sucede</p><div class="game-area choice-options">${item.options.map((o,i)=>`<button class="choice-option" type="button" data-choice="${i}"><span class="letter">${o.letter}</span>${escape(o.label)}</button>`).join('')}</div><button id="decisionContinue" class="continue" type="button" disabled>Continuar la historia →</button>`);
 right.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{if(busy)return;const o=item.options[Number(button.dataset.choice)];solved=true;left.querySelector('#decisionResult').innerHTML=`<p class="page-kicker">Elegiste el camino ${o.letter}</p>${paragraphs(o.result)}`;right.querySelectorAll('[data-choice]').forEach(b=>b.classList.toggle('selected',b===button));$('#decisionContinue').disabled=false;sound.play('correct');updateControls();});
 $('#decisionContinue').onclick=()=>move(1);
}
function renderActivity(item){
 const currentEpoch=epoch;let complete=false;
 left.innerHTML=pageInner(`${titleHtml(`Actividad ${item.id.split('-')[1]}`,item.title)}<p class="instructions">${escape(item.instructions)}</p><div class="activity-example"><strong>Pista</strong><p>${escape(item.hint)}</p></div><img class="activity-art" src="${illustration(item.chapter)}" alt="Ilustración del capítulo de Ada">`);
 right.innerHTML=pageInner('<div id="game" class="game-area"></div>'+feedbackHtml()+actionsHtml(item.kind==='order'));
 right.firstElementChild.id='activity';const game=$('#game');
 const feedback=(text,success=false)=>{const el=$('#feedback');el.textContent=text;el.classList.toggle('success',success);};
 function win(message='¡Muy bien! Continuamos en 5 segundos.'){
  if(complete||busy||epoch!==currentEpoch)return;complete=true;solved=true;right.classList.add('completed');feedback(message,true);right.querySelectorAll('button').forEach(b=>b.disabled=true);updateControls();sound.play('success');later(()=>{if(epoch===currentEpoch&&!busy)move(1);},5000);
 }
 function wrong(button,message){feedback(message);sound.wrong(button);}
 $('#skip').onclick=()=>{if(busy)return;solved=true;move(1);sound.play('tap');};
 if(item.kind==='order'){
  let order=shuffle(item.cards.map((_,i)=>i)),chosen=null;if(order.every((v,i)=>v===i))order.reverse();
  const draw=()=>{game.innerHTML=`<div class="game-grid">${order.map((n,i)=>`<div class="order-slot"><span class="order-number">${i+1}</span><button type="button" class="activity-card ${chosen===i?'selected':''}" data-slot="${i}" aria-label="${i+1}. ${escape(item.cards[n][0])}">${icon(item.cards[n][1])}<span>${escape(item.cards[n][0])}</span></button></div>`).join('')}</div>`;game.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{if(complete||busy)return;const i=Number(b.dataset.slot);if(chosen===null){chosen=i;sound.play('select');}else{[order[i],order[chosen]]=[order[chosen],order[i]];chosen=null;sound.play('swap');}draw();if(order.every((v,i)=>v===i))win();});};draw();
  $('#check').onclick=()=>{if(order.every((v,i)=>v===i))win();else{feedback('Revisa qué ocurrió primero y qué aprendió Ada al final.');sound.wrong(...game.querySelectorAll('button'));}};
 }else if(item.kind==='pairs'){
  let chosen=null;const done=new Set(),definitions=shuffle(item.cards.map((_,i)=>i));
  const draw=()=>{game.innerHTML=`<div class="pair-grid">${item.cards.map((c,i)=>`<button class="activity-card ${chosen===i?'selected':''} ${done.has(i)?'done':''}" type="button" data-card="${i}" ${done.has(i)?'disabled':''}>${icon(c[1])}<span>${escape(c[0])}</span></button><button class="activity-card definition ${done.has(definitions[i])?'done':''}" type="button" data-definition="${definitions[i]}" ${done.has(definitions[i])?'disabled':''}>${escape(item.cards[definitions[i]][2])}</button>`).join('')}</div>`;
   game.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{chosen=Number(b.dataset.card);draw();feedback('Ahora elige su función.');sound.play('select');});
   game.querySelectorAll('[data-definition]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.definition);if(chosen===null){wrong(b,'Primero elige una tarjeta.');return;}if(n!==chosen){wrong(b,'Esa función corresponde a otra pieza. Intenta de nuevo.');return;}done.add(n);chosen=null;draw();feedback('¡Encontraste una pareja!');sound.play('correct');if(done.size===4)win();});};draw();
 }else if(item.kind==='robot'){
  let program=[],robot={x:0,y:2},running=false;const arrows={U:'↑',D:'↓',L:'←',R:'→'},names={U:'Arriba',D:'Abajo',L:'Izquierda',R:'Derecha'};
  game.innerHTML='<div id="robotBoard" class="robot-board" role="group" aria-label="Tablero de cuatro columnas y tres filas"></div><div class="robot-controls">'+Object.keys(arrows).map(k=>`<button type="button" data-command="${k}" aria-label="${names[k]}">${arrows[k]}</button>`).join('')+'</div><div id="program" class="program" aria-label="Instrucciones del programa"></div><div class="actions"><button id="execute" type="button">Ejecutar</button><button id="erase" class="secondary" type="button">Borrar</button></div>';
  const draw=()=>{$('#robotBoard').innerHTML=Array.from({length:12},(_,i)=>{const x=i%4,y=Math.floor(i/4),isRobot=robot.x===x&&robot.y===y;return `<div class="robot-cell" aria-label="Fila ${y+1}, columna ${x+1}${isRobot?', robot':x===3&&y===0?', estrella':''}">${isRobot?icon('robot'):x===3&&y===0?icon('star'):''}</div>`;}).join('');$('#program').innerHTML=program.length?program.map(k=>`<span>${arrows[k]}</span>`).join(''):'<span style="grid-column:1/-1;font-size:1cqw">Tu programa aparecerá aquí</span>';};
  game.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{if(running||complete)return;if(program.length>=8){wrong(b,'Puedes usar hasta ocho instrucciones.');return;}program.push(b.dataset.command);draw();sound.play('select');});
  $('#erase').onclick=()=>{if(running||complete)return;program=[];robot={x:0,y:2};draw();feedback('');sound.play('tap');};
  $('#execute').onclick=()=>{if(running||complete)return;if(!program.length){wrong($('#program'),'Añade algunas flechas antes de ejecutar.');return;}running=true;robot={x:0,y:2};draw();let step=0;const tick=()=>{if(epoch!==currentEpoch||busy)return;if(step===program.length){running=false;if(robot.x===3&&robot.y===0)win('¡El robot llegó a la estrella! Continuamos en 5 segundos.');else wrong($('#robotBoard'),'Todavía falta llegar a la estrella. Cambia tu programa.');return;}const k=program[step++],x=robot.x+(k==='R'?1:k==='L'?-1:0),y=robot.y+(k==='D'?1:k==='U'?-1:0);if(x<0||x>3||y<0||y>2){running=false;wrong($('#robotBoard'),'El robot llegó al borde. Revisa las flechas.');return;}robot={x,y};draw();sound.play('select');later(tick,350);};later(tick,200);};draw();
 }else if(item.kind==='pattern'){
  const patterns=[{sequence:['star','flower','star','flower','star'],options:['star','flower','diamond'],answer:'flower'},{sequence:['gear','gear','diamond','gear','gear'],options:['flower','gear','diamond'],answer:'diamond'},{sequence:['red','blue','yellow','red','blue'],options:['red','yellow','blue'],answer:'yellow'}];
  const names={star:'Estrella',flower:'Flor',diamond:'Diamante',gear:'Engranaje',red:'Círculo rojo',blue:'Círculo azul',yellow:'Círculo amarillo'};let round=0,locked=false;
  const draw=()=>{const p=patterns[round];game.innerHTML=`<p class="activity-top">Patrón ${round+1} de 3</p><div class="pattern-line">${p.sequence.map(k=>icon(k,names[k])).join('')}<span style="font:700 3cqw Georgia;text-align:center">?</span></div><p class="activity-top">¿Qué figura sigue?</p><div class="pattern-options">${p.options.map(k=>`<button class="activity-card" type="button" data-answer="${k}" aria-label="${names[k]}">${icon(k)}</button>`).join('')}</div>`;game.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(locked||complete)return;if(b.dataset.answer!==p.answer){wrong(b,'Observa el grupo de figuras que se repite.');return;}locked=true;sound.right(b);feedback('¡Patrón descubierto!',true);if(round===patterns.length-1){win();return;}later(()=>{if(epoch!==currentEpoch)return;round++;locked=false;draw();feedback('');},650);});};draw();
 }else if(item.kind==='invent'){
  const inventions=[['game','Un videojuego sobre viajes en el tiempo','Un videojuego puede ayudarte a conocer distintas épocas, explorar sus costumbres y descubrir cómo vivían las personas.'],['robot','Un robot que limpie los océanos','Un robot podría recoger residuos del agua y ayudar a proteger a los animales marinos. ¡La tecnología también puede cuidar la naturaleza!'],['music','Una aplicación para crear música','Una aplicación puede combinar sonidos y melodías para que más personas experimenten, inventen canciones y compartan su creatividad.']];
  game.innerHTML='<div class="invent-options">'+inventions.map((c,i)=>`<button class="invent-option" type="button" data-invent="${i}">${icon(c[0])}<span>${escape(c[1])}</span></button>`).join('')+'</div><div id="inventionResult" class="invention-result" aria-live="polite"></div>';
  game.querySelectorAll('[data-invent]').forEach(b=>b.onclick=()=>{if(complete)return;const c=inventions[Number(b.dataset.invent)];b.classList.add('selected');$('#inventionResult').innerHTML=icon(c[0])+`<p>${escape(c[2])}</p>`;win('¡Tu idea puede abrir nuevos caminos! Continuamos en 5 segundos.');});
 }
}
function shuffle(array){const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function musicVolume(duck=false){cancelAnimationFrame(fade);const start=bgm.volume,target=Number($('#volume').value)/100*(duck?.22:1),t=performance.now();function step(now){const k=Math.min(1,(now-t)/400);bgm.volume=Math.max(0,Math.min(1,start+(target-start)*k));if(k<1)fade=requestAnimationFrame(step);}fade=requestAnimationFrame(step);}
function stopNarration(){clearTimeout(narrationTimer);audio.pause();audio.currentTime=0;narrationId='';musicVolume();}
function stopAudio(){stopNarration();cancelAnimationFrame(fade);bgm.pause();turnSound.pause();turnSound.currentTime=0;sound.stop();$('#musicToggle').textContent='♫ Activar música';$('#musicToggle').setAttribute('aria-pressed','false');}
function planAuto(){clearTimeout(autoTimer);if(!auto||busy||modeDialog.open||endDialog.open||!started)return;const item=items[pos];if(!['story','cover','moral'].includes(item.type))return;if((window.ADA_AUDIOS||{})[item.id]){if(audio.ended)autoTimer=setTimeout(()=>move(1),200);return;}const words=(item.text||'').split(/\s+/).filter(Boolean).length,delay=item.type==='cover'?8000:Math.max(14000,(words/110*60+5)*1000);autoTimer=setTimeout(()=>move(1),delay);}
async function playNarration(){const item=items[pos],src=(window.ADA_AUDIOS||{})[item.id];if(!src||busy||modeDialog.open||endDialog.open||!started)return;stopNarration();audio.src=src;narrationId=item.id;try{await audio.play();if(narrationId===item.id){firstNarration=false;$('#narrate').textContent='⏸ Pausar narración';musicVolume(true);}}catch{$('#narrate').textContent='▶ Escuchar narración';}}
function pageReady(initial=false){updateControls();planAuto();if((window.ADA_AUDIOS||{})[items[pos].id])narrationTimer=setTimeout(playNarration,initial||firstNarration?5000:100);}
function move(direction){
 if(busy||!started||modeDialog.open||endDialog.open||(direction>0&&!solved))return;if(direction>0&&pos===items.length-1){showEnd();return;}const dest=pos+direction;if(dest<0||dest>=items.length)return;
 busy=true;clearPageTimers();stopNarration();sound.stop();updateControls();const turn=$('#turn'),front=turn.querySelector('.turn-front'),back=turn.querySelector('.turn-back');front.innerHTML=(direction>0?right:left).innerHTML;front.inert=true;back.innerHTML='';turn.classList.toggle('reverse',direction<0);turn.style.left=direction>0?'50%':'0';turn.style.transformOrigin=direction>0?'left center':'right center';const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?100:1600;turn.style.setProperty('--duration',duration+'ms');turn.style.display='block';turnSound.pause();turnSound.src=direction>0?'../../audio/pagina1.mp3':'../../audio/pagina2.mp3';turnSound.currentTime=0;turnSound.volume=.45;turnSound.play().catch(()=>{});
 requestAnimationFrame(()=>requestAnimationFrame(()=>turn.classList.add('active')));
 turnTimer=setTimeout(()=>{pos=dest;render();back.innerHTML=(direction>0?left:right).innerHTML;back.inert=true;},duration/2);
 setTimeout(()=>{turn.classList.remove('active','reverse');turn.style.display='none';front.replaceChildren();back.replaceChildren();busy=false;pageReady();},duration+60);
}
function start(selectedMode){clearPageTimers();stopAudio();mode=selectedMode;started=true;firstNarration=true;auto=false;busy=false;pos=0;buildItems();if(modeDialog.open)modeDialog.close();if(endDialog.open)endDialog.close();render();pageReady(true);}
function showEnd(){if(busy||endDialog.open)return;clearPageTimers();stopAudio();auto=false;updateControls();endDialog.showModal();sound.play('finish');}
$('#prev').onclick=()=>move(-1);$('#next').onclick=()=>move(1);$('#auto').onclick=()=>{auto=!auto;updateControls();planAuto();};
$('#narrate').onclick=()=>{if(!audio.paused){audio.pause();$('#narrate').textContent='▶ Continuar narración';musicVolume();}else if(narrationId===items[pos].id&&!audio.ended){audio.play().then(()=>{musicVolume(true);$('#narrate').textContent='⏸ Pausar narración';}).catch(()=>{});}else playNarration();};
 audio.onended=()=>{musicVolume();$('#narrate').textContent='↻ Escuchar de nuevo';if(narrationId!==items[pos].id)return;if(items[pos].type==='moral')showEnd();else if(auto)move(1);};audio.onerror=()=>{$('#narrate').textContent='▶ Reintentar narración';musicVolume();};
 $('#musicToggle').onclick=async()=>{if(bgm.paused){try{await bgm.play();musicVolume(!audio.paused);$('#musicToggle').textContent='♫ Música: activada';$('#musicToggle').setAttribute('aria-pressed','true');}catch{}}else{bgm.pause();$('#musicToggle').textContent='♫ Activar música';$('#musicToggle').setAttribute('aria-pressed','false');}};
 $('#volume').oninput=()=>musicVolume(!audio.paused);$('#track').onchange=()=>{const playing=!bgm.paused;bgm.src=$('#track').value;if(playing)bgm.play().catch(()=>{});musicVolume(!audio.paused);};bgm.src=$('#track').value;bgm.volume=.13;
 modeDialog.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));$('#changeMode').onclick=()=>{if(busy)return;clearPageTimers();stopAudio();$('#resume').hidden=!started;modeDialog.showModal();};$('#resume').onclick=()=>{modeDialog.close();pageReady();if(solved&&items[pos].type==='activity')later(()=>move(1),5000);};modeDialog.addEventListener('cancel',e=>{e.preventDefault();if(started)$('#resume').click();});
 $('#restart').onclick=()=>start(mode);$('#returnMoral').onclick=()=>endDialog.close();$('#returnLibrary').onclick=stopAudio;
 document.addEventListener('keydown',e=>{if(modeDialog.open||endDialog.open||['BUTTON','SELECT','INPUT'].includes(document.activeElement.tagName))return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
 window.addEventListener('pagehide',()=>{clearPageTimers();stopAudio();});
 function fit(){const r=$('#stage').getBoundingClientRect();book.style.width=Math.max(1,Math.min(r.width,r.height*1.6))+'px';}if(window.ResizeObserver)new ResizeObserver(fit).observe($('#stage'));window.addEventListener('resize',fit);
 buildItems();render();fit();modeDialog.showModal();
})();
