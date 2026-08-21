(() => {
"use strict";

const KEY = "composta_plus_v3";
const ADMIN_KEY = "composta_plus_v3_admin";
const SACO_KG = 0.4;
const COMPOST_L_PER_KG = 0.45;

const DEFAULT_WASTE = [
  {id:"banana",name:"Casca de banana",category:"Orgânico",canCompost:true,difficulty:"Fácil",tip:"Corte em pedaços menores para acelerar a decomposição.",weight:"50–100 g/unidade"},
  {id:"folhas",name:"Folhas secas",category:"Seco",canCompost:true,difficulty:"Fácil",tip:"Excelente fonte de material seco.",weight:"Varia"},
  {id:"papelao",name:"Papelão sem tinta/plástico",category:"Seco",canCompost:true,difficulty:"Fácil",tip:"Rasgue ou corte em pedaços pequenos.",weight:"Varia"},
  {id:"oleo",name:"Óleo de cozinha",category:"Não compostável",canCompost:false,difficulty:"Fácil",tip:"Não coloque óleo na composteira.",weight:"—"},
  {id:"carne",name:"Carne",category:"Não compostável",canCompost:false,difficulty:"Difícil",tip:"Para este protótipo educativo, não é recomendado.",weight:"Varia"}
];
const DEFAULT_TUTORIALS = [
  {id:"t1",title:"Comece sua composteira",desc:"Monte uma base equilibrada.",steps:["Escolha um local adequado","Adicione material seco","Adicione resíduos orgânicos","Cubra com material seco"]},
  {id:"t2",title:"Controle da umidade",desc:"Aprenda a observar o equilíbrio.",steps:["Observe a textura","Evite excesso de líquido","Adicione seco se estiver muito úmido","Misture quando necessário"]}
];
const DEFAULT_VIDEOS = [
  {id:"v1",title:"Introdução à compostagem",level:"Iniciante",url:"https://www.youtube.com/results?search_query=compostagem+para+iniciantes"},
  {id:"v2",title:"Materiais secos e úmidos",level:"Intermediário",url:"https://www.youtube.com/results?search_query=material+seco+compostagem"}
];
const DEMO_RANK = [
  {name:"Ana",kg:8.2,xp:860},{name:"Arthur",kg:6.7,xp:720},{name:"Marina",kg:5.9,xp:640}
];
const DEFAULT_STATE = {
  profile:{name:"",email:""},
  xp:0, days:0, kg:0, dry:0, food:0, mature:0,
  kgHistory:[], diary:[], tutorialProgress:{}, completedExperiments:[],
  challenge:{week:"",kg:0,claimed:false},
  customTutorials:[], customVideos:[], customChallenges:[], customWaste:[],
  weather:null
};

let state = loadState();
let admin = localStorage.getItem(ADMIN_KEY) === "1";
let toastTimer;

function clone(v){return JSON.parse(JSON.stringify(v));}
function loadState(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw) return clone(DEFAULT_STATE);
    const parsed=JSON.parse(raw);
    return normalize({...clone(DEFAULT_STATE),...parsed});
  }catch(e){console.warn("Estado corrompido; restaurando.",e); return clone(DEFAULT_STATE);}
}
function normalize(s){
  s.profile ||= {name:"",email:""};
  s.xp=finite(s.xp); s.days=finite(s.days); s.kg=finite(s.kg);
  s.dry=finite(s.dry); s.food=finite(s.food); s.mature=finite(s.mature);
  if(!Array.isArray(s.kgHistory))s.kgHistory=[];
  if(!Array.isArray(s.diary))s.diary=[];
  if(!Array.isArray(s.customTutorials))s.customTutorials=[];
  if(!Array.isArray(s.customVideos))s.customVideos=[];
  if(!Array.isArray(s.customChallenges))s.customChallenges=[];
  if(!Array.isArray(s.customWaste))s.customWaste=[];
  if(!s.tutorialProgress||typeof s.tutorialProgress!=="object")s.tutorialProgress={};
  if(!Array.isArray(s.completedExperiments))s.completedExperiments=[];
  s.challenge ||= {week:"",kg:0,claimed:false};
  return s;
}
function finite(v){const n=Number(v);return Number.isFinite(n)&&n>=0?n:0;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){toast("Não foi possível salvar. Reduza o tamanho das fotos do diário.");console.error(e);}}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function money(n){return Number(n).toLocaleString("pt-BR",{maximumFractionDigits:1});}
function toast(msg){const el=$("#toast");if(!el)return;el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
function $(s){return document.querySelector(s);}
function $$(s){return [...document.querySelectorAll(s)];}

function weekKey(){
  const d=new Date(); const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day=x.getUTCDay()||7; x.setUTCDate(x.getUTCDate()+4-day);
  const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));
  return `${x.getUTCFullYear()}-${Math.ceil((((x-y)/86400000)+1)/7)}`;
}
function ensureChallenge(){
  const w=weekKey();
  if(state.challenge.week!==w){state.challenge={week:w,kg:0,claimed:false};save();}
}
function addXP(amount,reason=""){
  const n=Math.max(0,Number(amount)||0);
  state.xp += n;
  save(); renderAll();
  if(reason) toast(`+${n} XP • ${reason}`);
}
function currentLevel(){return Math.floor(state.xp/100)+1;}
function levelTitle(){return ["Semente","Aprendiz Verde","Cuidador de Minhocas","Compostador","Guardião dos Resíduos","Mestre da Compostagem"][Math.min(currentLevel()-1,5)];}

