const projectData=[
{slug:'haproxy',unit:'U5',title:'HAProxy Load Balancer',type:'NETWORK',description:"Mise en place d'un système de répartition de charge avec HAProxy pour distribuer automatiquement le trafic web entre plusieurs serveurs Apache, avec gestion de la haute disponibilité et de la bascule en cas de panne.",tags:['HAProxy','Apache','Load Balancing','Linux'],link:'https://drive.google.com/file/d/1orJqhTzWo4JJt-atZo68q7DtiWmaQ8fi/view?usp=drive_link'},
{slug:'dns-web',unit:'U5',title:'DNS & Serveur Web',type:'SERVICES',description:"Configuration d'un serveur DNS pour la résolution de noms et mise en place d'un serveur web Apache, avec zones DNS, enregistrements A/CNAME et hôtes virtuels.",tags:['DNS','Bind9','Apache','Virtual Hosts'],link:'https://drive.google.com/file/d/1g-LJXD5bluByPVxsv0EKLNxTXw20EdfM/view?usp=drive_link'},
{slug:'linux-admin',unit:'U6',title:'Administration Linux',type:'LINUX',description:"Gestion des utilisateurs et groupes, permissions avancées, sécurisation de fichiers critiques et administration sudo avec journalisation des actions.",tags:['Linux Admin','Permissions','Sudo','Security'],link:'https://drive.google.com/file/d/16iajoQaNlVseb4Ib5dBC0HL9Tjr4eSQa/view?usp=drive_link'},
{slug:'infra-linux',unit:'U6',title:'Infrastructure Linux',type:'INFRA',description:"Déploiement et configuration d'une infrastructure Linux avec administration de serveurs, automatisation de tâches et scripts Bash.",tags:['Linux Server','Bash','Automation','Infrastructure'],link:'https://drive.google.com/file/d/1b6HA--aYYhMlNDoBfLRvXhCRyt4dofwh/view?usp=drive_link'},
{slug:'glpi',unit:'U7',title:'Serveur GLPI',type:'ITSM',description:"Déploiement d'une solution de gestion de parc permettant de centraliser l'inventaire matériel et logiciel et d'organiser le support technique via une plateforme Helpdesk.",tags:['GLPI','ITSM','Asset Management','Helpdesk'],link:'https://docs.google.com/document/d/1jUZxO36raOoGqUDvRdQHIABXzx9jBAA2/edit?usp=drive_link&ouid=113695881678060958123&rtpof=true&sd=true'},
{slug:'active-directory',unit:'U7',title:'Active Directory',type:'IDENTITY',description:"Mise en place d'un service d'annuaire centralisé permettant de structurer les comptes, les accès et les configurations du parc via des stratégies de groupe (GPO).",tags:['Windows Server','Active Directory','GPO','Identity'],link:'https://drive.google.com/file/d/1elvZpKq5xmvcdeelqnD0ypMBVhBlw6pe/view?usp=drive_link'}
];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

