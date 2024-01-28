import{r as l,b as v,a as y,i as f,k as N,d as h,j as e,ay as _,s as C,az as L,aA as w,aB as k,L as A,e as D,G as P,v as S,w as E,c as i,aC as F,aD as O,aE as R,aF as q}from"./index-70997a97.js";import{d as z,e as B}from"./index.esm-267541a1.js";const G=()=>{const[n,r]=l.useState(!1),s=v(),o=()=>{r(!0)},a=y(),c=()=>{r(!1)},m=f(),u=t=>D({url:"/login/logout",method:"post",data:t}),{mutate:p,isLoading:g}=N(u,{onSuccess:t=>{var d,x;((d=t==null?void 0:t.data)==null?void 0:d.success)==1&&(s("/"),h.set("session_id","",{expires:7}),C.success((x=t==null?void 0:t.data)==null?void 0:x.message),a({type:"logout"})),m.invalidateQueries("low_stocks_data")},onError:t=>{console.log(t)},retry:{maxAttempts:3,delay:t=>t*1e3}}),j=l.useCallback(()=>{const t=new FormData;t.append("session_id",h.get("session_id")),p(t)},[]),b=()=>e.jsx(e.Fragment,{children:g?e.jsx("div",{className:"h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white",children:e.jsx(A,{})}):e.jsx(L,{open:n,onClose:c,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",PaperProps:{sx:{width:"20rem"}},children:e.jsx(w,{children:e.jsxs(k,{id:"alert-dialog-description",children:[e.jsx("h2",{className:"text-center text-black text-2xl ",children:"Are you sure ?"}),e.jsxs("div",{className:"flex justify-between mt-10 space-x-4",children:[e.jsx("button",{onClick:j,className:"btn1 w-1/2",children:"Yes"}),e.jsx("button",{onClick:c,className:"btn2 w-1/2",children:"No"})]})]})})})});return e.jsxs(e.Fragment,{children:[e.jsxs("p",{onClick:o,className:"flex items-center p-2 cursor-pointer",children:[e.jsx(_,{className:"text-2xl"}),"    Loging Out"]}),e.jsx(b,{})]})};function H(n){return P({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M23 23v466h466v-18H41v-82.184l85.854-57.234 70.023 70.022 65.133-260.536L387.28 203.7 455.07 95.73l19.317 11.858 6.102-71.1-60.644 37.616 19.884 12.207-59.01 93.99-130.732-65.366-62.865 251.462-57.98-57.978L41 367.184V23H23z"}}]})(n)}const I=()=>{const{activeLinkParam:n}=S(),r=E(),[s,o]=l.useState(n);l.useEffect(()=>{o(n)},[n]),l.useEffect(()=>{o(r.pathname)},[r]);const a={container:{backgroundColor:"#E0F7FA",color:"#1687a7"}};return e.jsxs("div",{className:" lg:shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] sm:min-h-screen  pb-20 bg-white h-full",children:[e.jsx("h1",{className:"heading w-fit mx-auto py-3 text-5xl  text-[#1687a7]",children:"nearo"}),e.jsx("div",{className:"flex flex-col items-center my-6",children:e.jsxs("ul",{className:"text-[1.1rem]",children:[e.jsx(i,{to:"/dashboard/",isActive:()=>s==="/dashboard/",children:e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/"?a.container:{},children:[e.jsx(F,{className:"text-2xl font-extralight"}),"    Dashboard"]})}),e.jsx(i,{to:"inventory",isActive:()=>s==="/dashboard/inventory",children:e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/inventory"?a.container:{},children:[e.jsx(O,{className:"text-2xl rotate-180"}),"    Inventory"]})}),e.jsxs(i,{to:"add_product",isActive:()=>s==="/dashboard/add_product",children:[" ",e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/add_product"?a.container:{},children:[e.jsx(z,{className:"text-2xl"}),"    Add product"]})]}),e.jsxs(i,{to:"orders",isActive:()=>s==="/dashboard/orders",children:[" ",e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/orders"?a.container:{},children:[e.jsx(R,{className:"text-2xl"}),"    Order"]})]}),e.jsxs(i,{to:"revenue",isActive:()=>s==="/dashboard/revenue",children:[" ",e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/revenue"?a.container:{},children:[e.jsx(H,{className:"text-xl"}),"    Revenue"]})]}),e.jsx(i,{to:"help",isActive:()=>s==="/dashboard/help",children:e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/help"?a.container:{},children:[e.jsx(B,{className:"text-2xl"}),"    Help & Support"]})}),e.jsx(i,{to:"settings",isActive:()=>s==="/dashboard/settings",children:e.jsxs("li",{className:"flex items-center rounded-lg my-3 p-2",style:s==="/dashboard/settings"?a.container:{},children:[e.jsx(q,{className:"text-2xl"}),"    Setting"]})}),e.jsx("li",{children:e.jsx(G,{})})]})})]})};export{I as default};