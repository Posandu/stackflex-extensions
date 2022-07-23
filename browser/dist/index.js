(()=>{var u=t=>document.createElement(t),b=t=>document.querySelectorAll(t),y=(t,c)=>{Object.keys(c).forEach(a=>{t.style[a]=c[a]})},w="extension-button",C=`      
button {
  background: #0660a2;
  border: none;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 4px;
  font-family: system-ui;
}
button:hover {
  background: #055188;
}
button:active {
  box-shadow: 0px 0px 4px #0660a2;
}
button:focus {
  box-shadow: 0px 0px 8px #0660a2;
}



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background: #00000070;
  display: none;
  justify-content: center;
  align-items: center;
}
.open {
  display: flex;
}
iframe {
  border-radius: 4px;
  max-height: 700px;
  max-width: 700px;
  width: 100%;
  height: 100%;
  overflow: auto;
}


        `;function x(){b("pre, code").forEach(t=>{if(t.parentElement.tagName==="PRE"||t.parentElement.tagName==="CODE"||t.getAttribute("data-ext-button")==="true"||(t.setAttribute("data-ext-button","true"),/CodeMirror|ace_editor|monaco-editor/i.test(t.className)))return;let c=t.innerText;if(c.trim().length<=20)return;let a=t.getBoundingClientRect(),p=document.body.getBoundingClientRect(),m=u(w),g=m.attachShadow({mode:"open"}),i=u("button"),h=u("style");h.innerHTML=C,i.innerHTML="Save";let f=()=>{let n=/language-([a-zA-Z0-9]+)/,o=t.parentElement,s=t.querySelector("pre"),d=t.querySelector("code"),r="plaintext";if(o.tagName==="PRE"){let e=o.className.match(n);e&&(r=e[1])}if(o.tagName==="CODE"){let e=o.className.match(n);e&&(r=e[1])}if(s){let e=s.className.match(n);e&&(r=e[1])}if(d){let e=d.className.match(n);e&&(r=e[1])}return r};y(i,{position:"absolute",top:`${a.top-p.top-20}px`,left:`${a.left-p.left}px`});function l(n){return encodeURIComponent(n)}g.appendChild(i),g.appendChild(h),document.body.appendChild(m),i.onclick=()=>{console.log("clicked");try{let n=l(document.title.trim()),o=l(f().trim()),s=l(c),d=`https://stackflex.tronic247.com/createCode#${n}|${o}|${s}`;window.open(d,"","width=700,height=700")}catch(n){console.log(n)}}})}x();setInterval(x,1e3);})();
