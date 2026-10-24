/* Shared navigation, inquiry forms, editable galleries and progressive video. */
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

// Remove decorative arrows without replacing button contents or event handlers.
// Text nodes are edited individually, preserving nested icons and screen-reader text.
function removeActionArrows(root) {
  const selector = 'a.btn, button.btn, a.fow-text-link, a.swl-text-link, a.nav-plan';
  const actions = root.nodeType === 1 && root.matches(selector) ? [root] : [];
  if (root.querySelectorAll) actions.push(...root.querySelectorAll(selector));
  for (const action of actions) {
    const walker = document.createTreeWalker(action, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const cleaned = node.nodeValue.replace(/[\u2190-\u21ff\u2794\u279c\u27a1\u27f6]/gu, '');
      if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
    }
    action.querySelectorAll('.fa-arrow-right, .fa-arrow-up-right, .fa-arrow-up-right-from-square, .fa-long-arrow-alt-right, .fa-long-arrow-right').forEach(icon => icon.remove());
    const label = action.getAttribute('aria-label');
    if (label) action.setAttribute('aria-label', label.replace(/[\u2190-\u21ff\u2794\u279c\u27a1\u27f6]/gu, '').trim());
  }
}
removeActionArrows(document);
// Also clean action links added later by the shop or other shared content.
new MutationObserver(records => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node.nodeType === 1) removeActionArrows(node);
      else if (node.nodeType === 3 && node.parentElement) removeActionArrows(node.parentElement);
    }
  }
}).observe(document.body, { childList: true, subtree: true });

