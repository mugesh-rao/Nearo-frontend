import{J as u,I as h,aa as p,a5 as j,r as C,an as m,V as f,W as l,j as g,X as v,ao as b,as as S,ak as X,at as x}from"./index-70997a97.js";function A(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function B(t){return parseFloat(t)}function P(t){return u("MuiCard",t)}h("MuiCard",["root"]);const W=["className","raised"],E=t=>{const{classes:e}=t;return b({root:["root"]},P,e)},F=p(j,{name:"MuiCard",slot:"Root",overridesResolver:(t,e)=>e.root})(()=>({overflow:"hidden"})),K=C.forwardRef(function(e,o){const a=m({props:e,name:"MuiCard"}),{className:s,raised:n=!1}=a,r=f(a,W),i=l({},a,{raised:n}),d=E(i);return g.jsx(F,l({className:v(d.root,s),elevation:n?8:void 0,ref:o,ownerState:i},r))}),Z=K;function T(t){return u("MuiCardContent",t)}h("MuiCardContent",["root"]);const V=["className","component"],I=t=>{const{classes:e}=t;return b({root:["root"]},T,e)},J=p("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(t,e)=>e.root})(()=>({padding:16,"&:last-child":{paddingBottom:24}})),L=C.forwardRef(function(e,o){const a=m({props:e,name:"MuiCardContent"}),{className:s,component:n="div"}=a,r=f(a,V),i=l({},a,{component:n}),d=I(i);return g.jsx(J,l({as:n,className:v(d.root,s),ownerState:i,ref:o},r))}),tt=L;function O(t){return u("MuiSkeleton",t)}h("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const q=["animation","className","component","height","style","variant","width"];let c=t=>t,y,R,$,M;const z=t=>{const{classes:e,variant:o,animation:a,hasChildren:s,width:n,height:r}=t;return b({root:["root",o,a,s&&"withChildren",s&&!n&&"fitContent",s&&!r&&"heightAuto"]},O,e)},D=S(y||(y=c`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),G=S(R||(R=c`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),H=p("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:o}=t;return[e.root,e[o.variant],o.animation!==!1&&e[o.animation],o.hasChildren&&e.withChildren,o.hasChildren&&!o.width&&e.fitContent,o.hasChildren&&!o.height&&e.heightAuto]}})(({theme:t,ownerState:e})=>{const o=A(t.shape.borderRadius)||"px",a=B(t.shape.borderRadius);return l({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:X(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em"},e.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${o}/${Math.round(a/.6*10)/10}${o}`,"&:empty:before":{content:'"\\00a0"'}},e.variant==="circular"&&{borderRadius:"50%"},e.variant==="rounded"&&{borderRadius:(t.vars||t).shape.borderRadius},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})},({ownerState:t})=>t.animation==="pulse"&&x($||($=c`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),D),({ownerState:t,theme:e})=>t.animation==="wave"&&x(M||(M=c`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),G,(e.vars||e).palette.action.hover)),Q=C.forwardRef(function(e,o){const a=m({props:e,name:"MuiSkeleton"}),{animation:s="pulse",className:n,component:r="span",height:i,style:d,variant:U="text",width:_}=a,w=f(a,q),k=l({},a,{animation:s,component:r,variant:U,hasChildren:!!w.children}),N=z(k);return g.jsx(H,l({as:r,ref:o,className:v(N.root,n),ownerState:k},w,{style:l({width:_,height:i},d)}))}),et=Q;export{Z as C,et as S,tt as a};
