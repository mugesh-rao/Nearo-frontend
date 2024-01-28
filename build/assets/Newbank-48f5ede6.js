import{i as w,k as x,j as s,L as f,d as h,s as a,e as b}from"./index-70997a97.js";import{u as j,n as y}from"./index-cd29d591.js";const g={newAccount:"",newIfsc:"",newHolder:""},v=()=>{const{values:o,errors:n,touched:l,handleBlur:t,handleChange:c,handleSubmit:i}=j({initialValues:g,validationSchema:y,onSubmit:e=>{const r=new FormData;r.append("session_id",h.get("session_id")),r.append("bank_details_account_no",e.newAccount),r.append("bank_details_account_holder_name",e.newHolder),r.append("bank_details_ifsc_code",e.newIfsc),d(r)}}),u=e=>b({url:"/settings/change_bank_account_details",method:"post",data:e}),m=w(),{mutate:d,isError:N,error:_,isLoading:p}=x(u,{onSuccess:e=>{(e==null?void 0:e.data.success)==1?a.success(e==null?void 0:e.data.message):(e==null?void 0:e.data.success)==0&&a.error(e==null?void 0:e.data.message),m.invalidateQueries("change bank details")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}});return p?s.jsx("div",{className:"h-screen flex items-center justify-center w-full",children:s.jsx(f,{})}):s.jsx(s.Fragment,{children:s.jsxs("div",{className:"new-bank",children:[s.jsx("p",{className:"text-[1rem] font-semibold",children:s.jsxs("span",{children:["New Account Number",s.jsx("sup",{children:"*"})," "]})}),s.jsx("input",{type:"number",name:"newAccount",onBlur:t,onChange:c,value:o.newAccount,className:" p-2 focus:outline-none w-full bg-transparent ",style:{borderBottom:"1px solid gray"}}),n.newAccount&&l.newAccount?s.jsx("h5",{style:{color:"red"},className:"error-para",children:n.newAccount}):"",s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between my-2 sm:my-5 ",children:[s.jsxs("div",{className:"w-full sm:w-[49%] my-2",children:[s.jsxs("p",{className:"text-[1rem] font-semibold",children:["Account Holder Name",s.jsx("sup",{children:"*"})]}),s.jsx("input",{type:"text",name:"newHolder",value:o.newHolder,onBlur:t,onChange:c,className:" p-2 focus:outline-none w-full capitalize bg-transparent ",style:{borderBottom:"1px solid gray"}}),n.newHolder&&l.newHolder?s.jsx("h5",{style:{color:"red"},className:"error-para",children:n.newHolder}):""]}),s.jsxs("div",{className:"w-full sm:w-[49%] my-2",children:[s.jsxs("p",{className:"text-[1rem] font-semibold",children:["IFSC Code",s.jsx("sup",{children:"*"})," "]}),s.jsx("input",{type:"text",name:"newIfsc",onBlur:t,onChange:c,value:o.newIfsc,className:" p-2 focus:outline-none w-full bg-transparent ",style:{borderBottom:"1px solid gray"}}),n.newIfsc&&l.newIfsc?s.jsx("h5",{style:{color:"red"},className:"error-para",children:n.newIfsc}):""]})]}),s.jsx("button",{onClick:i,className:"btn1 w-full sm:w-[240px] font-semibold",children:"Submit"})]})})};export{v as default};
