import{r,_ as W,b as $,h as D,i as B,k as H,j as t,L as N,m as T,p as c,A as Y,q as V,C as h,e as G}from"./index-70997a97.js";import J from"./EditProduct-5267c3af.js";import K from"./SizeQuantity-6070164a.js";import{d as U}from"./MoreVert-fe9f0345.js";import{R as X}from"./index.esm-5a71c6ac.js";import{I as Z}from"./index.es-9acb4e93.js";import{L as v}from"./LazyImage-75aafd9d.js";import ee from"./DynamicSkeleton-79db6147.js";import"./Rating-f2c8c2d6.js";import"./Box-7aca6db8.js";import"./createBox-e30dae9b.js";import"./Skeleton-1722e138.js";const te=r.lazy(()=>W(()=>import("./index-bd35aa5c.js"),["assets/index-bd35aa5c.js","assets/Rating-f2c8c2d6.js","assets/index-70997a97.js","assets/index-52a015f8.css"])),he=()=>{const o=$(),[d,g]=r.useState(0),[k,z]=r.useState(!0),[_,l]=r.useState(!1),[f,S]=r.useState(!1),[j,b]=r.useState(!1),[P,q]=r.useState(""),[y,E]=r.useState(""),L=e=>{l(!0),E(e)},O=(e,i)=>{i==2&&(b(!0),q(e))},a=D(),C=e=>G({url:"/inventory/get_processing_product_list",method:"post",data:e}),p=B(),{mutate:w,isLoading:x}=H(C,{onSuccess:e=>{const i=new Set(s.map(n=>n.product_id)),u=e==null?void 0:e.data.data.filter(n=>!i.has(n.product_id));I(n=>{const Q=new Set(u.map(m=>m.product_id));return[...n.filter(m=>!Q.has(m.product_id)),...u]}),u.length===0&&z(!1),p.invalidateQueries("low_stocks_data")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[s,I]=r.useState(r.useMemo(()=>{const e=p.getQueryData("session_id");return e?e.data:[]},[p]));r.useEffect(()=>{if(!a)o("/login");else{g(i=>i+1);const e=new FormData;return e.append("session_id",a),e.append("page",d),w(e),()=>{}}},[a]);const A=()=>{g(i=>i+1);const e=new FormData;e.append("session_id",a),e.append("page",d),w(e)},R=e=>{o(`/dashboard/add_product/edit/${e}`)},[M,F]=r.useState(window.innerWidth);return r.useEffect(()=>{const e=()=>{F(window.innerWidth)};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]),x&&d==0?t.jsx("div",{className:"h-screen grid place-items-center bg-white z-10 fixed top-0 right-0 bottom-0 left-0",children:t.jsx(N,{})}):(!s||s.length==0)&&!x?t.jsx("h2",{className:"h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3",children:"No products in processing"}):t.jsx(t.Fragment,{children:t.jsxs("div",{className:" bg-white sm:mx-2 py-8",children:[t.jsxs("div",{className:"flex justify-between mx-2 items-center",children:[t.jsxs("div",{className:"hidden  sm:flex text-2xl font-semibold lg:text-3xl ",children:[t.jsx("h1",{className:"capitalize",children:"Processing"}),s&&t.jsx("div",{className:"h-[40px] w-[50px] bg-[#e9f2f7] mx-2 rounded-lg grid place-items-center",children:t.jsx("span",{className:"  text-[#13b8f8] text-[1.5rem]  ",children:(s==null?void 0:s.length)<10&&(s==null?void 0:s.length)>0?`0${s==null?void 0:s.length}`:s==null?void 0:s.length})})]}),t.jsx("div",{className:"flex justify-end w-full space-x-5 sm:w-fit",children:t.jsxs("button",{className:"btn2 flex items-center",onClick:()=>o("/dashboard/add_product"),children:[t.jsx(T,{})," Add product"]})})]}),t.jsx(Z,{dataLength:(s==null?void 0:s.length)||0,next:A,hasMore:k,loader:t.jsx("div",{className:"flex items-center justify-center",children:t.jsx(N,{})}),endMessage:t.jsx("p",{style:{textAlign:"center"},children:t.jsx("b",{children:"Yay! You have seen it all"})}),children:x?t.jsx(ee,{data:[1,2,3,4,5,6,7,8]}):t.jsx("div",{className:"grid grid-cols-1 custom400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[7px] custom400:gap-2 md:gap-x-3 gap-y-5 my-10 mx-1 ",children:s&&(s==null?void 0:s.map(e=>t.jsx(t.Fragment,{children:t.jsxs("div",{className:"hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-500 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg h-[400px] cursor-pointer c500:cursor-default  mx-auto w-full custom300:w-[300px] custom400:w-full ",onClick:()=>[M<500?l(e):""],children:[t.jsxs("div",{className:"flex justify-between items-center z-[3] relative ",style:{height:"45px"},children:[t.jsxs("p",{className:"bg-[#1687a7] text-white text-[12px] h-4 px-2 c500:h-6 pb-6 py-[5px] rounded-e-lg font-semibold  overflow-hidden",children:[e==null?void 0:e.discount_percent,"% OFF"]}),t.jsx("div",{className:"mr-2 z-20",children:t.jsxs(c.Popover,{placement:"bottom-end",children:[t.jsx(c.PopoverHandler,{children:t.jsxs(c.Button,{className:"bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg text-black",children:[t.jsx(U,{})," "]})}),t.jsxs(c.PopoverContent,{className:"flex flex-col",children:[t.jsxs("span",{className:"capitalize flex items-center py-2 cursor-pointer",onClick:()=>R(e==null?void 0:e.product_id),children:[t.jsx(X,{className:"text-lg"}),"  Edit Product"]}),t.jsx("hr",{}),t.jsxs("span",{className:"capitalize flex items-center py-2 cursor-not-allowed","aria-disabled":!0,children:[t.jsx(Y,{className:"text-lg"}),"   Archive Product"]})]})]})})]}),e!=null&&e.main_image?t.jsx(v,{src:e==null?void 0:e.main_image,alt:e==null?void 0:e.product_title,className:"block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "}):t.jsx("image",{src:e==null?void 0:e.main_image,alt:e==null?void 0:e.product_title,className:"block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "}),t.jsxs("div",{className:"m-2",children:[t.jsxs("div",{className:"block ",children:[t.jsx("div",{className:"my-[3px] text-[13px] text-[#5a5a0a] ",children:t.jsx("span",{className:`${e.quantity_available>e.product_low_quantity_stock?"text-green-500 ":e.quantity_available<=e.product_low_quantity_stock?"text-orange-500":e.quantity_available==0?"text-red-500":"text-orange-500"} font-bold`,children:e.quantity_available>e.product_low_quantity_stock?"In Stock":e.quantity_available<=e.product_low_quantity_stock?"Low Stock":e.quantity_available==0?"Out Of Stock":`${e.quantity_available} Left`})}),t.jsxs("h4",{className:"whitespace-nowrap text-ellipsis overflow-hidden text-sm ",children:[e==null?void 0:e.product_title," "]}),t.jsxs("div",{className:"flex items-end my-[2px]",children:[t.jsxs("p",{className:"text-[#5a5a0a] text-[14px] line-through",children:["₹",e==null?void 0:e.mrp]}),"   ",t.jsxs("b",{className:"text-green-500",children:["₹",e.price]})]}),t.jsxs("p",{className:"flex items-end",children:[t.jsx(te,{name:"half-rating",value:e==null?void 0:e.avg_review_stars,precision:.5,size:"small",readOnly:!0,sx:{fontSize:"21px"}})," ",t.jsxs("span",{style:{color:"rgba(19, 19, 19, 0.458)",paddingTop:"3px",fontSize:"14px"},children:["(",e.avg_review_stars,")"]})]})]}),t.jsxs("div",{className:"flex justify-between space-x-1 my-2",children:[e.approval_status&&t.jsx("button",{onClick:()=>O(e.remarks,e.approval_status),className:`${e.approval_status==0?"bg-[#13b8f8] text-white cursor-wait":e.approval_status==1?"bg-green-600 text-white":e.approval_status==2?"bg-gray-300 text-gray-500 ":""}  w-full c500:w-[75%] flex justify-center p-[6px] pb-2 rounded-lg  capitalize `,children:e.approval_status==0?"in process":e.approval_status==1?"accpted":e.approval_status==2?"rejected":""}),t.jsx("div",{className:"",children:t.jsx("button",{onClick:()=>L(e),className:" border border-[#1687a7] rounded-lg w-[45px] hidden c500:flex justify-center items-center p-[6px] pb-2 ",children:t.jsx(V,{className:"text-[#1687a7] text-2xl"})})})]})]})]},e==null?void 0:e.product_id)})))})}),j&&t.jsx(h,{open:j,onNo:()=>b(!1),size:"small",title:"Remarks",children:t.jsx("div",{className:"flex justify-center items-center",children:P})}),_&&t.jsx(h,{open:_,onNo:()=>l(!1),size:"medium",title:"Edit Product",children:t.jsx(J,{product:y})}),f&&t.jsx(h,{open:f,onNo:()=>S(!1),size:"small",title:"Edit Quantities",children:t.jsx(K,{product:y})})]})})};export{he as default};
