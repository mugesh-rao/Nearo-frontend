import{i as j,k as s,r,j as n,e as E}from"./index-70997a97.js";const M=({category1Id:m,category2Id:p,category3Id:_,category4Id:x})=>{const a=j(),o=e=>E({url:"datas/get_product_category_details",method:"post",data:e}),{mutate:f,isLoading:d}=s(o,{onSuccess:e=>{var t;D((t=e==null?void 0:e.data)==null?void 0:t.data),a.invalidateQueries("category_1details")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[i,D]=r.useState(r.useMemo(()=>{const e=a.getQueryData("category_1details");return e?e.data:null},[a])),{mutate:C,isLoading:v}=s(o,{onSuccess:e=>{var t;w((t=e==null?void 0:e.data)==null?void 0:t.data),a.invalidateQueries("category_2details")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[l,w]=r.useState(r.useMemo(()=>{const e=a.getQueryData("category_2details");return e?e.data:null},[a])),{mutate:L,isLoading:A}=s(o,{onSuccess:e=>{var t;Q((t=e==null?void 0:e.data)==null?void 0:t.data),a.invalidateQueries("category_3details")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[c,Q]=r.useState(r.useMemo(()=>{const e=a.getQueryData("category_3details");return e?e.data:null},[a])),{mutate:h,isLoading:S}=s(o,{onSuccess:e=>{var t;b((t=e==null?void 0:e.data)==null?void 0:t.data),a.invalidateQueries("category_4details")},onError:e=>{console.log(e)},retry:{maxAttempts:3,delay:e=>e*1e3}}),[u,b]=r.useState(r.useMemo(()=>{const e=a.getQueryData("category_4details");return e?e.data:null},[a]));return r.useEffect(()=>{const e=new FormData;e.append("category_id",m);const t=new FormData;t.append("category_id",p);const g=new FormData;g.append("category_id",_);const y=new FormData;y.append("category_id",x),f(e),C(t),L(g),h(y)},[]),n.jsx("div",{className:"w-full sm:w-[85%] relative",children:n.jsx("div",{className:"w-full my-2 P-4 h-10 py-[12px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 flex justify-between items-center  ",children:d||v||d||S?"Loading...":n.jsx("div",{children:n.jsxs("button",{type:"button",className:"mx-2 z-10 cursor-not-allowed",children:["1. ",i==null?void 0:i.product_category_title," 2."," ",l==null?void 0:l.product_category_title," 3."," ",c==null?void 0:c.product_category_title," 4."," ",u==null?void 0:u.product_category_title]})})})})};export{M as default};