function renderAll(){
  ensureChallenge();
  renderProfile();renderImpact();renderComposter();renderDiary();renderTutorials();renderVideos();renderRanking();renderChallenge();renderAdmin();
}
function renderProfile(){
  const name=state.profile.name||"Visitante";
  $("#profileName").textContent=name;$("#profileEmail").textContent=state.profile.email||"Ainda não cadastrado";
  $("#profileTitle").textContent=state.kg>=10?"Guardião dos Resíduos":state.kg>=5?"Compostador":state.kg>=1?"Aprendiz Verde":"Semente";
  const level=currentLevel(), within=state.xp%100;
  $("#levelNum").textContent=level;$("#levelTitle").textContent=levelTitle();$("#levelBar").style.width=`${within}%`;
  $("#levelText").textContent=`${within} / 100 XP para o próximo nível`;
  $("#heroLevel").textContent=level;$("#heroXP").textContent=Math.round(state.xp);$("#heroKg").textContent=money(state.kg);$("#heroSacos").textContent=money(state.kg/SACO_KG);
  const badges=[
    ["🥉 Primeiros 500 g",state.kg>=.5],["🥈 1 kg transformado",state.kg>=1],["🥇 5 kg compostados",state.kg>=5],
    ["🏆 10 kg compostados",state.kg>=10],["🌎 100 sacos poupados",state.kg/SACO_KG>=100],["📅 30 dias",state.days>=30]
  ];
  $("#badgesList").innerHTML=badges.map(([t,on])=>`<span class="badge ${on?"":"locked"}">${t}</span>`).join("");
}
function renderImpact(){
  $("#iKg").textContent=`${money(state.kg)} kg`;$("#iSacos").textContent=money(state.kg/SACO_KG);
  $("#iCompost").textContent=`${money(state.kg*COMPOST_L_PER_KG)} L`;$("#iDays").textContent=Math.round(state.days);$("#iXP").textContent=Math.round(state.xp);
  $("#bannerKg").textContent=`${money(state.kg)} kg`;
  drawChart();
}
function drawChart(){
  const svg=$("#kgChart"); if(!svg)return;
  const data=state.kgHistory.length?state.kgHistory.slice(-30):[{kg:0}];
  const max=Math.max(1,...data.map(x=>finite(x.kg)));
  const w=640,h=200,p=20;
  const pts=data.map((x,i)=>`${p+(i*Math.max(0,w-2*p)/Math.max(1,data.length-1))},${h-p-(finite(x.kg)/max)*(h-2*p)}`).join(" ");
  svg.innerHTML=`<polyline points="${pts}" fill="none" stroke="#67e49d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="20" y="24" fill="#7f9588" font-size="12">${esc(money(max))} kg</text><text x="20" y="190" fill="#7f9588" font-size="12">0</text>`;
}
function renderComposter(){
  $("#cDay").textContent=`Dia ${Math.round(state.days)}`;
  const total=state.dry+state.food+state.mature;
  $("#cStatus").textContent=total<=0?"Vazia":state.mature>state.food?"Madura":state.food>0?"Ativa":"Com material seco";
  const sum=Math.max(1,total);
  $("#dryLayer").style.height=`${Math.min(90,state.dry/sum*100)}%`;
  $("#foodLayer").style.height=`${Math.min(90,state.food/sum*100)}%`;
  $("#matureLayer").style.height=`${Math.min(90,state.mature/sum*100)}%`;
  const moisture=state.food+state.dry?Math.round((state.food/(state.food+state.dry))*100):null;
  $("#moist").textContent=moisture==null?"—":`${moisture}%`;
  $("#weight").textContent=`${money(state.kg)} kg`;
  const decomp=state.food>0?Math.min(100,Math.round(state.days*2.2+state.mature/(state.food+state.mature||1)*35)):0;
  $("#decomp").textContent=`${decomp}%`;
  $("#temp").textContent=state.weather?.temperature!=null?`${Math.round(state.weather.temperature)}°C`:"24°C";
  let advice="Adicione resíduos para começar.";
  if(moisture!==null && moisture>70) advice="💧 Está úmida: adicione material seco aos poucos.";
  else if(moisture!==null && moisture<35) advice="🍂 Está seca: adicione material úmido e observe a textura.";
  else if(total>0) advice="🌱 Mistura em faixa educativa equilibrada. Observe a composteira na prática.";
  $("#advice").textContent=advice;
}
function registerKg(amount,source="registro"){
  const kg=Math.min(50,Math.max(0,Number(amount)||0));
  if(kg<=0){toast("Informe um peso maior que zero.");return;}
  state.kg += kg; state.food += kg; state.challenge.kg=Math.min(2,state.challenge.kg+kg);
  state.kgHistory.push({date:new Date().toISOString(),kg:state.kg,delta:kg,source});
  state.kgHistory=state.kgHistory.slice(-90);
  addXP(Math.min(50,Math.round(kg*20)),"resíduo registrado");
  save();renderAll();
}
function renderDiary(){
  const box=$("#photoDiary");if(!box)return;
  box.innerHTML=state.diary.slice().reverse().map(d=>`<div class="diary-entry">${d.photo?`<img src="${esc(d.photo)}" alt="Registro da composteira">`:`<div></div>`}<div><b>${esc(d.date)}</b><p>${esc(d.note||"Sem observação.")}</p><small>${d.kg?`+${money(d.kg)} kg • `:""}${d.actions?.join(" • ")||"Registro"}</small></div></div>`).join("")||`<div class="empty">Nenhum registro ainda.</div>`;
}
function resizeImage(file,max=720,quality=.68){
  return new Promise((resolve,reject)=>{
    if(!file)return resolve("");
    if(!file.type.startsWith("image/"))return reject(new Error("Arquivo inválido"));
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error("Falha ao ler imagem"));
    reader.onload=()=>{
      const img=new Image();img.onload=()=>{
        const scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");
        c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",quality));
      };img.onerror=()=>reject(new Error("Imagem inválida"));img.src=reader.result;
    };reader.readAsDataURL(file);
  });
}
function saveDiary(){
  const file=$("#photoInput").files[0];const kg=Math.min(50,Math.max(0,Number($("#diaryKg").value)||0));
  const actions=[]; if($("#chkResiduo").checked)actions.push("resíduos");if($("#chkSeco").checked)actions.push("material seco");if($("#chkMisturei").checked)actions.push("misturei");if($("#chkRetirei").checked)actions.push("retirei composto");
  resizeImage(file).then(photo=>{
    state.diary.push({date:new Date().toLocaleDateString("pt-BR"),photo,note:$("#photoNote").value.trim(),kg,actions});
    if(kg>0)registerKg(kg,"diário");else{addXP(10,"diário salvo");save();renderAll();}
    $("#photoInput").value="";$("#photoNote").value="";$("#diaryKg").value="0";["#chkResiduo","#chkSeco","#chkMisturei","#chkRetirei"].forEach(s=>$(s).checked=false);
  }).catch(()=>toast("Não foi possível salvar a foto."));
}

