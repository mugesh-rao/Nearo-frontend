import{r as l,d as u,j as e,i as d,k as p,e as x}from"./index-70997a97.js";import{C as h}from"./CircularProgress-73940f8d.js";const b=()=>{const r=s=>x({url:"Help_and_support/raise_request",method:"post",data:s}),n=()=>{const s=d();return p(r,{onSuccess:o=>{m(o==null?void 0:o.data),s.invalidateQueries("sendphone_no")}})},{mutate:i,isLoading:a}=n(),c=l.useCallback(()=>{const s=new FormData;s.append("session_id",u.get("session_id")),i(s)},[]),[t,m]=l.useState("");return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"mx-2 sm:mx-5 mt-8",children:[e.jsx("h1",{className:"text-2xl md:text-3xl font-semibold sm:text-black text-[#1687a7]",children:"Help & Support"}),e.jsx("br",{}),e.jsxs("h2",{className:"text-lg font-semibold",children:[" ","Welcome to our Seller Portal Help and Support page!"]}),e.jsxs("p",{className:"my-2",children:["Need assistance with your seller account? Click the ",'"',"Call Us",'"'," ","button below to connect with our dedicated seller support team. We","'","re here to help you with product listing, inventory management, order fulfillment, payment and commission details, and more. Your success is important to us, and we","'","re committed to providing excellent support."]}),e.jsx("br",{}),t&&t.message?e.jsxs("p",{className:"text-xl capitalize text-red-400",children:[t==null?void 0:t.message," "]}):e.jsx("button",{className:"btn1 w-full sm:w-[180px] my-2",onClick:c,disabled:a,children:a?e.jsx(h,{size:24}):"Call Us"})]})})};export{b as default};