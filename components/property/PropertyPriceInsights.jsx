import { useEffect, useState } from "react";

export default function PropertyPriceInsights(){

  const [data,setData] = useState(null);

  useEffect(()=>{

    fetch("/api/price-insights")
      .then(res=>res.json())
      .then(setData)
      .catch(()=>setData(null));

  },[]);

  if(!data) return null;

  return(

    <div style={wrapper}>

      <h2 style={title}>
        Price Insights
      </h2>

      <div style={grid}>

        <div style={card}>

          <div style={label}>
            Average Price
          </div>

          <div style={value}>
            {data.avgPrice}
          </div>

        </div>

        <div style={card}>

          <div style={label}>
            1 Year Change
          </div>

          <div style={change}>
            {data.change1yr}
          </div>

        </div>

        <div style={card}>

          <div style={label}>
            3 Year Change
          </div>

          <div style={change}>
            {data.change3yr}
          </div>

        </div>

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
  gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
  gap:18
};

const card = {
  background:"#fff",
  border:"1px solid #eee",
  borderRadius:10,
  padding:20,
  boxShadow:"0 3px 10px rgba(0,0,0,0.05)"
};

const label = {
  fontSize:13,
  color:"#777",
  marginBottom:6
};

const value = {
  fontSize:20,
  fontWeight:700
};

const change = {
  fontSize:18,
  fontWeight:600,
  color:"#16a34a"
};