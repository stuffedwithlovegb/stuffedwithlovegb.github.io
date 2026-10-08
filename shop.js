/* Stuff At Home: shared catalog and persistent cart. Prices are rechecked by the Worker. */
(function () {
  'use strict';
  if(document.body.dataset.shopNav==='true'){const toggle=document.querySelector('.mobile-toggle'),menu=document.getElementById('mobileMenu'),nav=document.querySelector('.site-nav');if(toggle&&menu){toggle.addEventListener('click',e=>{e.stopPropagation();const open=menu.classList.toggle('active');toggle.setAttribute('aria-expanded',String(open));});document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target)){menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}});}if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('shrink',window.scrollY>40),{passive:true});}

  const CATALOG = [
    {id:'teddy',name:'Honey Teddy',image:'shop-teddy.png',tag:'The classic cuddle',copy:'A warm, fuzzy friend with a whole lot of heart.'},
    {id:'dog',name:'Golden Retriever',image:'shop-dog.png',tag:'Your loyal little buddy',copy:'Floppy ears, a happy smile, and endless friendship.'},
    {id:'dino',name:'Dino',image:'shop-dino.png',tag:'Big adventures ahead',copy:'A colorful companion for your next big adventure.'},
    {id:'unicorn',name:'Unicorn',image:'shop-unicorn.png',tag:'A little everyday magic',copy:'Rainbow cuddles and a sprinkle of make-believe.'}
  ];
  const KEY = 'swl-stuff-at-home-cart-v1';
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
  const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const item = id => CATALOG.find(p=>p.id===id);
  let storageOK=true;
  function cleanChild(c) {
    if (!c || !item(c.productId)) throw Error('Invalid friend');
    return {productId:c.productId,shirt:c.shirt===true,shirtName:c.shirt===true?String(c.shirtName||'').trim().slice(0,40):'',recorder:c.recorder===true};
  }
  function normalize(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.slice(0,50).flatMap(r=>{
      try {
        const quantity=Math.max(1,Math.min(20,Math.floor(Number(r.quantity)||1)));
        if(r.kind==='kit') return [{id:String(r.id||crypto.randomUUID()),kind:'kit',quantity,...cleanChild(r)}];
        if(r.kind==='birthday'&&Array.isArray(r.children)&&r.children.length===10)return [{id:String(r.id||crypto.randomUUID()),kind:'birthday',quantity,children:r.children.map(cleanChild)}];
      }catch(e){} return [];
    });
  }
  let cart=[];
  try{cart=normalize(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch(e){storageOK=false;}
  function unitPrice(r){const extra=c=>(c.shirt?1000:0)+(c.recorder?1000:0);return r.kind==='birthday'?25000+r.children.reduce((n,c)=>n+extra(c),0):2999+extra(r);}
  function subtotal(){return cart.reduce((n,r)=>n+unitPrice(r)*r.quantity,0);}
  function count(){return cart.reduce((n,r)=>n+r.quantity*(r.kind==='birthday'?10:1),0);}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(cart));}catch(e){storageOK=false;} render();window.dispatchEvent(new Event('swl-cart-change'));}
  function add(r){const signature=x=>JSON.stringify({...x,id:undefined,quantity:undefined});const same=cart.find(x=>signature(x)===signature(r));if(same){if(same.quantity+r.quantity>20)throw Error('Please limit each selection to 20.');same.quantity+=r.quantity;}else{if(cart.length>=50)throw Error('Your cart is full. Please contact us for larger orders.');cart.push({...r,id:crypto.randomUUID()});}save();}
  function extras(c){return [c.shirt?'Name shirt: '+c.shirtName:null,c.recorder?'Voice recorder':null].filter(Boolean).join(' · ')||'Kit only';}
  function description(r){return r.kind==='birthday'?r.children.map((c,i)=>`${i+1}. ${item(c.productId).name} — ${extras(c)}`).join('\n'):extras(r);}
  function toast(message){const t=document.getElementById('shop-toast');if(!t)return;t.textContent=message;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,5000);}
  function render(){
    document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=count());
    const target=document.getElementById('cart-items');
    if(target){
      target.innerHTML=cart.length?cart.map(r=>`<article class="swl-cart-line"><img src="${r.kind==='birthday'?'shop-teddy.png':item(r.productId).image}" alt="${esc(r.kind==='birthday'?'Birthday Box':item(r.productId).name)}"><div><h2>${r.kind==='birthday'?'Birthday Box · 10 kits':esc(item(r.productId).name)}</h2>${r.kind==='birthday'?`<details><summary>View your 10 friends &amp; extras</summary><p class="swl-line-details">${esc(description(r))}</p></details>`:`<p>${esc(extras(r))}</p>`}<p class="swl-fine">${money(unitPrice(r))} ${r.kind==='birthday'?'per box':'each'}</p><div class="swl-quantity"><button type="button" data-change="-1" data-id="${esc(r.id)}" aria-label="Decrease quantity">−</button><span aria-label="Quantity">${r.quantity}</span><button type="button" data-change="1" data-id="${esc(r.id)}" aria-label="Increase quantity">+</button><button type="button" class="swl-remove" data-remove="${esc(r.id)}">Remove</button></div></div><strong>${money(unitPrice(r)*r.quantity)}</strong></article>`).join(''):'<div class="swl-empty"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i><h2>Your crew is waiting.</h2><p>Your cart is empty. Let’s find you a new friend!</p><a href="stuff-at-home.html" class="btn btn-primary">Choose Your Friend</a></div>';
      document.getElementById('cart-subtotal').textContent=money(subtotal());
      document.getElementById('cart-checkout').hidden=!cart.length;
      document.getElementById('cart-storage-status').textContent=storageOK?'':'Your browser could not save your cart. Keep this page open and allow site storage to continue shopping across pages.';
    }
  }
  const products=document.getElementById('shop-products');
  if(products){products.innerHTML=CATALOG.map(p=>`<article class="swl-product"><div class="swl-product-photo"><span>${esc(p.tag)}</span><img src="${p.image}" alt="${esc(p.name)} finished 16-inch plush" loading="lazy"></div><div class="swl-product-info"><h3>${esc(p.name)}</h3><p>${esc(p.copy)}</p><p class="swl-product-price">$29.99 <small>DIY kit</small></p><form data-product="${p.id}"><label class="swl-option"><input type="checkbox" name="shirt"> Custom name shirt <strong>+$10</strong></label><label class="swl-name-field" hidden>Name on shirt<input name="shirtName" maxlength="40" placeholder="Exactly as you’d like it printed"></label><label class="swl-option"><input type="checkbox" name="recorder"> Voice recorder <strong>+$10</strong></label><div class="swl-add-row"><label>Qty<input type="number" name="quantity" min="1" max="20" value="1" required></label><button type="submit" class="btn btn-primary">Add to Cart</button></div><p class="swl-product-message" role="status"></p></form></div></article>`).join('');
    products.addEventListener('change',e=>{if(e.target.name==='shirt'){const f=e.target.form;const n=f.querySelector('[name="shirtName"]');f.querySelector('.swl-name-field').hidden=!e.target.checked;n.required=e.target.checked;n.disabled=!e.target.checked;}});
    products.addEventListener('submit',e=>{e.preventDefault();const f=e.target;const msg=f.querySelector('[role="status"]');try{const r={kind:'kit',productId:f.dataset.product,shirt:f.shirt.checked,shirtName:f.shirtName.value.trim(),recorder:f.recorder.checked,quantity:Number(f.quantity.value)};if(r.shirt&&!r.shirtName)throw Error('Please enter a name for your shirt.');add(r);msg.textContent='Added!';toast(item(r.productId).name+' added to your bag 💛');}catch(err){msg.textContent=err.message;}});
  }
  const builder=document.getElementById('birthday-builder');
  if(builder){document.getElementById('birthday-children').innerHTML=Array.from({length:10},(_,i)=>`<fieldset class="swl-child"><legend>Friend ${i+1}</legend><label>Plush<select name="friend-${i}">${CATALOG.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label class="swl-option"><input type="checkbox" name="shirt-${i}"> Name shirt +$10</label><label class="swl-child-name" hidden>Name on shirt<input name="name-${i}" maxlength="40" placeholder="Name exactly as printed"></label><label class="swl-option"><input type="checkbox" name="recorder-${i}"> Voice recorder +$10</label></fieldset>`).join('');
    builder.addEventListener('change',()=>{let price=25000;for(let i=0;i<10;i++){const shirt=builder.elements['shirt-'+i].checked;const n=builder.elements['name-'+i];n.required=shirt;n.disabled=!shirt;n.closest('label').hidden=!shirt;price+=(shirt?1000:0)+(builder.elements['recorder-'+i].checked?1000:0);}document.getElementById('birthday-total').textContent=money(price);});
    builder.addEventListener('submit',e=>{e.preventDefault();const children=Array.from({length:10},(_,i)=>({productId:builder.elements['friend-'+i].value,shirt:builder.elements['shirt-'+i].checked,shirtName:builder.elements['name-'+i].value.trim(),recorder:builder.elements['recorder-'+i].checked}));try{if(children.some(c=>c.shirt&&!c.shirtName))throw Error('Please enter a name for each selected shirt.');add({kind:'birthday',quantity:1,children});toast('Your Birthday Box is in the bag 💛');}catch(err){toast(err.message);}});
  }
  document.getElementById('cart-items')?.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.dataset.remove)cart=cart.filter(r=>r.id!==button.dataset.remove);else if(button.dataset.change){const r=cart.find(r=>r.id===button.dataset.id);if(r){r.quantity=Math.min(20,r.quantity+Number(button.dataset.change));if(r.quantity<1)cart=cart.filter(x=>x!==r);}}save();});
  window.addEventListener('storage',e=>{if(e.key===KEY){try{cart=normalize(JSON.parse(e.newValue||'[]'));}catch(err){cart=[];}render();window.dispatchEvent(new Event('swl-cart-change'));}});
  window.SWLShop={CATALOG,money,esc,item,unitPrice,description,getCart:()=>JSON.parse(JSON.stringify(cart)),subtotal,clear:()=>{cart=[];save();}};
  render();
})();
