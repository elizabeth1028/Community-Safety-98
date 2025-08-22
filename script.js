let DATA = null;
let lang = 'EN';
let currentIssue = null;

// Elements
const appTitle = ()=>document.getElementById('appTitle');
const btnEN = ()=>document.getElementById('btnEN');
const btnES = ()=>document.getElementById('btnES');
const tabs = ()=>document.querySelectorAll('.tab');
const views = ()=>document.querySelectorAll('.view');
const issuesList = ()=>document.getElementById('issuesList');
const viewIssues = ()=>document.getElementById('view-issues');
const viewDetail = ()=>document.getElementById('view-detail');
const issueTitle = ()=>document.getElementById('issueTitle');
const safetyBanner = ()=>document.getElementById('safetyBanner');
const doTitle = ()=>document.getElementById('doTitle');
const dontTitle = ()=>document.getElementById('dontTitle');
const sayTitle = ()=>document.getElementById('sayTitle');
const resourcesTitle = ()=>document.getElementById('resourcesTitle');
const doList = ()=>document.getElementById('doList');
const dontList = ()=>document.getElementById('dontList');
const scriptText = ()=>document.getElementById('scriptText');
const btnCopy = ()=>document.getElementById('btnCopy');
const btnListen = ()=>document.getElementById('btnListen');
const resourcesList = ()=>document.getElementById('resourcesList');
const ambassadorLink = ()=>document.getElementById('ambassadorLink');
const backToIssues = ()=>document.getElementById('backToIssues');

const learnList = ()=>document.getElementById('learnList');
const learnDetail = ()=>document.getElementById('learnDetail');
const learnTitle = ()=>document.getElementById('learnTitle');
const learnBody = ()=>document.getElementById('learnBody');
const backToLearn = ()=>document.getElementById('backToLearn');
const learnListen = ()=>document.getElementById('learnListen');

const codeList = ()=>document.getElementById('codeList');
const hotlinesList = ()=>document.getElementById('hotlinesList');
const codeTitle = ()=>document.getElementById('codeTitle');
const hotlinesTitle = ()=>document.getElementById('hotlinesTitle');
const footerText = ()=>document.getElementById('footerText');

const assistantTitle = ()=>document.getElementById('assistantTitle');
const assistantInput = ()=>document.getElementById('assistantInput');
const assistantGo = ()=>document.getElementById('assistantGo');
const assistantNote = ()=>document.getElementById('assistantNote');
const assistantResult = ()=>document.getElementById('assistantResult');

async function loadData(){
  const res = await fetch('data.json', {cache:'no-store'});
  if(!res.ok){ throw new Error('Failed to load data.json'); }
  DATA = await res.json();
  lang = localStorage.getItem('lang') || DATA.config.defaultLanguage || 'EN';
  initUI();
}

function initUI(){
  // Lang buttons
  document.getElementById('btnEN').addEventListener('click', ()=>setLang('EN'));
  document.getElementById('btnES').addEventListener('click', ()=>setLang('ES'));
  // Tabs
  tabs().forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs().forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      views().forEach(v=>v.classList.remove('active'));
      const viewId = tab.dataset.tab;
      document.getElementById(`view-${viewId}`).classList.add('active');
      if(viewId==='issues') renderIssues();
      if(viewId==='learn') renderLearn();
      if(viewId==='code') renderCode();
    });
  });
  // Back buttons
  backToIssues().addEventListener('click', ()=>{
    viewDetail().classList.remove('active');
    viewIssues().classList.add('active');
    currentIssue = null;
  });
  btnCopy().addEventListener('click', ()=>{
    navigator.clipboard.writeText(scriptText().textContent||'').then(()=>{
      btnCopy().textContent = lang==='EN' ? 'Copied!' : '¡Copiado!';
      setTimeout(()=> btnCopy().textContent = lang==='EN' ? 'Copy' : 'Copiar', 1200);
    });
  });
  btnListen().addEventListener('click', ()=> speak(scriptText().textContent||''));
  backToLearn().addEventListener('click', ()=> learnDetail().classList.add('hidden'));
  learnListen().addEventListener('click', ()=> speak(learnBody().textContent||''));
  assistantGo().addEventListener('click', onAssistant);
  setLang(lang);
  renderIssues();
  renderLearn();
  renderCode();
}

