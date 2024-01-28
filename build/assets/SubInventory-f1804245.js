import{r as i,_,b as V,h as H,l as U,i as Y,k as v,j as t,m as G,n as J,o as K,F as X,p as h,A as Z,q as ee,C as L,e as te}from"./index-70997a97.js";import{d as se}from"./MoreVert-fe9f0345.js";import{R as ne}from"./index.esm-5a71c6ac.js";import{I as ie}from"./index.es-9acb4e93.js";import{L as re}from"./LazyImage-75aafd9d.js";import{F as r}from"./index.esm-34bd9e10.js";import{R as ae}from"./Rating-f2c8c2d6.js";const ce=i.lazy(()=>_(()=>import("./DynamicSkeleton-79db6147.js"),["assets/DynamicSkeleton-79db6147.js","assets/index-70997a97.js","assets/index-52a015f8.css","assets/Skeleton-1722e138.js"])),oe=i.lazy(()=>_(()=>import("./index-70997a97.js").then(u=>u.bC),["assets/index-70997a97.js","assets/index-52a015f8.css"])),de=i.lazy(()=>_(()=>import("./EditProduct-5267c3af.js"),["assets/EditProduct-5267c3af.js","assets/index-70997a97.js","assets/index-52a015f8.css","assets/SizeQuantity-6070164a.js","assets/Box-7aca6db8.js","assets/createBox-e30dae9b.js","assets/Rating-f2c8c2d6.js"])),le=i.lazy(()=>_(()=>import("./SizeQuantity-6070164a.js"),["assets/SizeQuantity-6070164a.js","assets/index-70997a97.js","assets/index-52a015f8.css","assets/Box-7aca6db8.js","assets/createBox-e30dae9b.js"])),je=()=>{const[u,S]=i.useState(!1),[R,p]=i.useState(!0),g=V(),j=H(),[k,f]=i.useState(!1),[E,y]=i.useState(!1),[z,C]=i.useState("");U();const A=e=>{f(!0),C(e),console.log("product data",e)},Q=e=>{y(!0),C(e)},b=()=>{S(!u)},B=e=>{g(`/dashboard/add_product/edit/${e}`)},[N,m]=i.useState(0),D=e=>te({url:"/inventory/get_product_list",method:"post",data:e}),w=Y(),[n,x]=i.useState({ratings:-1,quantity_less:-1,quantity_greater:-1}),{mutate:O,isLoading:F}=v(D,{onSuccess:e=>{if(n.quantity_greater===-1&&n.quantity_less===-1&&n.ratings===-1){const d=new Set(s.map(o=>o.product_id)),c=e==null?void 0:e.data.data.filter(o=>!d.has(o.product_id));q(o=>{const P=new Set(c.map(l=>l.product_id));return[...o.filter(l=>!P.has(l.product_id)),...c]}),(c==null?void 0:c.length)===0&&p(!1)}else{const d=new Set(s.map(o=>o.product_id)),c=e==null?void 0:e.data.data.filter(o=>!d.has(o.product_id));q(o=>{const P=new Set(c.map(l=>l.product_id));return[...o.filter(l=>!P.has(l.product_id)),...c]}),(c==null?void 0:c.length)===0&&p(!1)}w.invalidateQueries("low_stocks_data")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[s,q]=i.useState(i.useMemo(()=>{const e=w.getQueryData("session_id");return e?e.data:[]},[w])),[a,I]=i.useState({ratings:-1,quantity_less:-1,quantity_greater:-1});i.useEffect(()=>{if(!j)g("/login");else{m(d=>d+1);const e=new FormData;return e.append("session_id",j),e.append("avg_review_stars",a.ratings),e.append("quantity_less",a.quantity_less),e.append("quantity_greater",a.quantity_greater),e.append("page",N),O(e),()=>{}}},[a]);const M=()=>{m(d=>d+1);const e=new FormData;e.append("session_id",j),e.append("avg_review_stars",a.ratings),e.append("quantity_less",a.quantity_less),e.append("quantity_greater",a.quantity_greater),e.append("page",N),O(e)},[T,W]=i.useState(window.innerWidth);return i.useEffect(()=>{const e=()=>{W(window.innerWidth)};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]),(!s||s.length===0)&&!F&&a.ratings==-1&&a.quantity_greater==-1&&a.quantity_less==-1?t.jsx("h2",{className:"h-[450px] text-xl text-center font-semibold custom400:text-2xl sm:text-3xl grid place-items-center w-full px-3",children:"😍Start listing Your Amazing Products"}):t.jsx(t.Fragment,{children:t.jsxs("div",{className:" bg-white sm:mx-2 pt-8",children:[t.jsxs("div",{className:"flex justify-between mx-2 items-center",children:[t.jsxs("div",{className:"hidden  sm:flex items-center text-2xl font-semibold lg:text-3xl  space-x-4",children:[t.jsx("h1",{children:"All Products"}),s&&t.jsx("div",{className:"h-[40px] w-[50px] bg-orange-100 mx-2 rounded-lg grid place-items-center",children:t.jsx("span",{className:"  text-orange-500 text-[1.5rem]  ",children:(s==null?void 0:s.length)<10&&(s==null?void 0:s.length)>0?`0${s==null?void 0:s.length}`:s==null?void 0:s.length})})]}),t.jsxs("div",{className:"flex  justify-end w-full space-x-5 sm:w-fit",children:[t.jsxs("button",{className:"btn2 flex items-center",onClick:()=>g("/dashboard/add_product"),children:[t.jsx(G,{})," Add product"]}),t.jsxs("div",{children:[t.jsxs("button",{className:"btn2 flex items-center",onClick:b,children:[t.jsx(J,{className:"text-2xl"}),t.jsx("span",{className:"hidden sm:block",children:"Filters"})]}),u?t.jsxs("div",{className:"max-w-[20rem] right-0 sm:max-w-[24rem] w-full bg-white p-4 absolute sm:right-10 mt-5 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-50 ",children:[t.jsx("p",{className:"float-right text-xl cursor-pointer",onClick:b,children:t.jsx(K,{})}),t.jsx("h2",{className:"text-xl font-semibold ",children:"Product Stock"}),t.jsx("div",{className:"flex flex-wrap gap-2 mt-3",children:[0,7,29,30].map(e=>t.jsxs("label",{className:`cursor-pointer ${n.quantity_less===e||n.quantity_greater===e?"btn1":"btn2"}`,children:[t.jsx("input",{type:"checkbox",name:"",id:"",value:e,onChange:()=>{e===0?x({...n,quantity_less:n.quantity_less===0?-1:0,quantity_greater:-1}):e===7?x({...n,quantity_less:n.quantity_less===7?-1:7,quantity_greater:-1}):e===29?x({...n,quantity_less:n.quantity_less===29?-1:29,quantity_greater:n.quantity_greater===8?-1:8}):e===30&&x({...n,quantity_greater:n.quantity_greater===30?-1:30,quantity_less:-1})},className:"hidden"}),e===0?t.jsx("span",{children:"Out Of Stock"}):e===7?t.jsx("span",{children:"Less than 7"}):e===29?t.jsx("span",{children:"Between 8 - 29"}):e===30?t.jsx("span",{children:"More than 30"}):""]},e))}),t.jsx("h2",{className:"text-xl font-semibold my-3 ",children:"Ratings"}),t.jsx("div",{className:"flex flex-wrap mt-2 gap-2",children:[5,4,3,2].map(e=>t.jsxs("label",{className:`cursor-pointer text-center w-fit ${n.ratings===e?"btn1 py-3":"btn2 py-3 flex justify-center items-center"}`,children:[t.jsx("input",{type:"checkbox",name:"",id:"",value:e,onChange:()=>{x({...n,ratings:n.ratings===e?-1:e})},className:"hidden"}),e===5?t.jsxs("div",{className:"flex justify-center items-center",children:[t.jsx(r,{})," ",t.jsx(r,{}),t.jsx(r,{})," ",t.jsx(r,{})," ",t.jsx(X,{})]}):e===4?t.jsxs("div",{className:"flex justify-center items-center",children:[t.jsx(r,{})," ",t.jsx(r,{}),t.jsx(r,{})," ",t.jsx(r,{})]}):e===3?t.jsxs("div",{className:"flex justify-center items-center",children:[t.jsx(r,{})," ",t.jsx(r,{}),t.jsx(r,{})]}):e===2?t.jsxs("div",{className:"flex justify-center items-center ",children:[t.jsx(r,{})," ",t.jsx(r,{})]}):""]},e))}),t.jsxs("div",{className:"flex justify-between mt-8",children:[t.jsx("button",{className:"btn2",type:"button",onClick:()=>{b(),x({...n,ratings:-1,quantity_greater:-1,quantity_less:-1}),I({...a,ratings:-1,quantity_greater:-1,quantity_less:-1}),m(0),p(!0)},children:"Clear Filters"}),t.jsx("button",{className:"btn2 bg-[#d0e7ed] ",type:"button",onClick:()=>{m(0),S(!u),q([]),I(n),p(!0)},children:"Apply Filters"})]})]}):""]})]})]}),t.jsx(ie,{dataLength:(s==null?void 0:s.length)||0,next:M,hasMore:R,loader:t.jsx("div",{className:"flex items-center justify-center bg-white w-full",children:t.jsx(oe,{})}),endMessage:t.jsx("p",{className:"text-center my-4",children:N>1?t.jsx("b",{children:"No more data you have"}):t.jsx("div",{className:"h-[400px] w-full pt-[110px] font-bold text-2xl",children:"Not Product Found!"})}),children:F?t.jsx(ce,{data:[1,2,3,4,5,6,7,8]}):t.jsx("div",{className:"grid grid-cols-1 custom400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[7px] custom400:gap-2 md:gap-x-3 gap-y-5 my-10 mx-1",children:s&&(s==null?void 0:s.map(e=>t.jsx(t.Fragment,{children:t.jsxs("div",{className:"hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-500 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg h-[400px] cursor-pointer c500:cursor-default  mx-auto w-full custom300:w-[300px] custom400:w-full ",onClick:()=>[T<500?f(e):""],children:[t.jsxs("div",{className:" flex justify-between items-center z-[3] relative ",style:{height:"45px"},children:[t.jsxs("p",{className:"bg-[#1687a7] text-white text-[12px] h-4 px-2 c500:h-6 pb-6 py-[5px] rounded-e-lg font-semibold  overflow-hidden",children:[e==null?void 0:e.discount_percent,"% OFF"]}),t.jsx("div",{className:"mr-2 z-10",children:t.jsxs(h.Popover,{placement:"bottom-end",children:[t.jsx(h.PopoverHandler,{children:t.jsx(h.Button,{className:"bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg text-black",children:t.jsx(se,{})})}),t.jsxs(h.PopoverContent,{className:" flex flex-col",children:[t.jsxs("span",{className:"capitalize flex items-center py-2 cursor-pointer",onClick:()=>B(e==null?void 0:e.product_id),children:[t.jsx(ne,{className:"text-lg"}),"  Edit Product"]}),t.jsx("hr",{}),t.jsxs("span",{className:"capitalize flex items-center py-2 cursor-not-allowed","aria-disabled":!0,children:[t.jsx(Z,{className:"text-lg"}),"   Archive Product"]})]})]})})]}),t.jsx(re,{src:e==null?void 0:e.main_image,alt:e==null?void 0:e.product_title,className:"block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "}),t.jsxs("div",{className:"m-2",children:[t.jsx("div",{className:"my-[3px] text-[13px] text-[#5a5a0a] ",children:t.jsx("span",{className:`${+e.quantity_available>+e.product_low_quantity_stock?"text-green-500 ":+e.quantity_available<=+e.product_low_quantity_stock&&+e.quantity_available!=0?"text-orange-500":+e.quantity_available==0?"text-red-500":""} font-bold`,children:+e.quantity_available>+e.product_low_quantity_stock?"In Stock":+e.quantity_available<=+e.product_low_quantity_stock&&+e.quantity_available!=0?"Low Stock":+e.quantity_available==0?"Out Of Stock":""})}),t.jsxs("div",{className:"block ",children:[t.jsxs("h4",{className:"whitespace-nowrap text-ellipsis overflow-hidden text-sm ",children:[e==null?void 0:e.product_title," "]}),t.jsxs("div",{className:"flex items-end my-[2px]",children:[t.jsxs("p",{className:"text-[#5a5a0a] text-[14px] line-through",children:["₹",e==null?void 0:e.mrp]}),"   ",t.jsxs("b",{className:"text-green-500",children:["₹",e.price]})]}),t.jsxs("p",{className:"flex items-end",children:[t.jsx(ae,{name:"half-rating",value:e==null?void 0:e.avg_review_stars,precision:.5,readOnly:!0,size:"small",sx:{fontSize:"21px"}})," ",t.jsxs("span",{style:{color:"rgba(19, 19, 19, 0.458)",paddingTop:"3px",fontSize:"14px"},children:["(",e.avg_review_stars,")"," "]})]})]}),t.jsxs("div",{className:"flex justify-between space-x-1 my-2",children:[t.jsx("button",{onClick:d=>[Q(e),d.stopPropagation()],className:"bg-[#1687a7] text-white w-full c500:w-[75%] flex justify-center p-[6px] pb-2 rounded-lg cursor-pointer  ",children:"Edit Quantity"}),t.jsx("div",{className:"",children:t.jsx("button",{onClick:()=>A(e),className:" border border-[#1687a7] rounded-lg w-[45px] hidden c500:flex justify-center items-center p-[6px] pb-2 ",children:t.jsx(ee,{className:"text-[#1687a7] text-2xl"})})})]})]})]},e==null?void 0:e.product_id)})))})}),k&&t.jsx(L,{open:k,onNo:()=>f(!1),size:"medium",title:"Edit Product",children:t.jsx(de,{product:z})}),E&&t.jsx(L,{open:E,onNo:()=>y(!1),size:"small",title:"Edit Quantities",children:t.jsx(le,{product:z,setQuantityOpen:y})})]})})};export{je as default};