function allWaste(){return [...DEFAULT_WASTE,...state.customWaste];}
function renderWasteResult(){
  const q=$("#wasteSearch").value.trim().toLocaleLowerCase("pt-BR"), box=$("#wasteSearchResult");
  if(!q){box.innerHTML="";return;}
  const found=allWaste().filter(w=>w.name.toLocaleLowerCase("pt-BR").includes(q));
  box.innerHTML=found.length?found.map(w=>`<div class="waste-result"><b>${esc(w.name)}</b> • ${esc(w.category)}<br><strong class="${w.canCompost?"ok":"no"}">${w.canCompost?"✓ Pode compostar":"✕ Não recomendado"}</strong><br><small>${esc(w.tip)} ${w.weight?`• ${esc(w.weight)}`:""}</small></div>`).join(""):`<div class="empty">Não encontrei esse material no banco.</div>`;
}

function renderTutorials(){
  const list=[...DEFAULT_TUTORIALS,...state.customTutorials], box=$("#tutorials");
  box.innerHTML=list.map(t=>{
    const progress=state.tutorialProgress[t.id]||[];
    return `<article class="card tutorial"><span class="eyebrow">GUIA</span><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="step-list">${t.steps.map((s,i)=>`<label><input type="checkbox" data-tutorial="${esc(t.id)}" data-step="${i}" ${progress.includes(i)?"checked":""}>${esc(s)}</label>`).join("")}</div><small>${progress.length}/${t.steps.length} etapas</small></article>`;
  }).join("");
}
function renderVideos(){
  const level=document.querySelector(".filter.active")?.dataset.level||"Todos";
  const list=[...DEFAULT_VIDEOS,...state.customVideos].filter(v=>level==="Todos"||v.level===level);
  $("#videosList").innerHTML=list.map(v=>`<article class="card video"><span class="eyebrow">${esc(v.level)}</span><h3>${esc(v.title)}</h3><a href="${safeUrl(v.url)}" target="_blank" rel="noopener noreferrer">▶ Abrir vídeo</a></article>`).join("");
}
function safeUrl(url){
  try{const u=new URL(url);return ["https:","http:"].includes(u.protocol)?u.href:"#";}catch{return "#";}
}
function renderRanking(){
  const rows=[...DEMO_RANK,{name:state.profile.name||"Você",kg:state.kg,xp:state.xp}].sort((a,b)=>b.kg-a.kg||b.xp-a.xp);
  $("#rankingList").innerHTML=rows.map((r,i)=>`<div class="rank-row"><strong>${i<3?["🥇","🥈","🥉"][i]:i+1}</strong><span>${esc(r.name)}</span><b>${money(r.kg)} kg</b><span>${Math.round(r.xp)} XP</span></div>`).join("");
}
function renderChallenge(){
  const challenge=state.customChallenges.at(-1)||{title:"Reaproveite 2 kg de resíduos.",xp:100};
  $("#challengeTitle").textContent=challenge.title;
  $("#challengeDesc").textContent=`Complete a meta e ganhe ${challenge.xp} XP.`;
  const pct=Math.min(100,state.challenge.kg/2*100);$("#challengeBar").style.width=`${pct}%`;
  $("#challengeBtn").disabled=state.challenge.claimed||pct>=100;
  $("#challengeBtn").textContent=state.challenge.claimed?"Desafio concluído":"Registrar 0,5 kg";
}
function renderAdmin(){
  $("#adminLocked").hidden=admin;$("#adminPanel").hidden=!admin;$("#adminStatus").textContent=admin?"Administrador conectado.":"";
  if(!admin)return;
  $("#adminChallenges").innerHTML=state.customChallenges.map(c=>`<div class="admin-item"><span>${esc(c.title)} <small>${c.xp} XP</small></span></div>`).join("");
  $("#adminWasteList").innerHTML=state.customWaste.map(w=>`<div class="admin-item"><span>${esc(w.name)} <small>${w.canCompost?"compostável":"não recomendado"}</small></span><button class="btn danger" type="button" data-delete-waste="${esc(w.id)}">Excluir</button></div>`).join("");
}

