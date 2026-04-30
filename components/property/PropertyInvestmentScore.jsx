import { useEffect, useState } from "react";

export default function PropertyInvestmentScore({ property }) {

  const [score,setScore] = useState(0);
  const [demand,setDemand] = useState("");
  const [growth,setGrowth] = useState("");

  const type = property?.propertyType || "";
  const city = property?.city || "";

  useEffect(()=>{

    if(!property) return;

    calculateScore();

  },[property]);

  /* -------- SCORE ENGINE -------- */

  const calculateScore = ()=>{

    let s = 60;

    /* PROPERTY TYPE IMPACT */

    if(type.includes("Apartment")) s += 10;
    if(type.includes("Commercial")) s += 12;
    if(type.includes("Shop")) s += 15;
    if(type.includes("Agricultural")) s += 8;
    if(type.includes("Hotel")) s += 14;

    /* CITY DEMAND */

    if(city === "Mumbai") s += 10;
    if(city === "Delhi") s += 9;
    if(city === "Bangalore") s += 9;

    /* LIMIT */

    if(s > 95) s = 95;

    setScore(s);

    /* DEMAND TEXT */

    if(s >= 85) setDemand("Very High Demand");
    else if(s >= 75) setDemand("High Demand");
    else if(s >= 65) setDemand("Moderate Demand");
    else setDemand("Emerging Area");

    /* GROWTH */

    if(s >= 85) setGrowth("Strong price appreciation expected");
    else if(s >= 75) setGrowth("Stable growth potential");
    else if(s >= 65) setGrowth("Moderate growth expected");
    else setGrowth("Developing investment location");

  };

  /* -------- UI -------- */

  return (

    <div style={wrapper}>

      <h2 style={title}>
        Investment Insights
      </h2>

      <div style={grid}>

        <div style={card}>

          <div style={label}>
            Investment Score
          </div>

          <div style={scoreStyle}>
            {score}/100
          </div>

        </div>

        <div style={card}>

          <div style={label}>
            Rental / Buyer Demand
          </div>

          <div style={value}>
            {demand}
          </div>

        </div>

        <div style={card}>

          <div style={label}>
            Growth Potential
          </div>

          <div style={value}>
            {growth}
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
  borderRadius:12,
  padding:20,
  boxShadow:"0 3px 10px rgba(0,0,0,0.05)"
};

const label = {
  fontSize:13,
  color:"#777",
  marginBottom:6
};

const scoreStyle = {
  fontSize:26,
  fontWeight:700,
  color:"#16a34a"
};

const value = {
  fontSize:16,
  fontWeight:600
};