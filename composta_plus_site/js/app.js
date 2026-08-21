const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = JSON.parse(localStorage.getItem("compostaPlus") || "null") || {
  xp: 0, kg: 0, day: 0, dry: 0, food: 0, mature: 0, badges: [],
  quiz: {step: 0, answers: []}
};

function save(){ localStorage.setItem("compostaPlus", JSON.stringify(state)); updateGlobal(); }
function addXP(n, reason=""){ state.xp += n; save(); if(reason) toast(`+${n} XP · ${reason}`); }
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.classList.add("show"); clearTimeout(window._toast); window._toast=setTimeout(()=>el.classList.remove("show"),2600); }
function updateGlobal(){
  $("#hero-xp").textContent=state.xp;
  $("#hero-kg").textContent=state.kg.toFixed(1);
  $("#impact-kg").textContent=state.kg.toFixed(1).replace(".",",")+" kg";
  $("#impact-bags").textContent=Math.floor(state.kg/0.4);
  $("#impact-compost").textContent=(state.kg*0.45).toFixed(1).replace(".",",")+" L";
  $("#impact-bar").style.width=Math.min(100,state.kg/10*100)+"%";
  $("#impact-message").textContent=state.kg>=10 ? "🎉 Você atingiu a meta de 10 kg! Que impacto." : `Faltam ${(10-state.kg).toFixed(1)} kg para sua primeira grande meta.`;
  renderBadges();
  renderComposter();
}

const quizQuestions=[
 {q:"Onde você mora?",a:[["🏢","Apartamento"],["🏡","Casa com quintal"],["🌿","Casa com pouco espaço"],["🏫","Escola / projeto"]]},
 {q:"Quanto espaço você tem?",a:[["📦","Muito pouco"],["🪴","Uma pequena área"],["🌳","Tenho bastante espaço"],["🤷","Ainda não sei"]]},
 {q:"O que você procura?",a:[["💰","Gastar pouco"],["🪱","Usar minhocas"],["⚡","Algo simples e rápido"],["🌎","Reduzir muito meu lixo"]]},
 {q:"Quanto tempo consegue dedicar por semana?",a:[["5 min","Quase nada"],["10 min","Pouco tempo"],["30 min","Tenho disponibilidade"],["🧑‍🌾","Quero me dedicar bastante"]]}
];
function renderQuiz(){
  const s=state.quiz.step;
  if(s>=quizQuestions.length){ showQuizResult(); return; }
  const item=quizQuestions[s];
  $("#quiz-step").textContent=`Pergunta ${s+1} de ${quizQuestions.length}`;
  $("#quiz-progress").style.width=((s+1)/quizQuestions.length*100)+"%";
  $("#quiz-content").innerHTML=`<div class="quiz-question">${item.q}</div><div class="answers">${item.a.map((x,i)=>`<button class="answer" data-i="${i}"><span>${x[0]}</span>${x[1]}</button>`).join("")}</div>`;
  $$(".answer").forEach(b=>b.onclick=()=>{state.quiz.answers.push(+b.dataset.i);state.quiz.step++;save();addXP(10);renderQuiz();});
}
function showQuizResult(){
  const a=state.quiz.answers;
  let title="Compostagem doméstica 🌱", desc="Uma composteira simples pode funcionar muito bem para você.", type="Clássica";
  if(a[0]===0 || a[1]===0){title="Vermicompostagem 🪱";desc="Uma composteira compacta com minhocas é uma ótima opção para espaços pequenos.";type="Vermicompostagem";}
  else if(a[2]===0){title="Composteira econômica 🪣";desc="Você parece valorizar simplicidade e baixo custo. Um sistema feito com recipientes reaproveitados combina com você.";type="Baixo custo";}
  else if(a[0]===1 || a[1]===2){title="Composteira de jardim 🌳";desc="Você tem espaço para um sistema maior e pode trabalhar com uma boa variedade de materiais.";type="Jardim";}
  $("#quiz-content").innerHTML=`<div class="result-box"><div class="result-title">${title}</div><p>${desc}</p><b>Perfil recomendado: ${type}</b><br><br><a class="btn primary" href="#composteira">Montar minha composteira →</a></div><br><button id="redo-quiz" class="text-btn">Refazer quiz</button>`;
  $("#redo-quiz").onclick=()=>{state.quiz={step:0,answers:[]};save();renderQuiz();};
  $("#quiz-step").textContent="Resultado";
  $("#quiz-progress").style.width="100%";
}
renderQuiz();