class Portfolio{
 constructor(){
  this.loading=$('#loading-screen');
  this.percent=$('.loading-percentage');
  this.status=$('.loading-status');
  this.main=$('#main-app');
  this.projects=$('#projects-overlay');
  this.terminal=$('#terminal-overlay');
  this.input=$('#terminal-input');
  this.init();
 }
 init(){this.boot();this.nav();this.projectsUI();this.terminalUI();this.scrollReveal();this.progress();this.parallax();}
 boot(){
  const screen=this.loading,percent=this.percent,status=this.status,main=this.main,bar=document.querySelector('.intro-progress-line i');
  const start=performance.now(),duration=2350; let done=false;
  const stages=[[0,'INITIALISATION DU PROFIL'],[.22,'AUTHENTIFICATION'],[.45,'CHARGEMENT DES DONNÉES'],[.68,'MONTAGE DE L’INTERFACE'],[.86,'ACCÈS AUTORISÉ'],[1,'CONNEXION ÉTABLIE']];
  const finish=()=>{if(done)return;done=true;clearInterval(timer);if(bar)bar.style.width='100%';if(percent)percent.textContent='100%';if(status)status.textContent='CONNEXION ÉTABLIE';screen.classList.add('closing');setTimeout(()=>{screen.classList.remove('active');main.classList.add('visible');},340);};
  const tick=()=>{const p=Math.min(1,(performance.now()-start)/duration);const eased=1-Math.pow(1-p,3);if(percent)percent.textContent=Math.floor(eased*100)+'%';if(bar)bar.style.width=(eased*100)+'%';let msg=stages[0][1];for(const [at,label] of stages){if(p>=at)msg=label;}if(status)status.textContent=msg;if(p>=1)finish();};
  const timer=setInterval(tick,24);tick();setTimeout(finish,duration+500);
 }
 nav(){
  const links=$$('.quick-nav a');
  const ids=['profil','experience','alternance','veille','projets','contact'];
  const update=()=>{let current='';const y=scrollY+innerHeight*.3;ids.forEach(id=>{const s=document.getElementById(id);if(s&&s.offsetTop<=y)current=id;});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));};
  addEventListener('scroll',update,{passive:true});update();
 }
 projectsUI(){
  const selector=$('#project-selector');
  const tabs=$$('.unit-tab');
  if(!selector)return;
  const counts={U5:projectData.filter(p=>p.unit==='U5').length,U6:projectData.filter(p=>p.unit==='U6').length,U7:projectData.filter(p=>p.unit==='U7').length};
  tabs.forEach(tab=>{tab.querySelector('b').textContent=String(counts[tab.dataset.unit]||0).padStart(2,'0');tab.addEventListener('click',()=>this.setUnit(tab.dataset.unit));});
  this.activeUnit='U5';
  this.renderUnit('U5');
  $('#projects-trigger')?.addEventListener('click',()=>document.getElementById('projets')?.scrollIntoView({behavior:'smooth'}));
 }
 setUnit(unit){
  this.activeUnit=unit;
  $$('.unit-tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.unit===unit));
  this.renderUnit(unit);
 }
 renderUnit(unit){
  const selector=$('#project-selector'); if(!selector)return;
  const projects=projectData.filter(p=>p.unit===unit);
  selector.innerHTML='';
  const caption=$('#unit-caption'); if(caption)caption.querySelector('strong').textContent=unit;
  const count=$('#unit-count'); if(count)count.textContent=String(projects.length).padStart(2,'0');
  projects.forEach((p,i)=>{
   const button=document.createElement('button'); button.className='project-select-btn'; button.dataset.project=p.slug;
   button.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><span>${p.title}<small>${p.type}</small></span><b>↗</b>`;
   button.addEventListener('click',()=>this.showProject(p.slug,true)); selector.appendChild(button);
  });
  projects[0]&&this.showProject(projects[0].slug,false);
 }
 showProject(slug,focus){
  const p=projectData.find(item=>item.slug===slug); if(!p)return;
  $$('.project-select-btn').forEach(b=>b.classList.toggle('active',b.dataset.project===slug));
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v;};
  set('#stage-type',p.type); set('#stage-code',`${p.unit} // ${p.title.toUpperCase()}`); set('#stage-title',p.title); set('#stage-description',p.description); set('#stage-meta-unit',p.unit); set('#stage-meta-stack',p.tags.slice(0,2).join(' · '));
  const tags=$('#stage-tags');if(tags)tags.innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');
  const web=$('#stage-web-link'); if(web)web.href=`projects/${p.slug}.html`;
  const report=$('#stage-report-link'); if(report)report.href=p.link;
  const core=$('.stage-core');if(core){core.textContent=p.unit;core.animate([{transform:'scale(.88)',opacity:.35},{transform:'scale(1.06)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});}
  if(focus)document.getElementById('project-stage')?.scrollIntoView({behavior:'smooth',block:'center'});
 }
 terminalUI(){
  const open=()=>{this.terminal.classList.add('active');this.terminal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>this.input?.focus(),100);};
  const close=()=>{this.terminal.classList.remove('active');this.terminal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  $('#terminal-trigger')?.addEventListener('click',open);$('#hero-terminal')?.addEventListener('click',open);$('#close-terminal')?.addEventListener('click',close);
  this.terminal?.addEventListener('click',e=>{if(e.target===this.terminal)close();});
  this.input?.addEventListener('keydown',e=>{
   if(e.key!=='Enter')return;
   const value=e.target.value.trim().toLowerCase(),body=$('#terminal-body');
   const line=document.createElement('p');line.innerHTML=`<span class="console-green">system@rb:~$</span> ${this.escape(e.target.value)}`;body.insertBefore(line,$('.terminal-command'));e.target.value='';
   if(value==='clear'){body.innerHTML='<div class="terminal-command"><span class="console-green">system@rb:~$</span><input id="terminal-input" autocomplete="off" spellcheck="false"></div>';this.input=$('#terminal-input');this.input.focus();this.terminalInputBind();return;}
   const out=document.createElement('p');
   if(['projects','projets'].includes(value)){out.textContent='→ ouverture de la grille projets.';document.getElementById('projets')?.scrollIntoView({behavior:'smooth'});close();}
   else if(value==='experience'){out.textContent='→ parcours: 09.2025 / 07.2025 / 06.2025 / 01.2023 / 05.2022.';document.getElementById('experience')?.scrollIntoView({behavior:'smooth'});close();}
   else if(value==='veille'){out.textContent='→ radar actif: SASE / Zero Trust · IA réseau · post-quantique.';document.getElementById('veille')?.scrollIntoView({behavior:'smooth'});close();}
   else if(value==='contact'){out.textContent='→ romain.barbiere77@gmail.com';}
   else if(value==='synthese'){out.textContent='→ ouverture du tableau de synthèse des réalisations.';document.getElementById('synthese')?.scrollIntoView({behavior:'smooth'});close();}
   else out.textContent='Commande inconnue. Essayez: projects, experience, veille, synthese, contact, clear.';
   body.insertBefore(out,$('.terminal-command'));
  });
 }
 terminalInputBind(){this.input?.addEventListener('keydown',e=>{if(e.key==='Enter')this.terminalUI();});}
 scrollReveal(){
  const items=$$('.glass-card,.watch-card,.timeline-item,.project-select-btn,.project-stage');
  const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -35px'});
  items.forEach((el,i)=>{el.style.animationDelay=Math.min(i*45,400)+'ms';obs.observe(el);});
 }
 progress(){const bar=$('#scroll-progress');const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.width=(max>0?scrollY/max*100:0)+'%';};addEventListener('scroll',update,{passive:true});update();}
 parallax(){const scene=$('.hero-scene');if(!scene)return;addEventListener('mousemove',e=>{const x=(innerWidth/2-e.clientX)/50,y=(innerHeight/2-e.clientY)/60;scene.style.transform=`translate3d(${x}px,${y}px,0)`;},{passive:true});}
 escape(t){return t.replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
}

document.addEventListener('DOMContentLoaded',()=>new Portfolio());

document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.terminal-overlay.active,.projects-overlay.active').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');});});
