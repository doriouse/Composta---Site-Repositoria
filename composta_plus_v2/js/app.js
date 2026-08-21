const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const defaults={
 profile:{name:"Visitante",email:"",avatar:"🌱"},xp:0,kg:0,day:0,dry:0,food:0,mature:0,
 tutorialDone:{},diary:[],customTutorials:[],customVideos:[],challenges:[],challengeKg:0
};
let S=JSON.parse(localStorage.getItem("cpV2")||"null")||structuredClone(defaults);
function save(){localStorage.setItem("cpV2",JSON.stringify(S));renderAll()}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2400)}
function xp(n,msg){S.xp+=n;save();toast(`+${n} XP${msg?" · "+msg:""}`)}
function level(){return Math.floor(S.xp/100)+1}
function renderProfile(){
 $("#profileName").textContent=S.profile.name;$("#profileEmail").textContent=S.profile.email||"Modo local";$("#avatar").textContent=S.profile.avatar||"🌱";
 $("#heroLevel").textContent=level();$("#heroXP").textContent=S.xp;$("#heroKg").textContent=S.kg.toFixed(1);
 $("#levelNum").textContent=level();let titles=["Semente","Broto","Compostador","Cuidador","Mestre","Guardião"];$("#levelTitle").textContent=titles[Math.min(titles.length-1,level()-1)];
 let inLevel=S.xp%100;$("#levelBar").style.width=inLevel+"%";$("#levelText").textContent=`${inLevel} / 100 XP para o próximo nível`;
}
$("#profileBtn").onclick=()=>{let name=prompt("Seu nome:",S.profile.name==="Visitante"?"":S.profile.name);if(name===null)return;let email=prompt("Seu e-mail (opcional):",S.profile.email);S.profile={name:name.trim()||"Compostador",email:email||"",avatar:"🌱"};save();toast("Perfil salvo neste navegador.")};

function renderComp(){
 $("#cDay").textContent=`Dia ${S.day}`;let total=S.dry+S.food+S.mature;
 let d=Math.min(100,Math.round(S.day*1.2+S.mature*5));$("#cStatus").textContent=total===0?"Vazia":d>=75?"Quase pronta 🌱":"Em atividade 🦠";
 $("#dryLayer").style.height=Math.min(80,S.dry*18)+"px";$("#foodLayer").style.height=Math.min(110,S.food*18)+"px";$("#matureLayer").style.height=Math.min(100,S.mature*18)+"px";
 $("#temp").textContent=(24+Math.min(5,S.food-S.dry))+"°C";$("#moist").textContent=S.food>S.dry?"Alta ⚠️":S.dry?"Equilibrada ✓":"—";$("#decomp").textContent=d+"%";$("#weight").textContent=S.kg.toFixed(2)+" kg";
 $("#advice").textContent=S.food>S.dry?"⚠️ Adicione material seco para equilibrar.":S.day>=60?"🎉 Observe cor, cheiro e textura: seu composto pode estar maduro.":"💡 Alterne materiais úmidos e secos.";
}
$$("[data-add]").forEach(b=>b.onclick=()=>{let k=b.dataset.add;S[k]++;if(k==="food"){S.kg+=.25;xp(15,"resíduo");}else xp(5);save()});
$("#advance").onclick=()=>{if(!S.dry&&!S.food){toast("Adicione materiais primeiro.");return}S.day+=7;S.mature=Math.min(10,S.mature+Math.min(S.dry,S.food));xp(20,"7 dias de cuidado");save();toast(`Chegamos ao dia ${S.day}!`)};

$("#savePhoto").onclick=()=>{
 let f=$("#photoInput").files[0],note=$("#photoNote").value.trim();if(!f&&!note){toast("Adicione uma foto ou observação.");return}
 let finish=(src)=>{S.diary.unshift({date:new Date().toLocaleString("pt-BR"),note,src});S.diary=S.diary.slice(0,12);$("#photoInput").value="";$("#photoNote").value="";xp(10,"diário atualizado");save()};
 if(f){let r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(f)}else finish("");
};
function renderDiary(){$("#photoDiary").innerHTML=S.diary.map(e=>`<div class="entry">${e.src?`<img src="${e.src}">`:""}<small>${e.date}</small><div>${e.note||""}</div></div>`).join("")||"<p>Nenhum registro ainda.</p>"}

