import{r as a,j as s,_ as l}from"./index-70997a97.js";import{C as o}from"./CircularProgress-73940f8d.js";const x=()=>{const[r,c]=a.useState(null);return a.useEffect(()=>{(async()=>{const{Data2:t}=await l(()=>import("./Data2-3c02529d.js"),[]);c(t)})()},[]),r?s.jsx(s.Fragment,{children:s.jsxs("div",{className:"works sm:w-[90%] mx-auto",id:"works",children:[s.jsxs("h1",{className:`text-2xl text-center lg:text-left sm:text-3xl\r
        font-bold my-4 `,children:["How Nearo ",s.jsx("span",{className:"text-[#1687a7]",children:" Works!"})]}),s.jsx("div",{className:`grid my-12  grid-cols-1  sm:grid-cols-2 md:grid-cols-3  home-borders  shadow-box rounded-xl w-[96%] custom400:w-[70%] mx-auto  sm:w-full lg:grid-cols-4 gap-x-8 p-4\r
        \r
        `,children:r.map((e,t)=>s.jsxs("div",{className:"   text-center py-10  ",children:[s.jsx("img",{src:e.img,alt:"img",className:"w-20 rounded-full   mx-auto "}),s.jsx("h4",{className:"text-[#90A4AE] my-3  uppercase",children:e.h3}),s.jsx("h2",{className:"text-2xl font-semibold text-[#1687a7] ",children:e.h2}),s.jsx("p",{className:"my-3 text-[#757575]  font-extralight ",children:e.para})]},t))})]})}):s.jsxs("div",{className:"h-screen flex items-center justify-center",children:[s.jsx(o,{}),"   Loading..."]})};export{x as default};
