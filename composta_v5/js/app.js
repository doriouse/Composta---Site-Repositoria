(()=>{"use strict";
const KEY="composta_plus_v5";
const D={profile:{name:"Compostador",xp:0,lessons:[],logs:[],challenges:[],quiz:[],diagnosis:{},challengeFlags:{}},config:{bagKg:.4,compostPct:45},wastes:[
{id:"food",name:"Restos de alimentos",emoji:"🥬",cat:"Úmido",tip:"Pique pedaços grandes e cubra com material seco."},
{id:"peel",name:"Cascas de frutas e legumes",emoji:"🍌",cat:"Úmido",tip:"Pedaços menores costumam decompor mais facilmente."},
{id:"coffee",name:"Borra de café",emoji:"☕",cat:"Úmido",tip:"Use com moderação e misture bem."},
{id:"leaf",name:"Folhas secas",emoji:"🍂",cat:"Seco",tip:"Ajuda a equilibrar excesso de umidade."},
{id:"cardboard",name:"Papelão sem revestimento",emoji:"📦",cat:"Seco",tip:"Rasgue e evite partes plastificadas."}]};

const lessons=[
["start","🧺","Monte seu cantinho","Escolha um local prático, ventilado e protegido.","Um bom local facilita a rotina e evita excesso de água.","Por que um local adequado ajuda a rotina?",["Porque facilita observar e cuidar","Porque deixa o composto mais rápido sempre","Porque elimina a necessidade de material seco"],0],
["mix","⚖️","Equilibre úmido + seco","Aprenda a compensar resíduos úmidos com materiais secos.","Observe textura, cheiro e excesso de água; não dependa de uma barra perfeita.","Sua mistura está muito úmida. O que você tenta primeiro?",["Adicionar material seco","Adicionar mais água","Fechar completamente"],0],
["add","🥬","Adicione e cubra","Coloque resíduos e cubra com material seco.","Uma ação simples: entrou resíduo, entrou material seco. Observe a resposta.","Depois de colocar restos de comida, qual ação faz sentido?",["Cobrir com material seco","Adicionar açúcar","Deixar tudo exposto"],0],
["care","🪱","Observe e cuide","Use cheiro, aparência e umidade como pistas.","Cheiro forte ou água em excesso são sinais para revisar a mistura.","Qual conjunto de pistas é mais útil para observar?",["Cheiro, textura e umidade","Só o peso","Só a cor do recipiente"],0],
["finish","🟤","Reconheça o composto","Aprenda sinais de material mais estável.","Composto maduro tende a ser escuro, uniforme e com cheiro de terra.","Qual sinal combina com composto mais estável?",["Aspecto escuro e cheiro de terra","Cheiro muito forte","Restos ainda reconhecíveis"],0],
["use","🌿","Use o que produziu","Descubra formas de aproveitar o composto.","Comece com pequenas quantidades e observe plantas e solo.","Ao usar composto, uma boa prática é:",["Começar com pequenas quantidades","Usar material fresco direto nas raízes","Trocar todo o solo por composto"],0]
];

const uses=[
["🪴","Vasos","Misture pequenas quantidades ao substrato e observe a planta.","Evite composto fresco diretamente nas raízes."],
["🌳","Cobertura do solo","Use uma camada fina ao redor das plantas.","Mantenha distância do caule e observe a umidade."],
["🌱","Horta","Incorpore composto maduro ao solo antes do plantio ou na manutenção.","Use como complemento, não como única fonte de nutrientes."],
["🌼","Jardim","Aproveite como matéria orgânica para plantas ornamentais.","Comece com pouco e ajuste observando a planta."],
["🎁","Compartilhar","Mostre fotos, peso e aprendizados para família ou escola.","Transforme o diário em uma história de impacto."],
["📚","Continuar aprendendo","Compare semanas, materiais e ajustes.","A observação contínua melhora sua prática."]
];

const challenges=[
["first","🌱","Seu primeiro registro","Registre pelo menos 0,1 kg de resíduos.","+30 XP",s=>s.kg>=.1],
["observe","👀","Olhar de cuidador","Faça um diagnóstico completo.","+30 XP",s=>Object.keys(S.profile.diagnosis||{}).length===3],
["balance","⚖️","Equilíbrio na prática","Use o diagnóstico úmido + seco para aplicar uma recomendação.","+35 XP",()=>S.profile.challengeFlags?.balance],
["teacher","🗣️","Ensine alguém","Compartilhe para outra pessoa uma dica aprendida.","+40 XP",()=>S.profile.challengeFlags?.teacher],
["streak","🔥","Rotina verde","Registre atividade em 3 dias diferentes.","+50 XP",s=>s.days>=3],
["impact","🌎","Olhe o impacto","Chegue a 5 kg registrados.","+60 XP",s=>s.kg>=5]
];

const badges=[
["🥉","Primeiros 500 g","Registre 0,5 kg.",s=>s.kg>=.5],["🥈","1 kg transformado","Chegue a 1 kg.",s=>s.kg>=1],
["🥇","5 kg compostados","Chegue a 5 kg.",s=>s.kg>=5],["🏆","10 kg","Alcance 10 kg.",s=>s.kg>=10],
["🎓","Primeira lição","Complete uma etapa.",s=>s.lessons>=1],["🧠","Trilha completa","Complete as 6.",s=>s.lessons>=6],
["🔥","3 dias","Registre em 3 dias diferentes.",s=>s.days>=3],["🌎","100 sacos","Alcance 100 estimados.",s=>s.bags>=100]
];

const skills=[["🌱","Fundamentos","start"],["💧","Umidade","mix"],["⚖️","Equilíbrio","add"],["🪱","Cuidados","care"],["🟤","Maturação","finish"],["🌿","Aplicação","use"]];

let S=load(),$=q=>document.querySelector(q);
function load(){try{let x=JSON.parse(localStorage.getItem(KEY));if(x&&x.profile&&Array.isArray(x.profile.logs)){return {...D,...x,profile:{...D.profile,...x.profile},config:{...D.config,...x.config},profile:{...D.profile,...x.profile,challengeFlags:{...D.profile.challengeFlags,...(x.profile.challengeFlags||{})},diagnosis:{...D.profile.diagnosis,...(x.profile.diagnosis||{})}}}}}catch(e){}return structuredClone(D)}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function n(v){return Math.max(0,Number(v)||0)}
function kg(v){return n(v).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:2})+" kg"}
function st(){let k=S.profile.logs.reduce((a,x)=>a+x.kg,0),days=new Set(S.profile.logs.map(x=>x.date.slice(0,10))).size;return{kg:k,bags:k/S.config.bagKg,comp:k*S.config.compostPct/100,days,lessons:S.profile.lessons.length}}
function lev(x){let l=Math.floor(x/100)+1;return{n:l,p:x%100,t:["Semente","Aprendiz Verde","Cuidador","Compostador","Guardião dos Resíduos","Mestre da Compostagem"][Math.min(5,l-1)]}}
function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function msg(x){let t=$("#toast");t.textContent=x;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2400)}
function modal(title,text,extra=""){$("#modalBody").innerHTML=`<span class="eyebrow">COMPOSTA+ V5</span><h2>${esc(title)}</h2><p>${esc(text)}</p>${extra}`;$("#modal").classList.remove("hidden")}
function render(){
 let s=st(),l=lev(S.profile.xp);$("#level").textContent="Nível "+l.n;$("#title").textContent=l.t;$("#levelbar").style.width=l.p+"%";
 $("#heroKg").textContent=kg(s.kg);$("#heroBags").textContent=s.bags.toLocaleString("pt-BR",{maximumFractionDigits:1});$("#heroXp").textContent=S.profile.xp+" XP";$("#heroDays").textContent=s.days;
 $("#plevel").textContent="Nível "+l.n;$("#ptitle").textContent=l.t;$("#pbar").style.width=l.p+"%";$("#xptext").textContent=`${l.p}/100 XP para o próximo nível`;"#name";$("#name").value=S.profile.name;
 const remaining=lessons.find(x=>!S.profile.lessons.includes(x[0]));$("#nextAction").textContent=remaining?`Próximo passo: ${remaining[2]}.`:"🎉 Trilha concluída! Escolha um desafio para continuar praticando.";
 $("#lessons").innerHTML=lessons.map(x=>`<article class="lesson ${S.profile.lessons.includes(x[0])?"done":""}" data-id="${x[0]}"><div class="icon">${x[1]}</div><h3>${x[2]}</h3><p>${x[3]}</p><div class="done">${S.profile.lessons.includes(x[0])?"✓ concluída":"+20 XP + desafio"}</div></article>`).join("");
 $("#counter").textContent=`${S.profile.lessons.length}/6`;$("#wasteType").innerHTML=S.wastes.map(w=>`<option value="${esc(w.id)}">${w.emoji} ${esc(w.name)}</option>`).join("");tip();
 $("#logs").innerHTML=S.profile.logs.length?[...S.profile.logs].reverse().slice(0,30).map(x=>{let w=S.wastes.find(y=>y.id===x.type)||{};return `<div class="logrow"><span>${w.emoji||"🌱"}</span><div><b>${esc(w.name||x.type)}</b><small> · ${kg(x.kg)} · ${new Date(x.date).toLocaleString("pt-BR")}</small></div><button class="link del" data-id="${esc(x.id)}">Excluir</button></div>`}).join(""):"Ainda não há registros.";
 let goal=[.5,1,5,10].find(g=>s.kg<g);if(goal){let prev=[.5,1,5,10][Math.max(0,[.5,1,5,10].indexOf(goal)-1)]||0,p=Math.max(0,Math.min(100,(s.kg-prev)/(goal-prev)*100));$("#goal").textContent=goal<1?"Primeiros 500 g":goal+" kg compostados";$("#goalText").textContent=`Faltam ${kg(goal-s.kg)}.`;$("#goalbar").style.width=p+"%"}else{$("#goal").textContent="Mestre do impacto";$("#goalText").textContent="Você atingiu os principais marcos.";$("#goalbar").style.width="100%"}
 $("#journey").innerHTML=lessons.map((x,i)=>`<div class="journey-step ${S.profile.lessons.includes(x[0])?"done":(!i||S.profile.lessons.includes(lessons[i-1][0])?"active":"")}"><div class="num">${i+1}</div><b>${x[1]}</b><small>${esc(x[2])}</small></div>`).join("");
 $("#challenges").innerHTML=challenges.map(c=>{let done=c[5](s);return `<article class="badge ${done?"unlocked":""}"><div class="icon">${c[1]}</div><h3>${c[2]}</h3><p>${c[3]}</p><div class="done">${done?"✓ Concluído":c[4]}</div><button data-challenge="${c[0]}">${done?"Revisar":"Fazer agora →"}</button></article>`}).join("");
 $("#uses").innerHTML=uses.map((u,i)=>`<article class="use"><div class="icon">${u[0]}</div><h3>${u[1]}</h3><p>${u[2]}</p><button data-use="${i}">Como fazer →</button></article>`).join("");
 $("#skillTree").innerHTML=`<div class="row"><div><h3>🌿 Mapa de habilidades</h3><p>Você desbloqueia competências quando conclui as missões.</p></div><span class="pill">${S.profile.lessons.length}/6 habilidades</span></div><div class="skill-row">${skills.map(x=>`<div class="skill ${S.profile.lessons.includes(x[2])?"done":""}">${x[0]}<br><b>${x[1]}</b></div>`).join("")}</div>`;
 $("#badges").innerHTML=badges.map(b=>`<article class="badge ${b[3](s)?"unlocked":""}"><div class="icon">${b[0]}</div><b>${b[1]}</b><small>${b[2]}</small><div class="done">${b[3](s)?"✓ Desbloqueada":"🔒 Bloqueada"}</div></article>`).join("");
 $("#mkg").textContent=kg(s.kg);$("#mbags").textContent=s.bags.toLocaleString("pt-BR",{maximumFractionDigits:1});$("#mcomp").textContent=kg(s.comp);$("#mdays").textContent=s.days;chart();save();
}
function tip(){let w=S.wastes.find(x=>x.id===$("#wasteType").value);$("#tip").textContent=w?`${w.cat}: ${w.tip}`:"Escolha um resíduo."}
function mix(){let w=n($("#wet").value),d=n($("#dry").value),need=0,total=w+d,p=total?w/total*100:0;$("#mixbar").style.width=Math.min(100,p)+"%";if(!total){$("#mixStatus").textContent="Aguardando";$("#mixText").textContent="Informe os materiais para receber uma recomendação."}else if(!d){need=w*.5;$("#mixStatus").textContent="Muito úmida";$("#mixText").textContent=`Comece adicionando cerca de ${kg(need)} de material seco.`}else if(w/d>3){need=w/3-d;$("#mixStatus").textContent="Muito úmida";$("#mixText").textContent=`Experimente adicionar cerca de ${kg(need)} de material seco.`}else if(w/d<1){$("#mixStatus").textContent="Muito seca";$("#mixText").textContent="Adicione um pouco de material úmido e observe a textura."}else{$("#mixStatus").textContent="Boa proporção inicial";$("#mixText").textContent="Parece equilibrada como ponto de partida. Continue observando cheiro e textura."}$("#apply").disabled=need<=0;$("#apply").dataset.need=need}
function chart(){let c=$("#chart"),ctx=c.getContext("2d"),d=devicePixelRatio||1,w=c.clientWidth*d,h=220*d;c.width=w;c.height=h;ctx.clearRect(0,0,w,h);let a=[...S.profile.logs].sort((x,y)=>x.date.localeCompare(y.date)),tot=0,p=a.map(x=>(tot+=x.kg,tot));if(!p.length){ctx.fillStyle="#7c8177";ctx.font=14*d+"px Inter";ctx.fillText("Registre um resíduo para começar o gráfico.",18*d,110*d);return}let max=Math.max(...p,.5),pad=25*d;ctx.strokeStyle="#5b8a4a";ctx.lineWidth=3*d;ctx.beginPath();p.forEach((v,i)=>{let x=pad+(w-2*pad)*(a.length===1?.5:i/(a.length-1)),y=h-pad-(h-2*pad)*v/max;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
function challengeAction(id){
 S.profile.challengeFlags=S.profile.challengeFlags||{};
 if(id==="teacher"){if(!S.profile.challengeFlags.teacher){S.profile.xp+=40;S.profile.challengeFlags.teacher=true}modal("Educador Verde","Explique para alguém, em uma frase, por que material seco ajuda na composteira.","<div class='feedback'>✅ Missão registrada: ensine alguém hoje.</div>")}
 else if(id==="balance"){if(!S.profile.challengeFlags.balance){S.profile.xp+=35;S.profile.challengeFlags.balance=true}modal("Equilíbrio na prática","Use a recomendação do painel úmido + seco e observe a textura depois.","<div class='feedback'>⚖️ Missão registrada: ajuste e observe.</div>")}
 else if(id==="observe"){document.querySelector("#diagnostico")?.scrollIntoView();msg("Complete o diagnóstico para concluir a missão.")}
 else if(id==="first"){document.querySelector("#fazer")?.scrollIntoView();msg("Registre pelo menos 0,1 kg para completar.")}
 else if(id==="streak"){document.querySelector("#fazer")?.scrollIntoView();msg("Registre em dias diferentes para criar sua sequência.")}
 else if(id==="impact"){document.querySelector("#impacto")?.scrollIntoView();msg("Continue registrando até chegar a 5 kg.")}
 render();
}
function diagnosisRender(){
 const d=S.profile.diagnosis||{};if(!Object.keys(d).length){$("#diagnosisResult").innerHTML=`<div class="result-icon">🪱</div><div><b>Seu diagnóstico vai aparecer aqui.</b><p>Escolha uma opção em cada pergunta.</p></div>`;return}
 let score=0;if(d.odor==="earth")score+=2;if(d.moisture==="ok")score+=2;if(d.appearance==="normal")score+=2;
 let title,text,action;if(score>=5){title="🟢 Situação estável";text="Os sinais indicam um ponto de partida tranquilo.";action="Continue observando cheiro, textura e umidade."}else if(d.moisture==="wet"||d.odor==="bad"||d.appearance==="problem"){title="🟠 Sua composteira precisa de atenção";text="Há sinais que pedem um ajuste.";action="Revise a umidade e use material seco conforme necessário."}else{title="🟡 Observe e faça pequenos ajustes";text="Há sinais mistos. A observação contínua ajuda.";action="Faça um pequeno ajuste e acompanhe novamente."}
 $("#diagnosisResult").innerHTML=`<div class="result-icon">${title.slice(0,2)}</div><div><b>${title}</b><p>${text}</p><div class="feedback"><b>Próximo passo:</b> ${action}</div></div>`;
 if(Object.keys(d).length===3&&!S.profile.challengeFlags.diagnosisAward){S.profile.challengeFlags.diagnosisAward=true;S.profile.xp+=30;msg("+30 XP · diagnóstico concluído")}
}
function init(){
 render();diagnosisRender();$("#wasteType").onchange=tip;["wet","dry"].forEach(id=>$("#"+id).oninput=mix);
 $("#wasteForm").onsubmit=e=>{e.preventDefault();let q=n($("#kg").value);if(q<=0||q>50)return msg("Registre entre 0,01 e 50 kg.");const wid=$("#wasteType").value,w=S.wastes.find(x=>x.id===wid);S.profile.logs.push({id:(crypto.randomUUID?crypto.randomUUID():Date.now()+""),type:wid,kg:q,date:new Date().toISOString(),note:$("#note").value.trim()});S.profile.xp+=15;e.target.reset();$("#learningFeedback").classList.remove("hidden");$("#learningFeedback").innerHTML=`💡 <b>Aprendizado aplicado</b><br>${w?.cat==="Úmido"?"Agora observe o material seco para equilibrar a mistura.":"Esse material pode ajudar a equilibrar a umidade."}`;render();msg("+15 XP · ação registrada")};
 $("#lessons").onclick=e=>{let c=e.target.closest(".lesson");if(!c)return;let l=lessons.find(x=>x[0]===c.dataset.id);if(!S.profile.lessons.includes(l[0])){let choice=prompt(`${l[2]}\n\n${l[5]}\n1) ${l[6][0]}\n2) ${l[6][1]}\n3) ${l[6][2]}\n\nDigite 1, 2 ou 3:`);if(choice===null)return;let idx=Number(choice)-1;if(idx!==l[7]){modal("Quase lá",`A resposta correta é: ${l[6][l[7]]}. ${l[4]}`);return}S.profile.lessons.push(l[0]);S.profile.quiz.push(l[0]);S.profile.xp+=20;msg("+20 XP · missão concluída")}modal(l[2],l[4],`<div class="feedback"><b>Aplicação:</b> agora leve essa ideia para sua composteira.</div>`);render()};
 $("#uses").onclick=e=>{let b=e.target.closest("[data-use]");if(b){let u=uses[+b.dataset.use];modal(u[1],u[3],`<div class="feedback"><b>Aplicação:</b> comece com pouco e observe o resultado.</div>`)}}; 
 $("#challenges").onclick=e=>{let b=e.target.closest("[data-challenge]");if(b)challengeAction(b.dataset.challenge)};
 $(".diagnosis-grid").onclick=e=>{let b=e.target.closest("[data-value]");if(!b)return;let g=b.parentElement.dataset.group;document.querySelectorAll(`[data-group="${g}"] button`).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");S.profile.diagnosis=S.profile.diagnosis||{};S.profile.diagnosis[g]=b.dataset.value;diagnosisRender();render()};
 $("#logs").onclick=e=>{let b=e.target.closest(".del");if(b&&confirm("Excluir este registro?")){S.profile.logs=S.profile.logs.filter(x=>x.id!==b.dataset.id);render();msg("Registro excluído")}};
 $("#clear").onclick=()=>{if(S.profile.logs.length&&confirm("Apagar todos os registros?")){S.profile.logs=[];render();msg("Diário limpo")}};
 $("#apply").onclick=()=>{let need=n($("#apply").dataset.need);$("#dry").value=(n($("#dry").value)+need).toFixed(2);S.profile.challengeFlags.balance=true;S.profile.xp+=10;mix();render();msg("+10 XP · ajuste aplicado")};
 $("#saveProfile").onclick=()=>{S.profile.name=$("#name").value.trim()||"Compostador";render();msg("Perfil salvo")};
 $("#adminBtn").onclick=()=>{let u=prompt("Usuário:"),p=prompt("Senha:");if(u==="adm"&&p==="adm"){$("#adminPanel").classList.remove("hidden");$("#bag").value=S.config.bagKg;$("#pct").value=S.config.compostPct;location.hash="adminPanel";admin();msg("Administrador conectado")}else msg("Login inválido · use adm / adm")};
 $("#logout").onclick=()=>{$("#adminPanel").classList.add("hidden");location.hash="perfil"};
 $("#adminForm").onsubmit=e=>{e.preventDefault();S.wastes.push({id:"custom_"+Date.now(),name:$("#aname").value.trim(),emoji:"🌱",cat:$("#acat").value.trim(),tip:$("#atip").value.trim()});e.target.reset();render();admin();msg("Resíduo adicionado")};
 $("#saveConfig").onclick=()=>{let b=n($("#bag").value),p=n($("#pct").value);if(b<=0||p<=0)return msg("Configuração inválida.");S.config={bagKg:b,compostPct:p};render();admin();msg("Configurações salvas")};
 $("#adminList").onclick=e=>{let b=e.target.closest("[data-del]");if(b&&confirm("Excluir?")){S.wastes=S.wastes.filter(x=>x.id!==b.dataset.del);render();admin()}};
 $("#close").onclick=()=>$("#modal").classList.add("hidden");$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.add("hidden")};
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>$(b.dataset.go)?.scrollIntoView());$("#menu").onclick=()=>$("#nav").classList.toggle("open");window.onresize=chart;
}
function admin(){$("#adminList").innerHTML=`<h3>Banco de resíduos (${S.wastes.length})</h3>`+S.wastes.map(w=>`<div class="logrow"><span>${w.emoji}</span><div><b>${esc(w.name)}</b><small> · ${esc(w.cat)} · ${esc(w.tip||"sem dica")}</small></div><button class="link" data-del="${esc(w.id)}">Excluir</button></div>`).join("")}
init();
})();