const menu=$('#mobileMenu'), toggle=$('.mobile-toggle');
function closeMenu(){if(!menu||!toggle)return;menu.hidden=true;menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu');}
function closeDropdowns(except){$$('.dropdown').forEach(d=>{if(d!==except){d.classList.remove('is-open');d.querySelector('button')?.setAttribute('aria-expanded','false');}});}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;menu.classList.toggle('active',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');closeDropdowns();});
$$('.dropdown-toggle').forEach(b=>b.addEventListener('click',()=>{const d=b.closest('.dropdown'),open=b.getAttribute('aria-expanded')!=='true';closeDropdowns(d);d.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));}));
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown'))closeDropdowns();if(menu&&!menu.contains(e.target)&&!toggle?.contains(e.target))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=document.activeElement;if(menu&&!menu.hidden){closeMenu();toggle.focus();}closeDropdowns();if(active?.closest('.dropdown'))active.closest('.dropdown').querySelector('button').focus();}});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('focusin',e=>{if(!e.target.closest('.dropdown'))closeDropdowns();});
const mq=matchMedia('(min-width: 1051px)');mq.addEventListener('change',e=>{if(e.matches)closeMenu();});
const nav=$('.site-nav');function sizeNav(){nav?.classList.toggle('shrink',scrollY>40);if(nav)document.documentElement.style.setProperty('--fow-nav-height',nav.offsetHeight+'px');}sizeNav();addEventListener('scroll',()=>nav?.classList.toggle('shrink',scrollY>40),{passive:true});addEventListener('resize',sizeNav);if(nav&&window.ResizeObserver)new ResizeObserver(sizeNav).observe(nav);
const path=location.pathname.split('/').pop()||'index.html';$$('.nav-links a, #mobileMenu a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page');});
// Dates are based on the business's time zone, not UTC.
const dateParts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=t=>dateParts.find(p=>p.type===t).value;const today=`${part('year')}-${part('month')}-${part('day')}`;
$$('[data-future-date]').forEach(e=>e.min=today);
$$('[data-package]').forEach(a=>a.addEventListener('click',()=>{const select=$('[data-inquiry="birthday"] [name="package"]');if(select){const option=[...select.options].find(o=>o.textContent.includes('$'+a.dataset.package));if(option)select.value=option.value;}}));
$$('form[data-inquiry]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();if(form.dataset.sending==='true'||!form.reportValidity())return;const button=form.querySelector('[type="submit"]'),status=form.querySelector('[role="status"]'),label=button.textContent;form.dataset.sending='true';button.disabled=true;button.textContent='Sending…';status.textContent='';const data=new FormData(form);data.set('submitted_at_client',new Date().toISOString());try{const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!response.ok)throw Error('Could not confirm receipt');location.assign('thank-you.html?type='+encodeURIComponent(form.dataset.inquiry));}catch(err){status.textContent='We couldn’t confirm receipt. Your answers are still here. Please email hello@fluffonwheels.com or call (920) 664-8282 before retrying if the connection dropped.';button.disabled=false;button.textContent=label;form.dataset.sending='false';}}));
// Content is intentionally plain data, so adding photos never requires layout changes.
let contentRendered=false;
function renderContent(){const c=window.FOW_CONTENT;if(!c||contentRendered)return;contentRendered=true;
$$('[data-media]').forEach(img=>{if(c.media?.[img.dataset.media])img.src=c.media[img.dataset.media];});
const gallery=$('#fow-gallery'),dialog=$('#gallery-lightbox');let opener;
function restoreFocus(){opener?.focus();}dialog?.addEventListener('close',restoreFocus);dialog?.querySelector('button').addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
if(gallery){for(const entry of c.gallery||[]){const figure=document.createElement('figure'),button=document.createElement('button'),img=document.createElement('img');button.type='button';button.className='fow-gallery-open';button.setAttribute('aria-label','Enlarge photo: '+entry.alt);img.src=entry.image;img.alt=entry.alt;img.loading='lazy';button.append(img);figure.append(button);if(entry.caption){const cap=document.createElement('figcaption');cap.textContent=entry.caption;figure.append(cap);}button.addEventListener('click',()=>{opener=button;dialog.querySelector('img').src=entry.image;dialog.querySelector('img').alt=entry.alt;dialog.querySelector('p').textContent=entry.caption||entry.alt;dialog.showModal();});gallery.append(figure);}}
const crew=$('#fow-crew');if(crew){const labels={regular:'Regular favorite',rotating:'Rotating friend',seasonal:'Seasonal friend'};for(const entry of c.crew||[]){const article=document.createElement('article');article.className='fow-crew-card';article.dataset.category=entry.category;const photo=document.createElement('div');photo.className='fow-crew-photo';const img=document.createElement('img');img.src=entry.image;img.alt=entry.alt||entry.name;img.loading='lazy';photo.append(img);const tag=document.createElement('span');tag.className='fow-crew-category';tag.textContent=labels[entry.category]||'Plush friend';const title=document.createElement('h2');title.textContent=entry.name;article.append(photo,tag,title);crew.append(article);}
$$('[data-crew-filter]').forEach(b=>b.addEventListener('click',()=>{const category=b.dataset.crewFilter;$$('[data-crew-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let visible=0;crew.querySelectorAll('article').forEach(a=>{a.hidden=category!=='all'&&a.dataset.category!==category;if(!a.hidden)visible++;});$('#crew-empty').hidden=visible>0;}));}
// Lazy-load video only near the viewport; retain photos on missing files, autoplay failure,
// reduced-motion preferences, or data saver. Do not show a broken player.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData){
 const load=slot=>{if(slot.dataset.loaded)return;slot.dataset.loaded='true';const config=c.videos?.[slot.dataset.videoSlot];if(!config?.src)return;const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.autoplay=true;video.preload='metadata';video.setAttribute('aria-label',slot.querySelector('img')?.alt||'Plush-making video');video.setAttribute('aria-hidden','true');const source=document.createElement('source');source.src=config.src;source.type=config.type||'video/mp4';video.append(source);let control;function fallback(){video.remove();control?.remove();slot.classList.remove('has-video');}
video.addEventListener('error',fallback);source.addEventListener('error',fallback);video.addEventListener('playing',()=>{slot.classList.add('has-video');video.removeAttribute('aria-hidden');if(!control){control=document.createElement('button');control.type='button';control.className='fow-video-control';control.textContent='Pause video';control.setAttribute('aria-label','Pause decorative video');control.addEventListener('click',()=>{if(video.paused){video.play().then(()=>{control.textContent='Pause video';}).catch(fallback);}else{video.pause();control.textContent='Play video';}});slot.after(control);}});slot.append(video);video.play().catch(fallback);};
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){load(e.target);observer.unobserve(e.target);}}),{rootMargin:'160px'});$$('[data-video-slot]').forEach(s=>observer.observe(s));}else $$('[data-video-slot]').forEach(load);
}
}
addEventListener('fow-content-ready',renderContent);renderContent();
})();