async function weather(){
 let city=$("#city").value.trim()||"São Paulo";$("#weatherResult").innerHTML="<div class=empty>⏳ Consultando...</div>";
 try{
  let geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`).then(r=>r.json());
  if(!geo.results?.length)throw Error("Cidade não encontrada");
  let g=geo.results[0],w=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3`).then(r=>r.json());
  let rain=w.daily.precipitation_probability_max[0]>=50||w.daily.precipitation_sum[0]>1;
  $("#weatherResult").innerHTML=`<div class=weather-main><div class=weather-icon>${rain?"🌧️":"☀️"}</div><div><div class=weather-temp>${Math.round(w.current.temperature_2m)}°C</div><b>${g.name}, ${g.country||""}</b><p>Umidade: ${w.current.relative_humidity_2m}% · Chuva hoje: ${w.daily.precipitation_probability_max[0]}%</p></div></div><div class=advice>${rain?"🌧️ Vai chover. Mantenha a composteira protegida do excesso de água e confira a umidade.":"☀️ Sem indicação forte de chuva. Aproveite para observar e cuidar da sua composteira."}</div>`;
 }catch(e){$("#weatherResult").innerHTML=`<div class=empty>⚠️ Não foi possível consultar o clima agora.<span>${e.message}</span></div>`}
}
$("#weatherBtn").onclick=weather;

const baseTutorials=[
 {id:"t1",title:"Monte sua primeira composteira",level:"Iniciante",desc:"Do recipiente ao primeiro material.",steps:["Escolha um recipiente adequado","Faça a preparação e ventilação","Adicione material seco","Adicione resíduos orgânicos","Cubra com material seco e observe"]},
 {id:"t2",title:"Equilibre sua composteira",level:"Intermediário",desc:"Aprenda a identificar excesso de umidade.",steps:["Observe cheiro e textura","Confira a proporção de secos e úmidos","Adicione material seco se necessário","Misture cuidadosamente","Acompanhe por alguns dias"]},
 {id:"t3",title:"Colha e use o composto",level:"Avançado",desc:"Como reconhecer um composto maduro.",steps:["Observe a cor escura","Confira textura e cheiro","Separe materiais ainda inteiros","Deixe estabilizar se necessário","Use no solo de forma adequada"]}
];
function allTutorials(){return [...baseTutorials,...S.customTutorials]}
function renderTutorials(){
 $("#tutorials").innerHTML=allTutorials().map(t=>{let done=S.tutorialDone[t.id]||[];return `<article class="card tutorial ${done.length===t.steps.length?"done":""}"><span class=eyebrow>${t.level}</span><h3>${t.title}</h3><p>${t.desc}</p><ul class=steps>${t.steps.map((s,i)=>`<li><input type=checkbox data-t="${t.id}" data-i="${i}" ${done.includes(i)?"checked":""}> <span>${s}</span></li>`).join("")}</ul><small>${done.length}/${t.steps.length} etapas</small></article>`}).join("");
 $$(".steps input").forEach(c=>c.onchange=()=>{let t=c.dataset.t,i=+c.dataset.i;S.tutorialDone[t]??=[];if(c.checked&&!S.tutorialDone[t].includes(i)){S.tutorialDone[t].push(i);xp(10,"etapa concluída")}else if(!c.checked)S.tutorialDone[t]=S.tutorialDone[t].filter(x=>x!==i);save()})
}
let currentFilter="Todos";
function allVideos(){return [...[{title:"Compostagem em 60 segundos",level:"Iniciante",url:"https://www.youtube.com/results?search_query=compostagem+para+iniciantes"},{title:"Como equilibrar materiais",level:"Intermediário",url:"https://www.youtube.com/results?search_query=equilibrio+compostagem"},{title:"Vermicompostagem",level:"Avançado",url:"https://www.youtube.com/results?search_query=vermicompostagem"}],...S.customVideos]}
function renderVideos(){let v=allVideos().filter(x=>currentFilter==="Todos"||x.level===currentFilter);$("#videosList").innerHTML=v.map(x=>`<article class=card><div class=video><a class=video-thumb target=_blank rel=noopener href="${x.url}">▶</a><small>${x.level}</small><h3>${x.title}</h3></div></article>`).join("")}
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.level;renderVideos()});