function setLang(l){
  lang = l;
  localStorage.setItem('lang', lang);
  btnEN().setAttribute('aria-pressed', lang==='EN');
  btnES().setAttribute('aria-pressed', lang==='ES');
  appTitle().textContent = lang==='EN' ? DATA.config.appName_en : DATA.config.appName_es;
  document.getElementById('tabIssues').textContent = lang==='EN' ? 'Address an Issue' : 'Resolver un problema';
  document.getElementById('tabLearn').textContent = lang==='EN' ? 'Learn' : 'Aprender';
  document.getElementById('tabCode').textContent = lang==='EN' ? 'Community Code' : 'Código Comunitario';
  document.getElementById('tabAssistant').textContent = lang==='EN' ? 'Assistant' : 'Asistente';
  doTitle().textContent = lang==='EN' ? 'Do' : 'Hacer';
  dontTitle().textContent = lang==='EN' ? "Don't" : 'No hacer';
  sayTitle().textContent = lang==='EN' ? 'Say This' : 'Diga esto';
  resourcesTitle().textContent = lang==='EN' ? 'Resources' : 'Recursos';
  assistantTitle().textContent = lang==='EN' ? 'Describe the problem' : 'Describa el problema';
  assistantInput().placeholder = lang==='EN' ? 'e.g., My neighbor plays loud music at night' : 'ej.: Mi vecino pone música alta por la noche';
  assistantGo().textContent = lang==='EN' ? 'Get Guidance' : 'Obtener guía';
  assistantNote().textContent = lang==='EN' ? 
    'Private: no data is stored here. For emergencies call 911; for 988 (mental health), 211 (services), 311 (city services).' :
    'Privado: no se guardan datos aquí. En emergencias llame al 911; para 988 (salud mental), 211 (servicios), 311 (servicios de la ciudad).';
  footerText().textContent = lang==='EN' ? 
    'Safety first: If someone is in danger, call 911. For mental health crises, call/text 988. For services, call 211. For city services, use 311.' :
    'Primero la seguridad: Si alguien está en peligro, llame al 911. Para crisis de salud mental, llame o envíe texto al 988. Para servicios sociales, 211. Para servicios de la ciudad, 311.';
  if(currentIssue) showIssueDetail(currentIssue.id);
}

function renderIssues(){
  issuesList().innerHTML='';
  DATA.issues.forEach(issue=>{
    const card = document.createElement('div');
    card.className='issue-card';
    card.addEventListener('click', ()=>showIssueDetail(issue.id));
    const icon = document.createElement('div');
    icon.className='icon';
    icon.textContent = issue.icon;
    const label = document.createElement('div');
    label.className='label';
    label.textContent = (lang==='EN')? issue.name_en : issue.name_es;
    card.appendChild(icon); card.appendChild(label);
    issuesList().appendChild(card);
  });
}

function showIssueDetail(issueId){
  currentIssue = DATA.issues.find(i=>i.id===issueId);
  const pb = DATA.playbooks[issueId];
  issueTitle().textContent = `${currentIssue.icon} ${(lang==='EN')?currentIssue.name_en:currentIssue.name_es}`;
  if(currentIssue.highRisk){
    safetyBanner().classList.remove('hidden');
    safetyBanner().textContent = lang==='EN' ? 
      'Safety first: Do not confront. If there is immediate danger, call 911. Consider 988/211 and local hotlines below.' :
      'Primero la seguridad: No confronte. Si hay peligro inmediato, llame al 911. Considere 988/211 y las líneas locales abajo.';
  } else {
    safetyBanner().classList.add('hidden');
  }
  const doArr   = (lang==='EN')? pb.do_en : pb.do_es;
  const dontArr = (lang==='EN')? pb.dont_en : pb.dont_es;
  const script  = (lang==='EN')? pb.script_en : pb.script_es;
  const res     = (lang==='EN')? pb.resources_en : pb.resources_es;
  doList().innerHTML = doArr.map(x=>`<li>${x}</li>`).join('');
  dontList().innerHTML = dontArr.map(x=>`<li>${x}</li>`).join('');
  scriptText().textContent = script;
  resourcesList().innerHTML = res.map(x=>`<li>${x}</li>`).join('');
  ambassadorLink().href = DATA.config.ambassadorFormURL;
  ambassadorLink().textContent = (lang==='EN')? 'Ask an Ambassador' : 'Pedir ayuda a Embajadora/o';
  viewIssues().classList.remove('active');
  viewDetail().classList.add('active');
}

function renderLearn(){
  learnDetail().classList.add('hidden');
  learnList().innerHTML='';
  DATA.learn.forEach(item=>{
    const card = document.createElement('div');
    card.className='issue-card';
    card.addEventListener('click', ()=>{
      learnDetail().classList.remove('hidden');
      learnTitle().textContent = (lang==='EN')? item.title_en : item.title_es;
      learnBody().textContent  = (lang==='EN')? item.body_en  : item.body_es;
    });
    const icon = document.createElement('div');
    icon.className='icon';
    icon.textContent='📘';
    const label = document.createElement('div');
    label.className='label';
    label.textContent=(lang==='EN')? item.title_en : item.title_es;
    card.appendChild(icon); card.appendChild(label);
    learnList().appendChild(card);
  });
}