function openModal(content){$("#modalContent").innerHTML=content;$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false");}
function closeModal(){$("#modal").classList.remove("open");$("#modal").setAttribute("aria-hidden","true");}
function profileModal(){
  openModal(`<h2 id="modalTitle">Seu perfil</h2><form id="profileForm"><input id="pName" maxlength="50" placeholder="Nome" value="${esc(state.profile.name)}" required><input id="pEmail" type="email" maxlength="100" placeholder="E-mail (opcional)" value="${esc(state.profile.email)}"><button class="btn primary">Salvar perfil</button></form>`);
  $("#profileForm").addEventListener("submit",e=>{e.preventDefault();state.profile.name=$("#pName").value.trim()||"Visitante";state.profile.email=$("#pEmail").value.trim();save();closeModal();renderAll();toast("Perfil atualizado.");});
}
function adminLogin(){
  openModal(`<h2 id="modalTitle">Acesso administrativo</h2><form id="adminForm"><input id="aUser" autocomplete="username" placeholder="Usuário" required><input id="aPass" type="password" autocomplete="current-password" placeholder="Senha" required><button class="btn primary">Entrar</button><small>Login de demonstração: adm / adm</small></form>`);
  $("#adminForm").addEventListener("submit",e=>{e.preventDefault();if($("#aUser").value==="adm"&&$("#aPass").value==="adm"){admin=true;localStorage.setItem(ADMIN_KEY,"1");closeModal();renderAll();toast("Administrador conectado.");}else toast("Usuário ou senha inválidos.");});
}

function bind(){
  $("#menuBtn").addEventListener("click",()=>{const nav=$("#nav"),open=nav.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",open);});
  $$("#nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
  $("#profileBtn").addEventListener("click",profileModal);$("#adminToggleBtn").addEventListener("click",adminLogin);$("#adminLockedBtn").addEventListener("click",adminLogin);
  $("#close").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});
  $("#registerKg").addEventListener("click",()=>registerKg($("#wasteKgInput").value));
  $("#advance").addEventListener("click",()=>{state.days+=7;state.mature=Math.min(state.food,state.mature+state.food*.22);addXP(10,"7 dias de cuidado");save();renderAll();});
  $$("[data-add]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.add;state[k]+=0.25;if(k==="mature")state.mature=Math.min(state.food||1,state.mature);addXP(2,"cuidado da composteira");save();renderAll();}));
  $("#savePhoto").addEventListener("click",saveDiary);$("#wasteSearchBtn").addEventListener("click",renderWasteResult);$("#wasteSearch").addEventListener("keydown",e=>{if(e.key==="Enter")renderWasteResult();});
  $("#weatherBtn").addEventListener("click",getWeather);
  $$(".filter").forEach(b=>b.addEventListener("click",()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderVideos();}));
  $$("#miniQuiz button").forEach(b=>b.addEventListener("click",()=>{$("#quizFeedback").textContent=b.dataset.answer==="yes"?"✓ Correto! Folhas secas são material seco.":"✕ Tente novamente.";$("#quizFeedback").style.color=b.dataset.answer==="yes"?"#72e4a3":"#ff9b9b";}));
  $("#experimentXP").addEventListener("click",()=>{if(state.completedExperiments.includes("umidade"))return toast("Você já concluiu este experimento.");state.completedExperiments.push("umidade");addXP(25,"experimento concluído");save();renderAll();});
  $("#challengeBtn").addEventListener("click",()=>{if(state.challenge.claimed)return;if(state.challenge.kg<2){registerKg(.5,"desafio");return;}state.challenge.claimed=true;const c=state.customChallenges.at(-1)||{xp:100};addXP(c.xp,"desafio concluído");save();renderAll();});
  $$("[data-tutorial]").forEach(()=>{}); // delegated below
  $("#tutorials").addEventListener("change",e=>{const input=e.target;if(!input.matches("[data-tutorial]"))return;const id=input.dataset.tutorial,step=Number(input.dataset.step);const arr=state.tutorialProgress[id]||[];if(input.checked&&!arr.includes(step))arr.push(step);if(!input.checked)state.tutorialProgress[id]=arr.filter(x=>x!==step);state.tutorialProgress[id]=arr;save();renderTutorials();if(input.checked)addXP(5,"etapa concluída");});
  $("#adminLogout").addEventListener("click",()=>{admin=false;localStorage.removeItem(ADMIN_KEY);renderAll();toast("Sessão administrativa encerrada.");});
  $("#addTutorial").addEventListener("click",()=>{const title=$("#aTitle").value.trim(),desc=$("#aDesc").value.trim(),steps=$("#aSteps").value.split("|").map(x=>x.trim()).filter(Boolean);if(!title||!steps.length)return toast("Preencha título e etapas.");state.customTutorials.push({id:"t"+Date.now(),title,desc,steps});save();renderAll();$("#aTitle").value=$("#aDesc").value=$("#aSteps").value="";toast("Tutorial adicionado.");});
  $("#addVideo").addEventListener("click",()=>{const title=$("#vTitle").value.trim(),url=$("#vUrl").value.trim(),level=$("#vLevel").value;if(!title||safeUrl(url)==="#")return toast("Informe uma URL válida.");state.customVideos.push({id:"v"+Date.now(),title,url,level});save();renderAll();$("#vTitle").value=$("#vUrl").value="";toast("Vídeo adicionado.");});
  $("#addChallenge").addEventListener("click",()=>{const title=$("#dTitle").value.trim(),xp=Math.min(1000,Math.max(1,Number($("#dXP").value)||0));if(!title||!xp)return toast("Preencha desafio e XP.");state.customChallenges.push({id:"d"+Date.now(),title,xp});save();renderAll();$("#dTitle").value=$("#dXP").value="";toast("Desafio adicionado.");});
  $("#addWaste").addEventListener("click",()=>{const name=$("#wName").value.trim();if(!name)return toast("Informe o nome do resíduo.");state.customWaste.push({id:"w"+Date.now(),name,category:$("#wCategory").value,canCompost:$("#wCanCompost").value==="sim",difficulty:$("#wDifficulty").value,tip:$("#wTip").value.trim(),weight:$("#wWeight").value.trim()});save();renderAll();["#wName","#wTip","#wWeight"].forEach(s=>$(s).value="");toast("Resíduo adicionado.");});
  $("#adminWasteList").addEventListener("click",e=>{const b=e.target.closest("[data-delete-waste]");if(!b)return;state.customWaste=state.customWaste.filter(w=>w.id!==b.dataset.deleteWaste);save();renderAll();});
  ["#mWetFood","#mWetPeel","#mDryLeaf","#mDryCard"].forEach(s=>$(s).addEventListener("input",renderMixer));
}

function renderMixer(){
  const wet=finite($("#mWetFood")?.value)+finite($("#mWetPeel")?.value),dry=finite($("#mDryLeaf")?.value)+finite($("#mDryCard")?.value),total=wet+dry;
  const wp=total?wet/total*100:0,dp=total?dry/total*100:0;
  $("#mixWetBar").style.width=`${wp}%`;$("#mixDryBar").style.width=`${dp}%`;
  let text="Informe as quantidades.";
  if(total){const ratio=dry?wet/dry:Infinity;if(ratio>3)text=`⚠️ Muito úmida (${wet.toFixed(1)} kg : ${dry.toFixed(1)} kg). Adicione aproximadamente ${(wet/2.5-dry>0?wet/2.5-dry:0).toFixed(1)} kg de seco.`;else if(ratio<1)text=`🍂 Muito seca (${wet.toFixed(1)} kg : ${dry.toFixed(1)} kg). Adicione mais material úmido.`;else text=`✓ Mistura educativa equilibrada: ${wet.toFixed(1)} kg úmido + ${dry.toFixed(1)} kg seco.`;}
  $("#simResult").textContent=text;
}

async function getWeather(){
  const city=$("#city").value.trim();if(!city)return toast("Informe uma cidade.");
  const btn=$("#weatherBtn");btn.disabled=true;btn.textContent="Consultando…";
  try{
    const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`,{signal:AbortSignal.timeout(10000)});
    if(!geo.ok)throw new Error("geocoding");const gj=await geo.json();const place=gj.results?.[0];if(!place)throw new Error("notfound");
    const wx=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&timezone=auto`,{signal:AbortSignal.timeout(10000)});
    if(!wx.ok)throw new Error("weather");const wj=await wx.json(),c=wj.current;
    state.weather={temperature:c.temperature_2m,humidity:c.relative_humidity_2m,rain:c.rain,precip:c.precipitation,city:place.name};save();renderComposter();
    const rain=Number(c.rain||0)>0||Number(c.precipitation||0)>0;
    $("#weatherResult").innerHTML=`<div class="weather-grid"><div class="weather-metric"><span>📍 Cidade</span><b>${esc(place.name)}</b></div><div class="weather-metric"><span>🌡️ Temperatura</span><b>${Math.round(c.temperature_2m)}°C</b></div><div class="weather-metric"><span>💧 Umidade</span><b>${Math.round(c.relative_humidity_2m)}%</b></div></div><div class="advice">${rain?"🌧️ Há precipitação agora. Proteja a composteira de excesso de água.":"☀️ Sem chuva registrada agora. Observe a umidade da composteira."}</div>`;
  }catch(e){$("#weatherResult").innerHTML=`<div class="empty">⚠️ Não foi possível consultar o clima agora.<span>Verifique a cidade e sua conexão.</span></div>`;}
  finally{btn.disabled=false;btn.textContent="Consultar clima";}
}

function init(){
  bind();renderMixer();renderAll();
}
document.addEventListener("DOMContentLoaded",init);
})();