import { useEffect, useState } from "react";

export default function PropertyHighlights({ property }) {

  const [points,setPoints] = useState([]);

  useEffect(()=>{

    if(!property) return;

    const list = [];

    if(property.bhk){
      list.push(`${property.bhk} BHK configuration`);
    }

    if(property.area){
      list.push(`${property.area} sq.ft spacious area`);
    }

    if(property.furnishing){
      list.push(`${property.furnishing} property`);
    }

    if(property.propertyType){
      list.push(`${property.propertyType} type property`);
    }

    if(property.postedBy === "Dealer"){
      list.push("Listed by verified dealer");
    }

    if(property.listingFor === "rent"){
      list.push("Ready for immediate rent");
    }

    if(property.listingFor === "sell"){
      list.push("Good for long term investment");
    }

    setPoints(list);

  },[property]);

  if(points.length === 0) return null;

  return(

    <section style={wrapper}>

      <h2 style={title}>
        Why you should consider this property
      </h2>

      <div style={grid}>

        {points.map((p,i)=>(

          <div key={i} style={card}>

            <span style={icon}>✓</span>

            <span style={text}>
              {p}
            </span>

          </div>

        ))}

      </div>

    </section>

  );

}

/* ---------- STYLES ---------- */

const wrapper = {
  maxWidth:1200,
  margin:"50px auto",
  padding:"0 20px"
};

const title = {
  fontSize:26,
  fontWeight:700,
  marginBottom:25,
  color:"#111"
};

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
  gap:20
};

const card = {
  display:"flex",
  alignItems:"center",
  gap:12,
  padding:18,
  border:"1px solid #e5e7eb",
  borderRadius:12,
  background:"#fff",
  fontSize:16,
  fontWeight:500,
  color:"#222",
  boxShadow:"0 3px 8px rgba(0,0,0,0.05)"
};

const icon = {
  color:"#16a34a",
  fontWeight:700,
  fontSize:18
};

const text = {
  lineHeight:1.5
};