$$(".material").forEach(btn=>btn.onclick=()=>{
  const layer=btn.dataset.layer;
  state[layer]+=1;
  if(layer==="food"){state.kg+=0.25; addXP(15,"resíduo adicionado");}
  else addXP(5,layer==="dry"?"material seco":"composto adicionado");
  save();
});
$("#advance-day").onclick=()=>{
  if(state.dry+state.food+state.mature===0){toast("Adicione materiais antes de avançar.");return;}
  state.day+=7;
  const balance=Math.min(state.dry,state.food);
  state.mature=Math.min(10,Math.max(state.mature,balance+Math.floor(state.day/20)));
  addXP(20,"7 dias de cuidado");
  save();
  toast(`Sua composteira avançou para o dia ${state.day}!`);
};
$("#reset-composter").onclick=()=>{
  if(confirm("Reiniciar sua composteira virtual?")){state.day=0;state.dry=0;state.food=0;state.mature=0;save();toast("Composteira reiniciada.");}
};
function renderComposter(){
  const total=state.dry+state.food+state.mature;
  const decomp=Math.min(100,Math.round(state.day*1.2+state.mature*5));
  const moist=state.food>state.dry ? "Alta ⚠️" : state.dry>0 ? "Equilibrada ✓" : "Baixa";
  $("#composter-day").textContent=`Dia ${state.day}`;
  $("#composter-status").textContent=total===0?"Vazia":decomp>=75?"Quase pronta 🌱":"Em atividade 🦠";
  $("#layer-dry").style.height=Math.min(80,state.dry*18)+"px";
  $("#layer-food").style.height=Math.min(110,state.food*18)+"px";
  $("#layer-compost").style.height=Math.min(100,state.mature*18)+"px";
  $("#metric-temp").textContent=(24+Math.min(6,state.food-state.dry))+"°C";
  $("#metric-moist").textContent=moist;
  $("#metric-decomp").textContent=decomp+"%";
  $("#metric-weight").textContent=state.kg.toFixed(2)+" kg";
  $("#composter-advice").textContent=state.food>state.dry ? "⚠️ Há mais resíduos úmidos que material seco. Adicione folhas secas, papelão sem tinta ou serragem adequada." : state.day>=60 ? "🎉 Seu composto está chegando à maturidade! Observe cor, cheiro e textura antes de usar." : "💡 Dica: alterne materiais úmidos e secos para manter o equilíbrio.";
}

