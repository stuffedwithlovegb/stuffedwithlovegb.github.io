/* Stuff At Home: products published from Ops, plus a persistent cart. */
(function(){
'use strict';
const KEY='swl-stuff-at-home-cart-v1';
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const legacy={teddy:'Honey Teddy',dog:'Golden Retriever',dino:'Dino',unicorn:'Unicorn'};
const legacyImages={teddy:'shop-teddy.png',dog:'shop-dog.png',dino:'shop-dino.png',unicorn:'shop-unicorn.png'};
let CATALOG=[],loaded=false,storageOK=true;
const item=id=>CATALOG.find(p=>p.id===id)||{id,name:legacy[id]||'Saved plush selection',image:legacyImages[id]||'shop-teddy.png',price:2999,enabled:false};
const name=c=>c.productName||item(c.productId).name;
function safeImage(src){return typeof src==='string'&&((src.startsWith('/')&&!src.startsWith('//'))||/^shop-(teddy|dog|dino|unicorn)\.png$/.test(src))?src:'shop-teddy.png';}
function cleanChild(c){
 if(!c||typeof c.productId!=='string'||!c.productId||c.productId.length>180)throw Error('Invalid friend');
 return {productId:c.productId,productName:String(c.productName||legacy[c.productId]||'Saved plush selection').slice(0,100),
 kitPrice:Number.isSafeInteger(c.kitPrice)&&c.kitPrice>=100&&c.kitPrice<=100000?c.kitPrice:2999,
 image:safeImage(c.image||legacyImages[c.productId]),shirt:c.shirt===true,
 shirtName:c.shirt===true?String(c.shirtName||'').trim().slice(0,40):'',recorder:c.recorder===true};
}
function normalize(raw){if(!Array.isArray(raw))return [];return raw.slice(0,50).flatMap(r=>{try{
 const quantity=Math.max(1,Math.min(20,Math.floor(Number(r.quantity)||1)));
 const id=String(r.id||crypto.randomUUID());
 if(r.kind==='kit')return [{id,kind:'kit',quantity,...cleanChild(r)}];
 if(r.kind==='birthday'&&Array.isArray(r.children)&&r.children.length===10)return [{id,kind:'birthday',quantity,children:r.children.map(cleanChild)}];
 }catch(e){}return [];});}
let cart=[];try{cart=normalize(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch(e){storageOK=false;}
function enrich(c){const p=CATALOG.find(p=>p.id===c.productId);return p?{...c,productName:p.name,kitPrice:p.price,image:p.image}:c;}
function refreshCart(){cart=cart.map(r=>r.kind==='birthday'?{...r,children:r.children.map(enrich)}:{...r,...enrich(r)});}
const extra=c=>(c.shirt?1000:0)+(c.recorder?1000:0);
const unitPrice=r=>r.kind==='birthday'?25000+r.children.reduce((n,c)=>n+extra(c),0):(r.kitPrice??2999)+extra(r);
const subtotal=()=>cart.reduce((n,r)=>n+unitPrice(r)*r.quantity,0);
const count=()=>cart.reduce((n,r)=>n+r.quantity*(r.kind==='birthday'?10:1),0);
const available=r=>loaded&&(r.kind==='birthday'?r.children.every(c=>CATALOG.some(p=>p.id===c.productId)):CATALOG.some(p=>p.id===r.productId));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(cart));}catch(e){storageOK=false;}}
function save(){persist();render();window.dispatchEvent(new Event('swl-cart-change'));}
function add(r){if(!available(r))throw Error('This friend is unavailable. Please refresh the shop.');
 const signature=x=>JSON.stringify({...x,id:undefined,quantity:undefined});const same=cart.find(x=>signature(x)===signature(r));
 if(same){if(same.quantity+r.quantity>20)throw Error('Please limit each selection to 20.');same.quantity+=r.quantity;}
 else{if(cart.length>=50)throw Error('Your cart is full. Please contact us for larger orders.');cart.push({...r,id:crypto.randomUUID()});}save();}
const extras=c=>[c.shirt?'Name shirt: '+c.shirtName:null,c.recorder?'Voice recorder':null].filter(Boolean).join(' · ')||'Kit only';
const description=r=>r.kind==='birthday'?r.children.map((c,i)=>`${i+1}. ${name(c)} — ${extras(c)}`).join('\n'):extras(r);
function toast(message){const t=document.getElementById('shop-toast');if(!t)return;t.textContent=message;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,5000);}
function render(){
 document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=count());
 const target=document.getElementById('cart-items');if(!target)return;
 target.innerHTML=cart.length?cart.map(r=>`<article class="swl-cart-line"><img src="${esc(safeImage(r.kind==='birthday'?'shop-teddy.png':r.image))}" alt="${esc(r.kind==='birthday'?'Birthday Box':name(r))}"><div><h2>${r.kind==='birthday'?'Birthday Box · 10 kits':esc(name(r))}</h2>${r.kind==='birthday'?`<details><summary>View your 10 friends &amp; extras</summary><p class="swl-line-details">${esc(description(r))}</p></details>`:`<p>${esc(extras(r))}</p>`}${loaded&&!available(r)?'<p class="swl-fine"><strong>A selected friend is no longer available. Remove this selection and choose from the shop.</strong></p>':''}<p class="swl-fine">${money(unitPrice(r))} ${r.kind==='birthday'?'per box':'each'}</p><div class="swl-quantity"><button type="button" data-change="-1" data-id="${esc(r.id)}" aria-label="Decrease quantity">−</button><span aria-label="Quantity">${r.quantity}</span><button type="button" data-change="1" data-id="${esc(r.id)}" aria-label="Increase quantity">+</button><button type="button" class="swl-remove" data-remove="${esc(r.id)}">Remove</button></div></div><strong>${money(unitPrice(r)*r.quantity)}</strong></article>`).join(''):'<div class="swl-empty"><h2>Your crew is waiting.</h2><p>Your cart is empty. Let’s find you a new friend!</p><a href="stuff-at-home.html" class="btn btn-primary">Choose Your Friend</a></div>';
 document.getElementById('cart-subtotal').textContent=money(subtotal());
 document.getElementById('cart-checkout').hidden=!cart.length||!loaded||cart.some(r=>!available(r));
 document.getElementById('cart-storage-status').textContent=!storageOK?'Your browser could not save your cart. Allow site storage to continue shopping across pages.':!loaded?'Checking which friends are available…':'';
}
const products=document.getElementById('shop-products'),builder=document.getElementById('birthday-builder');
function renderProducts(){
 const preview=document.getElementById('birthday-preview');if(preview)preview.innerHTML=CATALOG.slice(0,4).map(p=>`<img src="${esc(p.image)}" alt="${esc(p.name)}">`).join('');
 if(products)products.innerHTML=CATALOG.length?CATALOG.map(p=>`<article class="swl-product"><div class="swl-product-photo"><span>${esc(p.tag)}</span><img src="${esc(p.image)}" alt="${esc(p.name)} finished plush" loading="lazy"></div><div class="swl-product-info"><h3>${esc(p.name)}</h3><p>${esc(p.copy)}</p><p class="swl-product-price">${money(p.price)} <small>DIY kit</small></p><form data-product="${esc(p.id)}"><label class="swl-option"><input type="checkbox" name="shirt"> Custom name shirt <strong>+$10</strong></label><label class="swl-name-field" hidden>Name on shirt<input name="shirtName" maxlength="40" disabled placeholder="Exactly as you’d like it printed"></label><label class="swl-option"><input type="checkbox" name="recorder"> Voice recorder <strong>+$10</strong></label><div class="swl-add-row"><label>Qty<input type="number" name="quantity" min="1" max="20" value="1" required></label><button type="submit" class="btn btn-primary">Add to Cart</button></div><p class="swl-product-message" role="status"></p></form></div></article>`).join(''):'<p>No friends are available to order right now. Please check back soon!</p>';
 if(builder){document.getElementById('birthday-children').innerHTML=CATALOG.length?Array.from({length:10},(_,i)=>`<fieldset class="swl-child"><legend>Friend ${i+1}</legend><label>Plush<select name="friend-${i}">${CATALOG.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select></label><label class="swl-option"><input type="checkbox" name="shirt-${i}"> Name shirt +$10</label><label class="swl-child-name" hidden>Name on shirt<input name="name-${i}" maxlength="40" disabled placeholder="Name exactly as printed"></label><label class="swl-option"><input type="checkbox" name="recorder-${i}"> Voice recorder +$10</label></fieldset>`).join(''):'<p>Birthday Boxes will be available when our friends are back in the shop.</p>';
 builder.querySelector('button[type="submit"]').disabled=!CATALOG.length;
 }
}
products?.addEventListener('change',e=>{if(e.target.name==='shirt'){const f=e.target.form,n=f.elements.shirtName;f.querySelector('.swl-name-field').hidden=!e.target.checked;n.required=e.target.checked;n.disabled=!e.target.checked;}});
products?.addEventListener('submit',e=>{e.preventDefault();const f=e.target,msg=f.querySelector('[role="status"]');try{
 const p=item(f.dataset.product),r={kind:'kit',productId:p.id,productName:p.name,kitPrice:p.price,image:p.image,shirt:f.elements.shirt.checked,shirtName:f.elements.shirtName.value.trim(),recorder:f.elements.recorder.checked,quantity:Number(f.elements.quantity.value)};
 if(!Number.isSafeInteger(r.quantity)||r.quantity<1||r.quantity>20)throw Error('Choose a quantity from 1 to 20.');
 if(r.shirt&&!r.shirtName)throw Error('Please enter a name for your shirt.');add(r);msg.textContent='Added!';toast(p.name+' added to your bag ✨');
 }catch(err){msg.textContent=err.message;}});
