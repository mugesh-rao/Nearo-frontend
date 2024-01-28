import{a$ as le,b0 as ie,aJ as ce,W as _,b1 as G,b2 as B,b3 as de,b4 as me,b5 as ue,r as c,U as pe,V as Z,j as e,X as q,ao as K,J as Y,b6 as Q,aa as R,an as ee,I as xe,aj as se,T as W,_ as I,b as fe,i as he,k as T,d as D,L as J,p as u,ah as $,ai as V,C as be,s as X,e as O}from"./index-70997a97.js";import{u as ge,C as ye}from"./index-cd29d591.js";import je from"./Forget-7d4e4980.js";import{S as we}from"./Switch-578bbba7.js";import{f as Ce}from"./formControlState-a1fb9590.js";import{u as Pe}from"./useFormControl-0c2f0a6a.js";import"./index.esm-267541a1.js";import"./SwitchBase-7fe961a1.js";const ke=le(),ve=ke,Se=["component","direction","spacing","divider","children","className","useFlexGap"],Ne=ie(),_e=ve("div",{name:"MuiStack",slot:"Root",overridesResolver:(s,r)=>r.root});function Me(s){return ce({props:s,name:"MuiStack",defaultTheme:Ne})}function Fe(s,r){const i=c.Children.toArray(s).filter(Boolean);return i.reduce((t,m,a)=>(t.push(m),a<i.length-1&&t.push(c.cloneElement(r,{key:`separator-${a}`})),t),[])}const Le=s=>({row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"})[s],Ae=({ownerState:s,theme:r})=>{let i=_({display:"flex",flexDirection:"column"},G({theme:r},B({values:s.direction,breakpoints:r.breakpoints.values}),t=>({flexDirection:t})));if(s.spacing){const t=de(r),m=Object.keys(r.breakpoints.values).reduce((n,l)=>((typeof s.spacing=="object"&&s.spacing[l]!=null||typeof s.direction=="object"&&s.direction[l]!=null)&&(n[l]=!0),n),{}),a=B({values:s.direction,base:m}),f=B({values:s.spacing,base:m});typeof a=="object"&&Object.keys(a).forEach((n,l,h)=>{if(!a[n]){const g=l>0?a[h[l-1]]:"column";a[n]=g}}),i=me(i,G({theme:r},f,(n,l)=>s.useFlexGap?{gap:Q(t,n)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${Le(l?a[l]:s.direction)}`]:Q(t,n)}}))}return i=ue(r.breakpoints,i),i};function Ee(s={}){const{createStyledComponent:r=_e,useThemeProps:i=Me,componentName:t="MuiStack"}=s,m=()=>K({root:["root"]},n=>Y(t,n),{}),a=r(Ae);return c.forwardRef(function(n,l){const h=i(n),b=pe(h),{component:g="div",direction:C="column",spacing:M=0,divider:P,children:p,className:k,useFlexGap:w=!1}=b,v=Z(b,Se),A={direction:C,spacing:M,useFlexGap:w},S=m();return e.jsx(a,_({as:g,ownerState:A,ref:l,className:q(S.root,k)},v,{children:P?Fe(p,P):p}))})}const Re=Ee({createStyledComponent:R("div",{name:"MuiStack",slot:"Root",overridesResolver:(s,r)=>r.root}),useThemeProps:s=>ee({props:s,name:"MuiStack"})}),Be=Re;function Te(s){return Y("MuiFormControlLabel",s)}const De=xe("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),L=De,$e=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],Ve=s=>{const{classes:r,disabled:i,labelPlacement:t,error:m,required:a}=s,f={root:["root",i&&"disabled",`labelPlacement${se(t)}`,m&&"error",a&&"required"],label:["label",i&&"disabled"],asterisk:["asterisk",m&&"error"]};return K(f,Te,r)},Oe=R("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(s,r)=>{const{ownerState:i}=s;return[{[`& .${L.label}`]:r.label},r.root,r[`labelPlacement${se(i.labelPlacement)}`]]}})(({theme:s,ownerState:r})=>_({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${L.disabled}`]:{cursor:"default"}},r.labelPlacement==="start"&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},r.labelPlacement==="top"&&{flexDirection:"column-reverse",marginLeft:16},r.labelPlacement==="bottom"&&{flexDirection:"column",marginLeft:16},{[`& .${L.label}`]:{[`&.${L.disabled}`]:{color:(s.vars||s).palette.text.disabled}}})),qe=R("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(s,r)=>r.asterisk})(({theme:s})=>({[`&.${L.error}`]:{color:(s.vars||s).palette.error.main}})),Ie=c.forwardRef(function(r,i){var t,m;const a=ee({props:r,name:"MuiFormControlLabel"}),{className:f,componentsProps:y={},control:n,disabled:l,disableTypography:h,label:b,labelPlacement:g="end",required:C,slotProps:M={}}=a,P=Z(a,$e),p=Pe(),k=(t=l??n.props.disabled)!=null?t:p==null?void 0:p.disabled,w=C??n.props.required,v={disabled:k,required:w};["checked","name","onChange","value","inputRef"].forEach(N=>{typeof n.props[N]>"u"&&typeof a[N]<"u"&&(v[N]=a[N])});const A=Ce({props:a,muiFormControl:p,states:["error"]}),S=_({},a,{disabled:k,labelPlacement:g,required:w,error:A.error}),F=Ve(S),x=(m=M.typography)!=null?m:y.typography;let j=b;return j!=null&&j.type!==W&&!h&&(j=e.jsx(W,_({component:"span"},x,{className:q(F.label,x==null?void 0:x.className),children:j}))),e.jsxs(Oe,_({className:q(F.root,f),ownerState:S,ref:i},P,{children:[c.cloneElement(n,v),w?e.jsxs(Be,{display:"block",children:[j,e.jsxs(qe,{ownerState:S,"aria-hidden":!0,className:F.asterisk,children:[" ","*"]})]}):j]}))}),Ue=Ie,ze=c.lazy(()=>I(()=>import("./Terms-2dbc9c1c.js"),["assets/Terms-2dbc9c1c.js","assets/index-70997a97.js","assets/index-52a015f8.css"])),He=c.lazy(()=>I(()=>import("./Privacy-21c3000e.js"),["assets/Privacy-21c3000e.js","assets/index-70997a97.js","assets/index-52a015f8.css"])),Ge=c.lazy(()=>I(()=>import("./Newbank-48f5ede6.js"),["assets/Newbank-48f5ede6.js","assets/index-70997a97.js","assets/index-52a015f8.css","assets/index-cd29d591.js"])),Qe={oldPassword:"",newPassword:"",confirmPassword:""},We=R(s=>e.jsx(we,{focusVisibleClassName:".Mui-focusVisible",disableRipple:!0,...s}))(({theme:s})=>({width:62,height:26,padding:0,"& .MuiSwitch-switchBase":{padding:0,margin:2,transitionDuration:"400ms","&.Mui-checked":{transform:"translateX(36px)",color:"#fff","& + .MuiSwitch-track":{backgroundColor:s.palette.mode==="dark"?"#2ECA45":"#65C466",opacity:1,border:0},"&.Mui-disabled + .MuiSwitch-track":{opacity:.5}},"&.Mui-focusVisible .MuiSwitch-thumb":{color:"#33cf4d",border:"6px solid #fff"},"&.Mui-disabled .MuiSwitch-thumb":{color:s.palette.mode==="light"?s.palette.grey[100]:s.palette.grey[600]},"&.Mui-disabled + .MuiSwitch-track":{opacity:s.palette.mode==="light"?.7:.3}},"& .MuiSwitch-thumb":{boxSizing:"border-box",width:22,height:22},"& .MuiSwitch-track":{borderRadius:26/2,backgroundColor:s.palette.mode==="light"?"#E9E9EA":"#39393D",opacity:1,transition:s.transitions.create(["background-color"],{duration:500})}})),as=()=>{const[s,r]=c.useState({a:!1,b:!1,c:!1}),i=fe(),[t,m]=c.useState(0),a=o=>{m(t===o?0:o)},[f,y]=c.useState(!1),{values:n,errors:l,touched:h,handleBlur:b,handleChange:g,handleSubmit:C}=ge({initialValues:Qe,validationSchema:ye,onSubmit:o=>{const d=new FormData;d.append("session_id",D.get("session_id")),d.append("old_password",o.oldPassword),d.append("new_password",o.newPassword),ae(d)}}),M=o=>O({url:"/settings/temporary_off",method:"post",data:o}),P=o=>O({url:"/settings/get_shop_temp_off_details",method:"post",data:o}),p=he(),[k,w]=c.useState(null),{mutate:v,isError:A,error:S,isLoading:F}=T(M,{onSuccess:o=>{var d;w((d=o==null?void 0:o.data)==null?void 0:d.message),p.invalidateQueries("temporary off")},onError:o=>{console.log(o)},retry:{maxAttempts:3,delay:o=>o*1e3}}),[x,j]=c.useState(),{mutate:N,isLoading:oe}=T(P,{onSuccess:o=>{var d;j((d=o==null?void 0:o.data)==null?void 0:d.data),p.invalidateQueries("temporary off")},onError:o=>{console.log(o)},retry:{maxAttempts:3,delay:o=>o*1e3}});c.useEffect(()=>{const o=new FormData;o.append("session_id",D.get("session_id")),N(o)},[k]);const re=()=>{const o=new FormData;o.append("session_id",D.get("session_id")),o.append("temporary_off",(x==null?void 0:x.is_temporary_off)==1?0:1),v(o)},te=o=>O({url:"/settings/change_password",method:"post",data:o}),{mutate:ae,isLoading:ne,isError:Je,error:Xe}=T(te,{onSuccess:o=>{var d,U,z,H;((d=o==null?void 0:o.data)==null?void 0:d.success)==0?X.error((U=o==null?void 0:o.data)==null?void 0:U.message):((z=o==null?void 0:o.data)==null?void 0:z.success)==1&&(X.success((H=o==null?void 0:o.data)==null?void 0:H.message),i("/login")),p.invalidateQueries("change password")},onError:o=>{console.log(o)},retry:{maxAttempts:3,delay:o=>o*1e3}});function E({id:o,open:d}){return e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:`${o===d?"rotate-180":""} h-5 w-5 transition-transform`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})})}return F||oe?e.jsx("div",{className:"h-screen flex items-center justify-center",children:e.jsx(J,{})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"px-5   ",children:[e.jsx("h1",{className:"text-2xl sm:text-3xl text-[#1687a7] sm:text-black font-semibold my-8",children:"Settings"}),e.jsx("br",{}),e.jsxs("div",{className:"flex justify-between items-center my-3",children:[e.jsx("h3",{className:"text-lg sm:text-xl font-semibold",children:"Temporary off"}),e.jsx(Ue,{control:e.jsx(We,{checked:(x==null?void 0:x.is_temporary_off)==1,inputProps:{"aria-label":"controlled"}}),onClick:re})]}),e.jsx("hr",{}),e.jsxs(c.Fragment,{children:[e.jsxs(u.Accordion,{open:t===1,icon:e.jsx(E,{id:1,open:t}),className:" my-5  ",children:[e.jsx(u.AccordionHeader,{onClick:()=>a(1),className:"text-lg sm:text-xl font-semibold",children:"Change Password"}),e.jsx(u.AccordionBody,{children:ne?e.jsx("h1",{className:" h-full w-full bg-white text-2xl ",children:"Loading..."}):e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between ",children:[e.jsxs("p",{className:"text-[1rem] font-semibold",children:["Current Password",e.jsx("sup",{children:"*"})," "]}),e.jsx("p",{className:"underline cursor-pointer",onClick:()=>y(!0),children:"Forget Password ?"})]}),e.jsxs("div",{className:"flex my-3 items-center ",style:{borderBottom:"1px solid gray"},children:[e.jsx("input",{type:s.a?"text":"password",name:"oldPassword",onChange:g,onBlur:b,value:n.oldPassword,className:" p-2 focus:outline-none w-full bg-transparent "}),s.a?e.jsx($,{onClick:()=>r({...s,a:!1}),className:"text-xl"}):e.jsx(V,{onClick:()=>r({...s,a:!0}),className:"text-xl"})]}),l.oldPassword&&h.oldPassword?e.jsx("h5",{style:{color:"red"},className:"error-para",children:l.oldPassword}):"",e.jsxs("p",{className:"text-[1rem] font-semibold mt-5",children:["New password",e.jsx("sup",{children:"*"})," "]}),e.jsxs("div",{className:"flex my-3 items-center ",style:{borderBottom:"1px solid gray"},children:[e.jsx("input",{type:s.b?"text":"password",name:"newPassword",onChange:g,onBlur:b,value:n.newPassword,className:" p-2 focus:outline-none w-full bg-transparent "}),s.b?e.jsx($,{onClick:()=>r({...s,b:!1}),className:"text-xl"}):e.jsx(V,{onClick:()=>r({...s,b:!0}),className:"text-xl"})]}),l.newPassword&&h.newPassword?e.jsx("h5",{style:{color:"red"},className:"error-para",children:l.newPassword}):"",e.jsxs("p",{className:"text-[1rem] font-semibold mt-5",children:["Confirm password",e.jsx("sup",{children:"*"})," "]}),e.jsxs("div",{className:"flex  my-3 items-center focus:bg-cyan-100",style:{borderBottom:"1px solid gray"},children:[e.jsx("input",{type:s.c?"text":"password",name:"confirmPassword",onChange:g,onBlur:b,value:n.confirmPassword,className:" p-2 focus:outline-none w-full bg-transparent "}),s.c?e.jsx($,{onClick:()=>r({...s,c:!1}),className:"text-xl"}):e.jsx(V,{onClick:()=>r({...s,c:!0}),className:"text-xl"})]}),l.confirmPassword&&h.confirmPassword?e.jsx("h5",{style:{color:"red"},className:"my-3",children:l.confirmPassword}):"",e.jsx("p",{className:"last-para",children:"Make your password strong by adding:"})," ",e.jsxs("ul",{children:[e.jsx("li",{children:"Minimum 8 characters (letters & numbers)"}),e.jsx("li",{children:"Minimum 1 special character (@ # $ % ! ^ & *)"}),e.jsx("li",{children:"Minimum 1 capital letter (A-Z)"}),e.jsx("li",{children:"Minimum 1 number (0-9)"})]}),e.jsx("button",{type:"submit",onClick:C,className:"btn1 my-5 w-full sm:w-[230px] font-semibold",children:"Submit"})]})})]}),e.jsxs(u.Accordion,{open:t===2,icon:e.jsx(E,{id:2,open:t}),className:" my-5",children:[e.jsx(u.AccordionHeader,{onClick:()=>a(2),className:"text-lg sm:text-xl font-semibold",children:"Change Bank Account"}),e.jsx(u.AccordionBody,{children:e.jsx(c.Suspense,{fallback:"loading...",children:e.jsx(Ge,{})})})]}),e.jsxs(u.Accordion,{open:t===3,icon:e.jsx(E,{id:3,open:t}),className:" my-5",children:[e.jsx(u.AccordionHeader,{onClick:()=>a(3),children:"Terms & Conditions"}),e.jsx(u.AccordionBody,{children:e.jsx(c.Suspense,{fallback:"loading...",children:e.jsx(ze,{})})})]}),e.jsxs(u.Accordion,{open:t===4,icon:e.jsx(E,{id:4,open:t}),className:" my-5",children:[e.jsx(u.AccordionHeader,{onClick:()=>a(4),children:"Privacy Policy"}),e.jsx(u.AccordionBody,{children:e.jsx(c.Suspense,{fallback:"loading...",children:e.jsx(He,{})})})]})]})]}),f&&e.jsx(be,{open:f,onNo:()=>y(!1),size:"medium",title:"Forget Password?",fullScreen:!1,className:"w-auto c500:w-[500px] mx-auto h-[550px] ",children:e.jsx(c.Suspense,{fallback:e.jsx("div",{className:"flex justify-center",children:e.jsx(J,{})}),children:e.jsx(je,{setForgetOpen:y})})})]})};export{as as default};