function renderCode(){
  codeTitle().textContent = (lang==='EN')? 'Community Code' : 'Código Comunitario';
  hotlinesTitle().textContent = (lang==='EN')? 'Important Hotlines' : 'Líneas importantes';
  const codeEN = [
    'Be kind. Assume good intent.',
    'Protect privacy; no doxxing, threats, or public shaming.',
    'Safety first. For danger call 911; 988 for mental health; 211 for services; 311 for city services.',
    'High‑risk issues (violence, overdose, crisis): do not confront—offer resources.'
  ];
  const codeES = [
    'Sea amable. Suponga buena intención.',
    'Proteja la privacidad; nada de doxxing, amenazas ni humillación pública.',
    'Primero la seguridad. Peligro: 911; salud mental: 988; servicios: 211; ciudad: 311.',
    'Temas de alto riesgo (violencia, sobredosis, crisis): no confronte—ofrezca recursos.'
  ];
  const hotlinesEN = [
    '911 – Emergency / danger',
    '988 – Suicide & Crisis Lifeline (call/text)',
    '211 – Social services',
    'National Domestic Violence Hotline – 1‑800‑799‑7233'
  ];
  const hotlinesES = [
    '911 – Emergencias / peligro',
    '988 – Línea de Crisis y Suicidio (llamar/texto)',
    '211 – Servicios sociales',
    'Línea Nacional contra la Violencia Doméstica – 1‑800‑799‑7233'
  ];
  codeList().innerHTML = (lang==='EN'?codeEN:codeES).map(x=>`<li>${x}</li>`).join('');
  hotlinesList().innerHTML = (lang==='EN'?hotlinesEN:hotlinesES).map(x=>`<li>${x}</li>`).join('');
}

// Assistant (keyword-based)
function onAssistant(){
  const text = (assistantInput().value||'').toLowerCase();
  assistantResult().classList.remove('hidden');
  if(!text.trim()){
    assistantResult().innerHTML = `<p>${lang==='EN'?'Please type a short description.':'Escriba una breve descripción.'}</p>`;
    return;
  }
  const match = scoreIssue(text);
  if(!match){
    assistantResult().innerHTML = `<p>${lang==='EN'?'I could not match that. Try the Issues tab.':'No pude identificarlo. Pruebe la pestaña de Problemas.'}</p>`;
    return;
  }
  const issue = DATA.issues.find(i=>i.id===match);
  const pb = DATA.playbooks[match];
  const doArr   = (lang==='EN')? pb.do_en : pb.do_es;
  const dontArr = (lang==='EN')? pb.dont_en : pb.dont_es;
  const script  = (lang==='EN')? pb.script_en : pb.script_es;
  const res     = (lang==='EN')? pb.resources_en : pb.resources_es;
  assistantResult().innerHTML = `
    <h4>${issue.icon} ${(lang==='EN')?issue.name_en:issue.name_es}</h4>
    <strong>${lang==='EN'?'Do:':'Hacer:'}</strong>
    <ul>${doArr.map(x=>`<li>${x}</li>`).join('')}</ul>
    <strong>${lang==='EN'?"Don't:":'No hacer:'}</strong>
    <ul>${dontArr.map(x=>`<li>${x}</li>`).join('')}</ul>
    <strong>${lang==='EN'?'Say This:':'Diga esto:'}</strong>
    <p>${script}</p>
    <button class="secondary" id="assistantListen">🔊 ${lang==='EN'?'Listen':'Escuchar'}</button>
    <div class="row"><a class="primary" target="_blank" rel="noopener" href="${DATA.config.ambassadorFormURL}">${lang==='EN'?'Ask an Ambassador':'Pedir ayuda a Embajadora/o'}</a></div>
  `;
  document.getElementById('assistantListen').addEventListener('click', ()=> speak(script));
}

function scoreIssue(text){
  let best = null, score = 0;
  Object.keys(DATA.keywords).forEach(id=>{
    const hits = DATA.keywords[id].reduce((acc,kw)=> acc + (text.includes(kw)?1:0), 0);
    if(hits>score){ score = hits; best = id; }
  });
  return best;
}

// Speech
function speak(text){
  if(!('speechSynthesis' in window)){ alert(lang==='EN'?'Speech not supported on this device.':'El dispositivo no admite voz.'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const target = (lang==='EN') ? 'en' : 'es';
  const voice = voices.find(v=>v.lang.toLowerCase().startsWith(target));
  if(voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

// Boot
loadData().catch(err=>{
  document.body.innerHTML = `<pre style="padding:16px;color:#b00020;">Failed to load app data: ${err.message}</pre>`;
});
