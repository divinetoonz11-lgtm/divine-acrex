import { useEffect,useState } from "react";

export default function PropertyReviews({ property }){

  const [reviews,setReviews] = useState([]);

  const locality = property?.locality || "";
  const city = property?.city || "";
  const type = property?.propertyType || "";

  useEffect(()=>{

    if(!property) return;

    fetch(`/api/reviews?locality=${encodeURIComponent(locality)}&city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`)
      .then(res=>res.json())
      .then(data=>setReviews(data))
      .catch(()=>setReviews([]));

  },[property]);

  return(

    <div style={wrapper}>

      <h2 style={title}>
        Society Reviews
      </h2>

      {reviews.length === 0 && (
        <p style={{color:"#777"}}>
          No reviews available
        </p>
      )}

      <div style={grid}>

        {reviews.map((r,i)=>(

          <div key={i} style={card}>

            <div style={head}>

              <div style={name}>
                {r.name}
              </div>

              <div style={stars}>
                {"⭐".repeat(r.rating)}
              </div>

            </div>

            <p style={text}>
              {r.text}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

/* ---------- STYLES ---------- */

const wrapper = {
  padding:"40px 20px",
  maxWidth:1200,
  margin:"auto"
};

const title = {
  fontSize:22,
  fontWeight:600,
  marginBottom:20
};

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
  gap:18
};

const card = {
  background:"#fff",
  border:"1px solid #eee",
  borderRadius:12,
  padding:20,
  boxShadow:"0 3px 10px rgba(0,0,0,0.05)"
};

const head = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:10
};

const name = {
  fontWeight:600
};

const stars = {
  fontSize:14
};

const text = {
  fontSize:14,
  lineHeight:1.6,
  color:"#444"
};