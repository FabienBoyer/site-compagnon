const stages = [
  { tag:'TABLEAU 1 · ON ESSAIE', niveau:'3e', notion:"Coefficient directeur : approche sensible", title:'Fais pivoter le rayon !', text:'Le vaisseau est ancré. Tourne le rayon jusqu’à rejoindre la cible rouge.', grid:false, sliders:true, source:[0,0], target:[6,3], decoys:[], coach:'Le vaisseau ne bouge pas : fais varier seulement l’inclinaison du rayon.' },
  { tag:'TABLEAU 2 · CHASSE AUX COULEURS', niveau:'3e', notion:"Points d'une droite et coefficient directeur", title:'Vise la rouge. Pas les bleues !', text:'Le vaisseau est bloqué. Incline le rayon pour atteindre l’ennemi rouge sans traverser un leurre.', grid:false, sliders:true, source:[0,1], target:[6,-2], decoys:[[3,-2],[4,3],[5,2],[7,3]], coach:'Le départ reste fixe. Seule l’inclinaison du rayon change.' },
  { tag:'TABLEAU 3 · LE REPÈRE ARRIVE', niveau:'3e', notion:"Ordonnée à l'origine b", title:'Les nombres apparaissent', text:'Le vaisseau est toujours fixe : le repère révèle b, puis tu règles la pente.', grid:true, sliders:true, source:[0,2], target:[6,5], decoys:[[3,5],[4,-1],[7,-2]], coach:'La hauteur fixe du canon, à x = 0, s’appelle b.' },
  { tag:'TABLEAU 4 · MISSION COORDONNÉES', niveau:'3e', notion:"Lire des coordonnées, régler la pente", title:'Lis, règle, vise', text:'La cible rouge a une coordonnée précise. Le canon reste bloqué, à toi de régler la pente.', grid:true, sliders:true, source:[0,-1], target:[6,-4], decoys:[[3,-4],[6,2],[3,3],[8,1]], coach:'Pour vérifier m, regarde ce qui se passe quand x avance de 1.' },
  { tag:'TABLEAU 5 · SANS MANETTES', niveau:'3e', notion:"Équation réduite y = mx + b", title:'À toi d’écrire le code', text:'Le canon est fixé. Relie-le à la cible rouge en entrant m et b.', grid:true, sliders:false, source:[0,2], target:[6,-1], decoys:[[3,-1],[4,3],[5,-3],[7,1]], coach:'Le canon est à x = 0 : son ordonnée te donne directement b.' },
  { tag:'TABLEAU 6 · BOSS FINAL', niveau:'3e', notion:"Équation d'une droite passant par deux points", title:'Le boss rouge est en vue !', text:'Plus aucune manette : calcule la droite qui relie ton canon à la cible rouge.', grid:true, sliders:false, source:[0,-2], target:[6,4], decoys:[[3,4],[4,1],[5,4],[7,2]], coach:'Compte la montée et l’avancée entre les deux points : m = montée / avancée.' },
  { tag:'TABLEAU 7 · HORS AXE', niveau:'2de', notion:"Droite hors des axes : b = y − mx", title:'Le canon quitte l’axe', text:'Cette fois le vaisseau est en dehors des axes. Trouve d’abord la pente, puis prolonge la droite pour obtenir b.', grid:true, sliders:false, source:[2,1], target:[6,3], decoys:[[3,3],[4,3],[5,-1],[7,1]], coach:'Trouve m avec les deux points, puis utilise b = y − mx avec les coordonnées du canon.' },
  { tag:'TABLEAU 8 · HORS AXE', niveau:'2de', notion:"Pente négative, canon hors des axes", title:'Trajectoire descendante', text:'Le canon est hors axe et la cible rouge est plus basse. Calcule les deux nombres de l’équation.', grid:true, sliders:false, source:[3,2], target:[7,-2], decoys:[[4,-2],[5,3],[6,1],[8,-1]], coach:'Calcule m avec les deux points, puis utilise b = y − mx.' },
  { tag:'TABLEAU 9 · HORS AXE', niveau:'2de', notion:"Retrouver b à partir d'un point de la droite", title:'Batterie de secours', text:'Le canon n’est plus sur un axe. La cible rouge est à droite : retrouve la trajectoire complète.', grid:true, sliders:false, source:[2,-1], target:[6,3], decoys:[[3,3],[4,3],[5,4],[7,2]], coach:'La pente vaut 1. Avec le point (2 ; −1), calcule b : −1 = 1 × 2 + b.' },
  { tag:'TABLEAU 10 · AS DES DROITES', niveau:'2de', notion:"Synthèse : déterminer m puis b", title:'Dernière cible rouge !', text:'Dernier défi : vaisseau hors axe, leurres et aucune manette. Calcule toute l’équation.', grid:true, sliders:false, source:[2,-2], target:[6,4], decoys:[[4,4],[3,1],[5,5],[7,2]], coach:'Compte la montée et l’avancée, puis retrouve b avec l’un des deux points.' }
];

