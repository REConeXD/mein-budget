(() => {
const KEY='mein-budget-data-v2', $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10), monthNow=()=>today().slice(0,7);
const money=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number(n)||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fresh=()=>({transactions:[],savings:[],debts:[],budgets:{},settings:{defaultBudget:0}});
let data; try{data=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{data=fresh();}
data.transactions||=[];data.savings||=[];data.debts||=[];data.budgets||={};data.settings||={defaultBudget:0};
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));render();};
const month=()=> $('month-filter').value||monthNow();
const txMonth=()=> $('tx-month-filter').value||month();
const inMonth=m=>data.transactions.filter(t=>(t.date||'').slice(0,7)===m);
const sumType=(arr,type)=>arr.filter(t=>t.type===type).reduce((s,t)=>s+Number(t.amount||0),0);
const budget=m=>Number(data.budgets[m]??data.settings.defaultBudget??0);
const id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function setPage(p){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));$('page-'+p).classList.remove('hidden');document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p));$('page-title').textContent=({overview:'Übersicht',saving:'Sparen',budget:'Budget',debts:'Schulden',more:'Mehr'})[p];window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{setPage(b.dataset.go);$('tx-type').value=b.dataset.add||'expense';$('tx-amount').focus();}));
function empty(el,msg){el.innerHTML=`<div class="empty">${esc(msg)}</div>`;}
function renderOverview(){
 const m=month(),tx=inMonth(m),inc=sumType(tx,'income'),exp=sumType(tx,'expense'),bud=budget(m);
 $('balance').textContent=money(sumType(data.transactions,'income')-sumType(data.transactions,'expense'));
 $('income-total').textContent=money(inc);$('expense-total').textContent=money(exp);$('remaining').textContent=money(bud-exp);$('remaining').className='amount '+(bud-exp<0?'red':'green');
 $('budget-caption').textContent=bud>0?`Monatsbudget für ${m}`:'Noch kein Monatsbudget festgelegt';
 const pct=bud>0?Math.round(exp/bud*100):0;$('budget-percent').textContent=bud>0?`${pct}% genutzt`:'Kein Budget';$('budget-progress').style.width=Math.min(100,pct)+'%';$('budget-progress').style.background=exp>bud?'var(--red)':'var(--green)';$('budget-used').textContent=money(exp)+' ausgegeben';$('budget-total-label').textContent=money(bud)+' geplant';
 const recent=[...data.transactions].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,5);
 if(!recent.length)return empty($('recent-list'),'Noch keine Buchungen. Erfasse deine erste Einnahme oder Ausgabe unter Budget.');
 $('recent-list').innerHTML=recent.map(t=>`<div class="item"><div class="item-main"><div class="item-title">${esc(t.title)}</div><div class="item-sub">${esc(t.category)} · ${esc(t.date)}</div></div><strong class="${t.type==='income'?'green':'red'}">${t.type==='income'?'+':'−'}${money(t.amount)}</strong></div>`).join('');
}
function renderTx(){
 const arr=inMonth(txMonth()).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 if(!arr.length)return empty($('transaction-list'),'Für diesen Monat gibt es noch keine Buchungen.');
 $('transaction-list').innerHTML=arr.map(t=>`<div class="item"><div class="item-main"><div class="item-title">${esc(t.title)}</div><div class="item-sub">${esc(t.category)} · ${esc(t.date)}</div></div><div style="text-align:right"><strong class="${t.type==='income'?'green':'red'}">${t.type==='income'?'+':'−'}${money(t.amount)}</strong><br><button class="btn danger small" data-delete-tx="${esc(t.id)}">Löschen</button></div></div>`).join('');
 document.querySelectorAll('[data-delete-tx]').forEach(b=>b.onclick=()=>{if(confirm('Diese Buchung löschen?')){data.transactions=data.transactions.filter(t=>t.id!==b.dataset.deleteTx);save();}});
}
function renderSavings(){
 if(!data.savings.length)return empty($('saving-list'),'Noch keine Sparziele. Lege oben dein erstes Ziel an.');
 $('saving-list').innerHTML=data.savings.map(s=>{let pct=Math.min(100,Math.round(Number(s.current)/Number(s.target)*100)||0);return `<div class="card"><div class="row"><h3>${esc(s.name)}</h3><button class="btn danger small" data-delete-saving="${esc(s.id)}">Löschen</button></div><div class="row"><span class="muted tiny">Schon gespart</span><strong>${money(s.current)} / ${money(s.target)}</strong></div><div class="progress"><span style="width:${pct}%"></span></div><div class="row tiny muted"><span>${pct}% erreicht</span><span>${s.date?'Ziel: '+esc(s.date):''}</span></div><div class="formrow"><div class="field"><label>Zusätzlicher Sparbetrag (€)</label><input type="number" min="0" step=".01" id="saveadd-${esc(s.id)}" placeholder="25"></div><button class="btn small" style="align-self:end;margin-bottom:10px" data-add-saving="${esc(s.id)}">Eintragen</button></div></div>`}).join('');
 document.querySelectorAll('[data-delete-saving]').forEach(b=>b.onclick=()=>{if(confirm('Dieses Sparziel löschen?')){data.savings=data.savings.filter(s=>s.id!==b.dataset.deleteSaving);save();}});
 document.querySelectorAll('[data-add-saving]').forEach(b=>b.onclick=()=>{let n=Number($('saveadd-'+b.dataset.addSaving).value);if(n>0){let s=data.savings.find(s=>s.id===b.dataset.addSaving);s.current=Number(s.current)+n;save();}});
}
function renderDebts(){
 $('debt-total').textContent=money(data.debts.reduce((s,d)=>s+Number(d.remaining||0),0));
 if(!data.debts.length)return empty($('debt-list'),'Du hast noch keine Schulden eingetragen.');
 $('debt-list').innerHTML=data.debts.map(d=>{let pct=Number(d.original)>0?Math.min(100,Math.round((Number(d.original)-Number(d.remaining))/Number(d.original)*100)):0;return `<div class="card"><div class="row"><h3>${esc(d.name)}</h3><button class="btn danger small" data-delete-debt="${esc(d.id)}">Löschen</button></div><div class="row"><span class="muted tiny">Noch offen</span><strong class="red">${money(d.remaining)}</strong></div><div class="progress"><span style="width:${pct}%"></span></div><div class="row tiny muted"><span>${pct}% zurückgezahlt</span><span>Ursprünglich: ${money(d.original)}</span></div><div class="item-sub">${d.due?'Fällig: '+esc(d.due)+' · ':''}Monatliche Rate: ${money(d.payment||0)}</div><div class="formrow"><div class="field"><label>Rückzahlung (€)</label><input id="debtpay-${esc(d.id)}" type="number" min=".01" step=".01" placeholder="50"></div><button class="btn small" style="align-self:end;margin-bottom:10px" data-pay-debt="${esc(d.id)}">Abziehen</button></div></div>`}).join('');
 document.querySelectorAll('[data-delete-debt]').forEach(b=>b.onclick=()=>{if(confirm('Diese Schuld löschen?')){data.debts=data.debts.filter(d=>d.id!==b.dataset.deleteDebt);save();}});
 document.querySelectorAll('[data-pay-debt]').forEach(b=>b.onclick=()=>{let n=Number($('debtpay-'+b.dataset.payDebt).value);if(n>0){let d=data.debts.find(d=>d.id===b.dataset.payDebt);d.remaining=Math.max(0,Number(d.remaining)-n);save();}});
}
function render(){
 $('month-filter').value=month();$('monthly-budget').value=budget(month())||'';$('default-budget').value=Number(data.settings.defaultBudget)||'';
 renderOverview();renderTx();renderSavings();renderDebts();
}
$('month-filter').value=monthNow();$('tx-month-filter').value=monthNow();$('tx-date').value=today();
$('month-filter').onchange=render;$('tx-month-filter').onchange=renderTx;
$('budget-form').onsubmit=e=>{e.preventDefault();let n=Number($('monthly-budget').value);if(n<0)return alert('Bitte einen gültigen Betrag eingeben.');data.budgets[month()]=n;save();alert('Monatsbudget gespeichert.');};
$('transaction-form').onsubmit=e=>{e.preventDefault();let n=Number($('tx-amount').value);if(!(n>0))return alert('Bitte einen Betrag größer als 0 eingeben.');data.transactions.push({id:id(),type:$('tx-type').value,amount:n,title:$('tx-title').value.trim(),category:$('tx-category').value,date:$('tx-date').value||today()});e.target.reset();$('tx-date').value=today();save();alert('Buchung gespeichert.');};
$('saving-form').onsubmit=e=>{e.preventDefault();let target=Number($('saving-target').value),current=Number($('saving-current').value);if(!(target>0)||current<0)return alert('Bitte gültige Beträge eingeben.');data.savings.push({id:id(),name:$('saving-name').value.trim(),target,current,date:$('saving-date').value});e.target.reset();$('saving-current').value='0';save();alert('Sparziel hinzugefügt.');};
$('debt-form').onsubmit=e=>{e.preventDefault();let original=Number($('debt-original').value),remaining=Number($('debt-remaining').value);if(!(original>0)||remaining<0)return alert('Bitte gültige Beträge eingeben.');data.debts.push({id:id(),name:$('debt-name').value.trim(),original,remaining,due:$('debt-due').value,payment:Number($('debt-payment').value)||0});e.target.reset();save();alert('Schuld gespeichert.');};
$('save-settings').onclick=()=>{data.settings.defaultBudget=Number($('default-budget').value)||0;save();alert('Einstellungen gespeichert.');};
$('export-btn').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`mein-budget-backup-${today()}.json`;a.click();URL.revokeObjectURL(url);};
$('import-btn').onclick=()=>$('import-file').click();
$('import-file').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let x=JSON.parse(await f.text());if(!x||!Array.isArray(x.transactions)||!Array.isArray(x.savings)||!Array.isArray(x.debts))throw 0;if(confirm('Backup importieren? Aktuelle Daten werden ersetzt.')){data=Object.assign(fresh(),x);save();alert('Backup importiert.');}}catch{alert('Ungültige Backup-Datei.');}e.target.value='';};
$('clear-data').onclick=()=>{if(confirm('Wirklich alle lokalen Budget-Daten löschen? Nicht rückgängig zu machen.')){localStorage.removeItem(KEY);data=fresh();save();alert('Lokale Daten gelöscht.');}};
render();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();