const wastes=[
 ["banana","🍌","Casca de banana","yes","Pode!","Corte em pedaços menores para acelerar a decomposição."],
 ["casca","🥕","Cascas de frutas e legumes","yes","Pode!","Ótimo material para compostagem doméstica."],
 ["verdura","🥬","Folhas e restos de verduras","yes","Pode!","Misture com materiais secos."],
 ["borra","☕","Borra de café","yes","Pode!","Use com equilíbrio e misture aos outros materiais."],
 ["ovo","🥚","Casca de ovo","yes","Pode!","Esmague para facilitar a decomposição."],
 ["papelão","📦","Papelão sem plastificação","yes","Pode!","Pique ou rasgue em pedaços e combine com resíduos úmidos."],
 ["folha","🍂","Folhas secas","yes","Pode!","São excelentes materiais ricos em carbono."],
 ["carne","🥩","Carne e restos de carne","warn","Cuidado","Pode atrair animais e causar problemas em composteiras domésticas simples. Siga o método específico utilizado."],
 ["queijo","🧀","Queijos e laticínios","warn","Cuidado","Evite em sistemas domésticos simples; podem causar odores e atrair animais."],
 ["óleo","🛢️","Óleo de cozinha","no","Não","Não coloque óleo na composteira. Procure um ponto de coleta."],
 ["plastico","🥤","Plástico","no","Não","Plásticos comuns não pertencem à compostagem."],
 ["vidro","🍾","Vidro","no","Não","Destine para reciclagem de vidro."],
 ["metal","🥫","Metal","no","Não","Destine para reciclagem de metais."]
];
function searchWaste(term){
  term=term.toLowerCase().trim();
  if(!term){$("#waste-result").innerHTML='<div class="empty-state">🔎 <b>Pesquise um resíduo</b><span>Você receberá uma resposta rápida, com dica e categoria.</span></div>';return;}
  const item=wastes.find(x=>term.includes(x[0])||x[2].toLowerCase().includes(term));
  if(!item){$("#waste-result").innerHTML='<div class="empty-state">🤔 <b>Não encontramos esse item.</b><span>Tente “banana”, “papelão”, “café”, “óleo”...</span></div>';return;}
  $("#waste-result").innerHTML=`<div class="waste-answer"><div class="waste-icon">${item[1]}</div><div><h3>${item[2]}</h3><span class="tag ${item[3]}">${item[4]}</span><p>${item[5]}</p></div></div>`;
}
$("#waste-search").oninput=e=>searchWaste(e.target.value);
["banana","borra","papelão","óleo","carne"].forEach(t=>{$("#waste-suggestions").innerHTML+=`<button class="chip">${t}</button>`});
$$(".chip").forEach(b=>b.onclick=()=>{$("#waste-search").value=b.textContent;searchWaste(b.textContent);});

const badges=[
 ["first","🌱","Primeiro passo","Complete o quiz",()=>state.quiz.step>=4],
 ["bin","🪣","Mãos na terra","Adicione seu primeiro material",()=>state.dry+state.food+state.mature>0],
 ["recycle","♻️","Desviador de resíduos","Reaproveite 1 kg",()=>state.kg>=1],
 ["care","🪱","Cuidador","Avance sua composteira por 14 dias",()=>state.day>=14],
 ["impact","🌎","Impacto real","Reaproveite 5 kg",()=>state.kg>=5],
 ["master","🏆","Mestre da compostagem","Complete 10 kg",()=>state.kg>=10],
 ["science","🧪","Curioso","Explore o laboratório",()=>localStorage.getItem("compostaLab")==="1"],
 ["legend","🌻","Nova vida","Chegue a 60 dias",()=>state.day>=60]
];
function renderBadges(){
 $("#badges").innerHTML=badges.map(b=>{const unlocked=b[4]();return `<article class="badge card ${unlocked?"":"locked"}"><span class="badge-icon">${b[1]}</span><h3>${b[2]}</h3><small>${unlocked?"✓ Desbloqueada":b[3]}</small></article>`}).join("");
}
$$(".learn-btn").forEach(btn=>btn.onclick=()=>{
 const key=btn.dataset.modal;localStorage.setItem("compostaLab","1");
 const content=key==="water"?`<span class="eyebrow">LABORATÓRIO</span><h2>Água demais? Respira.</h2><p>Quando o sistema fica encharcado, o ar circula menos entre os materiais. O resultado pode ser decomposição inadequada e mau cheiro.</p><p><b>Experimento:</b> adicione material seco aos poucos, misture com cuidado e observe a umidade. O ideal é um ambiente úmido, mas não encharcado.</p>`:`<span class="eyebrow">LABORATÓRIO</span><h2>As minhocas estão trabalhando. 🪱</h2><p>Na vermicompostagem, minhocas processam matéria orgânica e produzem um material rico em nutrientes. O segredo é oferecer condições adequadas e não exagerar na alimentação.</p>`;
 $("#modal-content").innerHTML=content;$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false");renderBadges();
});
$("#close-modal").onclick=()=>$("#modal").classList.remove("open");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")};

$(".menu-btn").onclick=()=>$("#main-nav").classList.toggle("open");
$$("nav a").forEach(a=>a.onclick=()=>$("#main-nav").classList.remove("open"));

updateGlobal();