const canvas = document.querySelector('#arena');
const ctx = canvas.getContext('2d');
const mRange = document.querySelector('#mRange'), bRange = document.querySelector('#bRange');
const mInput = document.querySelector('#mInput'), bInput = document.querySelector('#bInput');
const feedback = document.querySelector('#feedback');
const modal = document.querySelector('#resultModal');
const stars = Array.from({length:78},(_,i)=>({x:(i*71)%960,y:(i*137)%560,r:i%7===0?2:1}));
let stageIndex = 0, points = 0;
const f = n => Number.isInteger(n) ? String(n) : String(n).replace('.', ',');
const equation = (m,b) => `y = ${f(m)}x ${b < 0 ? '−' : '+'} ${f(Math.abs(b))}`;
const stage = () => stages[stageIndex];
const getValues = () => ({m:Number(mInput.value)||0,b:Number(bInput.value)||0});
const xPx = x => 145 + x * 61;
const yPx = y => 280 - y * 47;
const onLine = (p,m,b) => Math.abs(m*p[0]+b-p[1]) < .08;

function sync(from){
  if(from==='mRange')mInput.value=mRange.value;
  if(from==='bRange')bInput.value=bRange.value;
  if(from==='mInput')mRange.value=Math.max(-3,Math.min(3,Number(mInput.value)||0));
  if(from==='bInput')bRange.value=Math.max(-4,Math.min(5,Number(bInput.value)||0));
  const {m,b}=getValues();
  document.querySelector('#mOut').textContent=f(m);document.querySelector('#bOut').textContent=f(b);
  const mp=(m+3)/6*100,bp=(b+4)/9*100;
  mRange.style.background=`linear-gradient(90deg,var(--yellow) ${mp}%,rgba(255,255,255,.21) ${mp}%)`;
  bRange.style.background=`linear-gradient(90deg,var(--pink) ${bp}%,rgba(255,255,255,.21) ${bp}%)`;
  document.querySelector('#equationPreview').textContent=stage().grid?equation(m,b):'Rayon en préparation…';
  draw();
}

