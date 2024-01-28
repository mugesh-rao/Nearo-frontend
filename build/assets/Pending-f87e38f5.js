import{r,_ as R,E as S,v as D,b as O,h as k,i as E,k as L,j as t,D as A,e as I}from"./index-70997a97.js";import{I as F}from"./index.es-9acb4e93.js";const l=r.lazy(()=>R(()=>import("./index-70997a97.js").then(d=>d.bC),["assets/index-70997a97.js","assets/index-52a015f8.css"])),q=()=>{const[d]=S(),{activeLinkParam:x}=D(),b=O(),c=k(),[_,p]=r.useState(x),[a,f]=r.useState(!0),[i,j]=r.useState(0);r.useEffect(()=>{p(x)},[x]),r.useEffect(()=>{p(location.pathname)},[location]);const N=e=>I({url:"/revenue/revenue_details",method:"post",data:e}),u=E(),{mutate:m,isLoading:y}=L(N,{onSuccess:e=>{console.log(e==null?void 0:e.data.data);const n=new Set(s.map(o=>o.order_id)),h=e==null?void 0:e.data.data.filter(o=>!n.has(o.order_id));w(o=>{const C=new Set(h.map(g=>g.order_id));return[...o.filter(g=>!C.has(g.order_id)),...h]}),(s==null?void 0:s.length)===0&&f(!1),u.invalidateQueries("low_stocks_data")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[s,w]=r.useState(r.useMemo(()=>{const e=u.getQueryData("session_id");return e?e.data:[]},[u]));r.useEffect(()=>{if(!c)b("/login");else{const e=new FormData;e.append("session_id",c),e.append("page",i),e.append("timeframe",d),e.append("filters","pending"),m(e)}},[c,d]);const P=()=>{j(n=>n+1);const e=new FormData;e.append("session_id",c),e.append("page",i),e.append("timeframe",d),e.append("filters","pending"),m(e)};return y&&i===0?t.jsx("div",{className:"h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0",children:t.jsx(r.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(l,{})})}):s.length==0||!s?t.jsxs(t.Fragment,{children:[_=="/dashboard/revenue/payble_amount"?t.jsx(A,{}):"",t.jsx("h2",{className:"h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3",children:"No pending amount"})]}):t.jsx(t.Fragment,{children:t.jsxs("div",{className:"p-2 custom400:mx-2 ",children:[t.jsx("h1",{className:"text-2xl sm:text-3xl font-semibold text-black my-6",children:"Pending"}),t.jsxs("div",{className:"flex justify-between my-3 w-[90%] mx-auto text-[#1687a7] ",children:[t.jsx("p",{children:"Products"}),t.jsxs("div",{className:"hidden md:flex justify-between items-center w-[42%] space-x-3",children:[t.jsx("p",{children:"Commission"}),t.jsx("p",{children:"Payble Amt."}),t.jsx("p",{children:"Status"})]})]}),t.jsx("div",{className:"h-[600px] overflow-y-scroll  border-y border-gray-400 py-1 ",children:t.jsx(F,{dataLength:(s==null?void 0:s.length)||0,next:P,hasMore:a,loader:t.jsxs("div",{className:"flex items-center justify-center",children:[t.jsx(l,{})," ",t.jsx("p",{className:"text-xl text-red-400",children:"inventory"})," "]}),endMessage:t.jsx("p",{style:{textAlign:"center"},children:t.jsx("b",{children:"Yay! You have seen it all"})}),children:s.map((e,n)=>t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"flex items-center rounded-lg md:shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2  justify-between md:my-4 ",children:[t.jsxs("div",{className:"flex items-center w-full md:w-[55%]   ",children:[t.jsxs("p",{style:{color:"rgba(0, 0, 0, 0.621)"},children:[n+1<10?`0${n+1}`:n+1,"."]}),t.jsx("img",{src:e.main_image,alt:"product-imgs",className:"w-14 sm:w-16 rounded-lg mx-1 "}),t.jsxs("div",{className:"custom400:mx-2",children:[t.jsx("p",{className:"text-wrap text-[14px] sm:text-[16px]",children:e==null?void 0:e.product_title}),t.jsxs("p",{children:["Size: ",e==null?void 0:e.size]}),t.jsxs("h2",{className:"text-lg sm:text-xl font-semibold flex ",children:["₹",e==null?void 0:e.price_with_tax,"    "," ",(e==null?void 0:e.order_product_status)==="1"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["New"," "]}):(e==null?void 0:e.order_product_status)==="2"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Order in process"," "]}):(e==null?void 0:e.order_product_status)==="3"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Ready for ship"," "]}):(e==null?void 0:e.order_product_status)==="4"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["On the way"," "]}):(e==null?void 0:e.order_product_status)==="5"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Return Period"," "]}):(e==null?void 0:e.order_product_status)==="6"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Paid"}):(e==null?void 0:e.order_product_status)==="7"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="8"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="9"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="10"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="11"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Cancelled by seller"}):(e==null?void 0:e.order_product_status)==="12"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Cancelled by customer"}):(e==null?void 0:e.order_product_status)==="16"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Canceled by system"}):(e==null?void 0:e.order_product_status)==="14"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Order not accepted by customer"}):(e==null?void 0:e.order_product_status)==="15"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Order not accepted by customer & delivered to seller"}):t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Cancelled"," "]})]})]})]}),t.jsxs("div",{className:"hidden md:flex w-[38%] text-center justify-between font-semibold sm:text-xl mr-4",children:[t.jsxs("h4",{children:["₹ ",e==null?void 0:e.tax]}),t.jsxs("h4",{children:[e==null?void 0:e.payble_amount_to_seller," "]}),(e==null?void 0:e.order_product_status)==="1"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["New"," "]}):(e==null?void 0:e.order_product_status)==="2"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Order in process"," "]}):(e==null?void 0:e.order_product_status)==="3"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Ready for ship"," "]}):(e==null?void 0:e.order_product_status)==="4"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["On the way"," "]}):(e==null?void 0:e.order_product_status)==="5"?t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Return Period"," "]}):(e==null?void 0:e.order_product_status)==="6"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Paid"}):(e==null?void 0:e.order_product_status)==="7"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="8"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="9"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="10"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Returned"}):(e==null?void 0:e.order_product_status)==="11"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Cancelled by seller"}):(e==null?void 0:e.order_product_status)==="12"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Cancelled by customer"}):(e==null?void 0:e.order_product_status)==="16"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Canceled by system"}):(e==null?void 0:e.order_product_status)==="14"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Order not accepted by customer"}):(e==null?void 0:e.order_product_status)==="15"?t.jsx("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:"Order not accepted by customer & delivered to seller"}):t.jsxs("button",{className:" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light",children:["Cancelled"," "]})]})]}),t.jsxs("div",{className:"flex md:hidden justify-between my-2 mx-2 custom400:mx-6 text-[#1687a7] text-sm",children:[t.jsxs("p",{children:[" ","Commissions :"," ",t.jsxs("span",{className:"text-black font-semibold text-lg",children:["₹ ",e==null?void 0:e.tax]})," "]}),t.jsxs("p",{children:[" ","Payble Amt. :"," ",t.jsxs("span",{className:"text-black font-semibold text-lg",children:["₹ ",e==null?void 0:e.payble_amount_to_seller]})," "]})]})]}))})})]})})};export{q as default};