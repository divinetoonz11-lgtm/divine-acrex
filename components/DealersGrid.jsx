import React from "react";

const dealersSample = [
  { id:1, name:"Sainath Properties", image:"/images/dealer-1.jpg", subtitle:"Dealer" },
  { id:2, name:"Singh Estate", image:"/images/dealer-2.jpg", subtitle:"Deven Housing" },
  { id:3, name:"Singh Estate Consultants", image:"/images/dealer-3.jpg", subtitle:"Consultants" },
  { id:4, name:"Karishma Properties", image:"/images/dealer-4.jpg", subtitle:"Dealer" },
  { id:5, name:"Deven Housing", image:"/images/dealer-5.jpg", subtitle:"Agency" }
];

export default function DealersGrid({ dealers = dealersSample }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:20}}>
      {dealers.map(d=>(
        <div key={d.id} style={{border:"1px solid #eee",borderRadius:12,padding:18,textAlign:"center",background:"#fafafa",minHeight:220,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div>
            <div style={{width:90,height:90,borderRadius:"50%",overflow:"hidden",margin:"0 auto",background:"#e6f0f7"}}>
              <img src={d.image} alt={d.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>
            <div style={{marginTop:12,fontWeight:700,fontSize:16}}>{d.name}</div>
            <div style={{color:"#6b7280",fontSize:14,marginTop:6}}>{d.subtitle}</div>
          </div>
          <div style={{marginTop:8}}>
            <button style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"none",background:"#fff",boxShadow:"inset 0 0 0 1px #e6e6e6",cursor:"pointer",fontWeight:600}}>Contact Dealer</button>
          </div>
        </div>
      ))}
    </div>
  );
}
