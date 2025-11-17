// script.js
// Personalize as variáveis abaixo:
const HOST_EMAIL = 'karinemarcal13@gmail.com'; // definido conforme solicitado — e-mail que receberá os RSVPs via mailto

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initRSVP();
});

function initCountdown(){
  const dateEl = document.getElementById('wedding-date');
  const dt = dateEl?.dataset?.datetime;
  if(!dt) return;
  const target = new Date(dt).getTime();

  function update(){
    const now = Date.now();
    const diff = target - now;
    if(diff <= 0){
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    document.getElementById('days').textContent = String(days).padStart(2,'0');
    document.getElementById('hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
  }
  update();
  setInterval(update,1000);
}

function initRSVP(){
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('rsvp-success');
  const mailBtn = document.getElementById('mailto-btn');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = getFormData();
    if(!data) return;
    saveRSVP(data);
    successEl.hidden = false;
    setTimeout(()=> successEl.hidden = true, 5000);
    form.reset();
  });

  mailBtn.addEventListener('click', ()=>{
    const data = getFormData(true); // allow incomplete for mailto convenience
    if(!data) return;
    // incluir informações do evento no assunto e corpo do e-mail
    const eventTitle = 'Casamento — Carolina & João';
    const eventDate = '22/11/2026';
    const eventTime = '08:00';
    const eventLocation = 'Paróquia Santíssima Trindade — Rua Tuim 33, Arapongas, PR, 86709-380';
    const subject = encodeURIComponent(`${eventTitle} - ${eventDate} - RSVP${data.name ? ' - ' + data.name : ''}`);
    const body = encodeURIComponent(
      `Evento: ${eventTitle}\nData: ${eventDate}\nHorário: ${eventTime}\nLocal: ${eventLocation}\n\nNome: ${data.name || ''}\nEmail: ${data.email || ''}\nVai: ${data.attending || ''}\nAcompanhantes: ${data.guests || 0}\nMensagem: ${data.message || ''}`
    );
    const mailto = `mailto:${HOST_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  });
}

function getFormData(lenient=false){
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const attending = document.getElementById('attending').value;
  const guests = parseInt(document.getElementById('guests').value || '0',10);
  const message = document.getElementById('message').value.trim();
  if(!lenient){
    if(!name || !email || !attending){
      alert('Por favor preencha nome, email e se vai comparecer.');
      return null;
    }
  }
  return {name,email,attending,guests,message,ts:new Date().toISOString()};
}

function saveRSVP(data){
  try{
    const key = 'casamento_rsvps_v1';
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(data);
    localStorage.setItem(key, JSON.stringify(arr));
    // para o anfitrião: exportar pelo console
    console.info('RSVP salvo localmente:', data);
  }catch(err){
    console.error('Erro ao salvar RSVP',err);
  }
}

/* -------------------- recursos admin e UI -------------------- */

// mostra modal simples
function showModal(html){
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');
  content.innerHTML = html;
  modal.hidden = false;
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.hidden = true;
}

function isAdmin(){
  try{
    const p = new URLSearchParams(window.location.search);
    return p.get('admin') === '1' || p.get('admin') === 'true';
  }catch(e){return false}
}

function getSavedRSVPs(){
  const raw = localStorage.getItem('casamento_rsvps_v1');
  return raw ? JSON.parse(raw) : [];
}

function renderAdmin(){
  if(!isAdmin()) return;
  const adminSection = document.getElementById('admin');
  adminSection.hidden = false;
  const list = document.getElementById('admin-list');
  const arr = getSavedRSVPs();
  if(arr.length === 0){
    list.innerHTML = '<div class="item">Nenhum RSVP salvo ainda.</div>';
    return;
  }
  list.innerHTML = arr.map((r,i)=>{
    return `<div class="item"><strong>#${i+1}</strong> — ${escapeHtml(r.name||'')} (${escapeHtml(r.email||'')}) — Vai: ${escapeHtml(r.attending||'')} — Acompanhantes: ${r.guests||0}<br><small>${new Date(r.ts).toLocaleString()}</small><div class="admin-msg">${escapeHtml(r.message||'')}</div></div>`;
  }).join('');
}

function exportCSV(){
  const arr = getSavedRSVPs();
  if(!arr.length) return showModal('<p>Nenhum RSVP para exportar.</p>');
  const header = ['Nome','Email','Vai','Acompanhantes','Mensagem','Timestamp'];
  const rows = arr.map(r=>[
    csvSafe(r.name),csvSafe(r.email),csvSafe(r.attending),csvSafe(String(r.guests||0)),csvSafe(r.message),csvSafe(r.ts)
  ]);
  const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'rsvps_casamento.csv'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function clearRSVPs(){
  if(!confirm('Limpar todas as respostas salvas localmente? Esta ação não pode ser desfeita.')) return;
  localStorage.removeItem('casamento_rsvps_v1');
  renderAdmin();
}

function escapeHtml(str){
  return String(str||'').replace(/[&<>\"]/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[s]));
}

function csvSafe(val){
  const v = String(val||'').replace(/"/g,'""');
  if(v.includes(',') || v.includes('\n') || v.includes('"')) return `"${v.replace(/"/g,'""') }"`;
  return v;
}

// adicional: melhorias na inicialização
document.addEventListener('DOMContentLoaded', ()=>{
  // ligar botões admin
  const btnExport = document.getElementById('btn-export');
  const btnClear = document.getElementById('btn-clear');
  const modalClose = document.getElementById('modal-close');
  if(btnExport) btnExport.addEventListener('click', exportCSV);
  if(btnClear) btnClear.addEventListener('click', clearRSVPs);
  if(modalClose) modalClose.addEventListener('click', closeModal);
  // modal fechar clicando fora do painel
  const modal = document.getElementById('modal');
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  // smooth scroll for intra-page links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        history.replaceState(null,'',href);
      }
    });
  });
  // render admin if necessário
  renderAdmin();
});