function drawBackground(){
  const g=ctx.createLinearGradient(0,0,960,560);g.addColorStop(0,'#251056');g.addColorStop(.55,'#170b40');g.addColorStop(1,'#0e1846');ctx.fillStyle=g;ctx.fillRect(0,0,960,560);
  stars.forEach(s=>{ctx.fillStyle=s.r===2?'#ffe786':'rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});
}
function drawGrid(){
  ctx.save();ctx.strokeStyle='rgba(233,221,255,.16)';ctx.lineWidth=1;
  for(let x=0;x<=960;x+=61){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,560);ctx.stroke()}
  for(let y=0;y<=560;y+=47){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke()}
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,yPx(0));ctx.lineTo(960,yPx(0));ctx.moveTo(xPx(0),0);ctx.lineTo(xPx(0),560);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.78)';ctx.font='600 13px Nunito';for(let x=1;x<12;x+=1)ctx.fillText(x,xPx(x)-3,yPx(0)+17);[-4,-2,2,4].forEach(y=>ctx.fillText(y,xPx(0)+8,yPx(y)+4));ctx.fillText('x',925,yPx(0)-9);ctx.fillText('y',xPx(0)+8,18);ctx.restore();
}
function drawTarget(p,color,red=false){
  const X=xPx(p[0]),Y=yPx(p[1]);ctx.save();ctx.shadowColor=color;ctx.shadowBlur=20;ctx.fillStyle=color;ctx.beginPath();ctx.arc(X,Y,13,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(X,Y,5,0,Math.PI*2);ctx.fill();if(red){ctx.strokeStyle='#fff2ad';ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y,21,0,Math.PI*2);ctx.stroke()}if(stage().grid){ctx.fillStyle='#fff';ctx.font='700 13px Nunito';ctx.fillText(`(${p[0]} ; ${p[1]})`,X-15,Y-29)}ctx.restore();
}
function drawShip(p,m){
  const X=xPx(p[0]),Y=yPx(p[1]);ctx.save();ctx.translate(X,Y);ctx.rotate(-Math.atan(m));ctx.shadowColor='#69e9de';ctx.shadowBlur=18;ctx.fillStyle='#69e9de';ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-14,-12);ctx.lineTo(-7,0);ctx.lineTo(-14,12);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#31256a';ctx.beginPath();ctx.arc(-2,0,5,0,Math.PI*2);ctx.fill();ctx.restore();if(stage().grid){ctx.fillStyle='#c9fff8';ctx.font='700 13px Nunito';ctx.fillText(`canon (${p[0]} ; ${p[1]})`,X-26,Y+33)}}