function renderRanking(){
 let people=[{name:"Ana",xp:860},{name:"Arthur",xp:720},{name:"Marina",xp:640},{name:"Lucas",xp:510},{name:S.profile.name,xp:S.xp}].sort((a,b)=>b.xp-a.xp);
 $("#rankingList").innerHTML=people.map((p,i)=>`<div class="rank ${p.name===S.profile.name?"me":""}"><strong>${i+1}º</strong><div><b>${p.name}</b><small> · nível ${Math.floor(p.xp/100)+1}</small></div><strong>${p.xp} XP</strong></div>`).join("");
 $("#challengeBar").style.width=Math.min(100,S.challengeKg/2*100)+"%";$("#challengeBtn").textContent=S.challengeKg>=2?"🎉 Desafio concluído":"Registrar 0,5 kg";
}
$("#challengeBtn").onclick=()=>{if(S.challengeKg>=2)return;S.challengeKg=Math.min(2,S.challengeKg+.5);S.kg+=.5;xp(25,"desafio");if(S.challengeKg>=2)xp(100,"desafio concluído");save()};

$("#wet").oninput=$("#dry").oninput=()=>{let a=+$("#wet").value,b=+$("#dry").value,d=Math.abs(a-b);$("#simResult").textContent=d<15?"Equilibrado ✓":a>b?"Muito úmido ⚠️":"Muito seco ⚠️"};
$$("#miniQuiz button").forEach(b=>b.onclick=()=>{let ok=b.dataset.answer==="yes";$("#quizFeedback").textContent=ok?"✓ Correto! +10 XP":"✗ Tente novamente.";if(ok)xp(10,"quiz")});
$("#experimentXP").onclick=()=>xp(25,"experimento");

$("#addTutorial").onclick=()=>{let title=$("#aTitle").value.trim(),desc=$("#aDesc").value.trim(),steps=$("#aSteps").value.split("|").map(x=>x.trim()).filter(Boolean);if(!title||!steps.length){toast("Preencha título e etapas.");return}S.customTutorials.push({id:"custom"+Date.now(),title,desc,level:"Personalizado",steps});$("#aTitle").value=$("#aDesc").value=$("#aSteps").value="";save();toast("Tutorial adicionado.")};
$("#addVideo").onclick=()=>{let title=$("#vTitle").value.trim(),url=$("#vUrl").value.trim(),level=$("#vLevel").value;if(!title||!url){toast("Preencha título e URL.");return}S.customVideos.push({title,url,level});$("#vTitle").value=$("#vUrl").value="";save();toast("Vídeo adicionado.")};
$("#addChallenge").onclick=()=>{let title=$("#dTitle").value.trim(),v=+$("#dXP").value||0;if(!title){toast("Informe o desafio.");return}S.challenges.push({title,xp:v});$("#dTitle").value=$("#dXP").value="";save();toast("Desafio criado.")};
function renderAdmin(){$("#adminChallenges").innerHTML=S.challenges.map(x=>`<div>🎯 ${x.title} · ${x.xp} XP</div>`).join("")||"Nenhum desafio personalizado."}
function renderAll(){renderProfile();renderComp();renderDiary();renderTutorials();renderVideos();renderRanking();renderAdmin()}
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");$$("nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
renderAll();
