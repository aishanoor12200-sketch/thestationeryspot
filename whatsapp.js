(() => {
  const number='923271576380';
  const add=()=>{ if(document.querySelector('.whatsapp-float')) return; const a=document.createElement('a'); a.className='whatsapp-float'; a.href=`https://wa.me/${number}`; a.target='_blank'; a.rel='noopener noreferrer'; a.setAttribute('aria-label','Chat with The Stationery Spot on WhatsApp'); a.innerHTML='💬 <span>Chat with us</span>'; document.body.append(a); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',add); else add();
})();