builder?.addEventListener('change',()=>{let price=25000;for(let i=0;i<10;i++){const shirt=builder.elements['shirt-'+i]?.checked,n=builder.elements['name-'+i];if(!n)return;n.required=shirt;n.disabled=!shirt;n.closest('label').hidden=!shirt;price+=(shirt?1000:0)+(builder.elements['recorder-'+i].checked?1000:0);}document.getElementById('birthday-total').textContent=money(price);});
builder?.addEventListener('submit',e=>{e.preventDefault();try{const children=Array.from({length:10},(_,i)=>{const p=item(builder.elements['friend-'+i].value);return {productId:p.id,productName:p.name,kitPrice:p.price,image:p.image,shirt:builder.elements['shirt-'+i].checked,shirtName:builder.elements['name-'+i].value.trim(),recorder:builder.elements['recorder-'+i].checked};});if(children.some(c=>c.shirt&&!c.shirtName))throw Error('Please enter a name for each selected shirt.');add({kind:'birthday',quantity:1,children});toast('Your Birthday Box is in the bag ✨');}catch(err){toast(err.message);}});
document.getElementById('cart-items')?.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.dataset.remove)cart=cart.filter(r=>r.id!==button.dataset.remove);else if(button.dataset.change){const r=cart.find(r=>r.id===button.dataset.id);if(r){r.quantity=Math.min(20,r.quantity+Number(button.dataset.change));if(r.quantity<1)cart=cart.filter(x=>x!==r);}}save();});
window.addEventListener('storage',e=>{if(e.key===KEY){try{cart=normalize(JSON.parse(e.newValue||'[]'));refreshCart();}catch(err){cart=[];}render();window.dispatchEvent(new Event('swl-cart-change'));}});
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement&&e.target.closest('.swl-shop')&&!e.target.src.endsWith('/shop-teddy.png'))e.target.src='shop-teddy.png';},true);
if(document.body.dataset.shopNav==='true'){const toggle=document.querySelector('.mobile-toggle'),menu=document.getElementById('mobileMenu'),nav=document.querySelector('.site-nav');if(toggle&&menu){toggle.addEventListener('click',e=>{e.stopPropagation();const open=menu.classList.toggle('active');toggle.setAttribute('aria-expanded',String(open));});document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target)){menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}});}if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('shrink',window.scrollY>40),{passive:true});}
window.SWLShop={get CATALOG(){return CATALOG;},get catalogReady(){return loaded;},money,esc,item,name,unitPrice,description,available,getCart:()=>JSON.parse(JSON.stringify(cart)),subtotal,clear:()=>{cart=[];save();}};
render();if(products)products.innerHTML='<p role="status">Finding your new friends…</p>';if(builder)builder.querySelector('button[type="submit"]').disabled=true;
window.SWLShop.ready=(async()=>{try{
 const r=await fetch('/shop/api/catalog',{cache:'no-store'});const d=await r.json();if(!r.ok||!Array.isArray(d.products))throw Error('We couldn’t load our friends. Please refresh or contact us.');
 CATALOG=d.products.filter(p=>p.enabled&&typeof p.id==='string'&&Number.isSafeInteger(p.price));loaded=true;refreshCart();persist();renderProducts();render();
 }catch(e){if(products)products.innerHTML='<p role="alert">We couldn’t load our friends. Please refresh or contact us.</p>';const notice=document.getElementById('cart-storage-status');if(notice)notice.textContent='We couldn’t check availability. Refresh this page before checking out.';}window.dispatchEvent(new Event('swl-catalog-ready'));})();
})();