function drawLaser(m,b){
  ctx.save();ctx.strokeStyle='#ffe169';ctx.shadowColor='#ffe169';ctx.shadowBlur=15;ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(xPx(0),yPx(b));ctx.lineTo(xPx(12),yPx(m*12+b));ctx.stroke();ctx.restore();
}
function draw(){
  const s=stage(),{m,b}=getValues(),source=s.source;drawBackground();if(s.grid)drawGrid();
  s.decoys.forEach(p=>drawTarget(p,'#62b9ff'));drawTarget(s.target,'#ff5e87',true);drawLaser(m,b);drawShip(source,m);
}
function setFeedback(type,text){feedback.className=`feedback ${type}`;feedback.innerHTML=`<span>${type==='success'?'✦':type==='fail'?'☄':'☻'}</span><p>${text}</p>`;}
function fire(){
  const s=stage(),{m,b}=getValues(),source=s.source;
  const targetOk=onLine(s.target,m,b), sourceOk=onLine(source,m,b), decoy=s.decoys.some(p=>onLine(p,m,b));
  document.querySelector('#impact').classList.remove('burst');void document.querySelector('#impact').offsetWidth;document.querySelector('#impact').classList.add('burst');
  if(targetOk&&sourceOk&&!decoy){points+=100;setFeedback('success','Touché ! La cible rouge explose en confettis stellaires.');setTimeout(success,380);return}
  if(decoy){setFeedback('fail','Oups, tu as traversé un leurre bleu. Corrige la trajectoire !');return}
  if(targetOk&&!sourceOk){setFeedback('fail',`Le rayon atteint bien la cible rouge, mais il ne part pas de ton canon (${f(source[0])} ; ${f(source[1])}) : c'est la valeur de b qu'il faut corriger.`);return}
  if(!targetOk&&sourceOk&&Math.abs(s.target[1]-(m*s.target[0]+b))<.6){setFeedback('fail','Tu partais bien du canon et tu passes juste à côté de la cible : affine l\u2019inclinaison.');return}
  const difference=s.target[1]-(m*s.target[0]+b);setFeedback('fail',`Le rayon passe ${Math.abs(difference).toFixed(1).replace('.',',')} unité(s) ${difference>0?'trop bas':'trop haut'} près de la cible rouge.`);
}
function success(){
  const s=stage(),{m,b}=getValues();document.querySelector('#resultKicker').textContent=stageIndex===stages.length-1?'AS DES DROITES':'CIBLE ROUGE ATTEINTE';document.querySelector('#resultTitle').textContent=stageIndex===stages.length-1?'Tu maîtrises l’équation !':'Joli tir, pilote !';
  document.querySelector('#resultText').textContent=stageIndex<2?'Cible atteinte !':stageIndex<4?'Trajectoire validée.':'Les deux points fixaient bien une seule droite.';
  document.querySelector('#mathMoment').textContent=stageIndex<2?'✦':`Ta trajectoire : ${equation(m,b)}`;document.querySelector('#nextButton').textContent=stageIndex===stages.length-1?'Rejouer depuis le début ↻':'Tableau suivant →';modal.showModal();
}
function loadStage(){
  const s=stage();mRange.value=0;bRange.value=s.source[1];mInput.value=0;bInput.value=s.source[1];
  document.querySelector('#stageTag').textContent=s.tag;document.querySelector('#stageTitle').textContent=s.title;document.querySelector('#stageText').textContent=s.text;document.querySelector('#missionCount').textContent=`${stageIndex+1} / ${stages.length}`;document.querySelector('#topLevel').textContent=stageIndex+1;document.querySelector('#score').textContent=`${points} ✦`;document.querySelector('#miniProgress').style.width=`${(stageIndex+1)/stages.length*100}%`;document.querySelector('#coachText').textContent=s.coach;
  document.querySelector('#stageNiveau').textContent=s.niveau;document.querySelector('#stageNotion').textContent=s.notion;document.querySelector('#stageSelect').value=String(stageIndex);
  document.querySelector('#slidersPanel').style.display=s.sliders?'grid':'none';document.querySelector('#equationPanel').classList.toggle('hidden',!s.grid);mInput.disabled=s.sliders;bInput.disabled=s.sliders;bRange.disabled=true;document.querySelector('#bOut').textContent=f(s.source[1]);document.querySelector('#bHint').textContent='Le vaisseau est ancré : cette hauteur fixe b.';document.querySelector('#controlTitle').textContent=s.sliders?'Règle l’inclinaison':'Entre les deux nombres';document.querySelector('#gridNote').textContent=s.grid?'Le repère fixe les nombres.':'Pas de repère : utilise tes yeux de pilote.';document.querySelector('#sourceLabel').textContent=`Canon fixé en (${s.source[0]} ; ${s.source[1]})`;
  ['step2','step3'].forEach(id=>document.querySelector('#'+id).classList.remove('active'));if(stageIndex>=2)document.querySelector('#step2').classList.add('active');if(stageIndex>=4)document.querySelector('#step3').classList.add('active');setFeedback('waiting',s.sliders?'Le canon est verrouillé : trouve la bonne inclinaison.':'Le canon et la cible rouge fixent une seule droite.');sync();
}
['mRange','bRange','mInput','bInput'].forEach(id=>document.querySelector('#'+id).addEventListener('input',()=>sync(id)));
document.querySelector('#fireButton').addEventListener('click',fire);document.querySelector('#nextButton').addEventListener('click',()=>{modal.close();if(stageIndex===stages.length-1){stageIndex=0;points=0}else stageIndex++;loadStage()});document.querySelector('#resetButton').addEventListener('click',()=>{stageIndex=0;points=0;loadStage()});window.addEventListener('keydown',e=>{if(e.key==='Enter'&&!modal.open&&document.activeElement.tagName!=='INPUT')fire()});
const stageSelect=document.querySelector('#stageSelect');
stageSelect.innerHTML=stages.map((s,i)=>`<option value="${i}">${i+1} · ${s.notion} (${s.niveau})</option>`).join('');
stageSelect.addEventListener('change',e=>{stageIndex=Number(e.target.value);loadStage()});
loadStage();
