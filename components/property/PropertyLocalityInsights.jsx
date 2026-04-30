import { useEffect, useState } from "react";

export default function PropertyLocalityInsights({ property }) {

  const [summary,setSummary] = useState("");
  const [images,setImages] = useState([]);
  const [highlights,setHighlights] = useState([]);

  const locality =
    property?.locality ||
    property?.area ||
    property?.address ||
    "";

  const city = property?.city || "";
  const type = property?.propertyType || "";

  useEffect(()=>{

    if(!property) return;

    generateSummary();
    generateHighlights();
    loadImages();

  },[property]);

  /* ---------- AREA SUMMARY ---------- */

  const generateSummary = ()=>{

    let text = "";

    if(type === "Flat / Apartment"){

      text = `${locality} in ${city} is a well established residential locality offering
      apartments and housing societies. The area benefits from strong connectivity
      through railway stations, metro corridors and major road networks.

      Residents have access to schools, hospitals, shopping malls and entertainment
      zones nearby making it suitable for family living and long term residential
      investment.`;

    }

    else if(type === "Commercial" || type === "Shop"){

      text = `${locality} in ${city} is a commercially active area with regular
      customer movement and strong business visibility.

      The locality benefits from surrounding residential neighbourhoods,
      good road connectivity and nearby commercial activity making it
      suitable for retail shops and offices.`;

    }

    else if(type === "Agricultural Land"){

      text = `${locality} in ${city} offers agricultural land parcels suitable
      for farming, plantation projects and long term land investment.

      The region connects to nearby towns and markets through road networks
      and is often considered by investors for land banking opportunities.`;

    }

    else{

      text = `${locality} in ${city} is a developing area with improving
      infrastructure and connectivity. The locality offers access to
      daily convenience services and nearby markets making it a
      suitable location for property investment.`;

    }

    setSummary(text);

  };

  /* ---------- HIGHLIGHTS ---------- */

  const generateHighlights = ()=>{

    setHighlights([
      "Good road connectivity",
      "Schools and hospitals nearby",
      "Shopping malls and restaurants",
      "Public transport availability",
      "Growing infrastructure"
    ]);

  };

  /* ---------- AREA PHOTOS ---------- */

  const loadImages = ()=>{

    const list = [

      `https://source.unsplash.com/800x500/?${locality},city`,
      `https://source.unsplash.com/800x500/?${city},street`,
      `https://source.unsplash.com/800x500/?${city},skyline`

    ];

    setImages(list);

  };

  return(

    <div style={wrapper}>

      {/* SUMMARY */}

      <div style={card}>

        <h2 style={title}>
          About {locality}
        </h2>

        <p style={text}>
          {summary}
        </p>

      </div>

      {/* AREA GALLERY */}

      <div style={card}>

        <h2 style={title}>
          Area Gallery
        </h2>

        <div style={grid}>

          {images.map((img,i)=>(
            <img
              key={i}
              src={img}
              style={imgStyle}
            />
          ))}

        </div>

      </div>

      {/* LOCALITY HIGHLIGHTS */}

      <div style={card}>

        <h2 style={title}>
          Locality Highlights
        </h2>

        <ul style={list}>

          {highlights.map((h,i)=>(
            <li key={i}>{h}</li>
          ))}

        </ul>

      </div>

    </div>

  );

}

/* ---------- STYLES ---------- */

const wrapper = {
  maxWidth:1200,
  margin:"50px auto",
  padding:"0 20px"
};

const card = {
  background:"#fff",
  border:"1px solid #eee",
  borderRadius:12,
  padding:25,
  marginBottom:30
};

const title = {
  fontSize:24,
  fontWeight:600,
  marginBottom:15
};

const text = {
  lineHeight:1.7,
  fontSize:15,
  color:"#444"
};

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
  gap:15
};

const imgStyle = {
  width:"100%",
  height:200,
  objectFit:"cover",
  borderRadius:8
};

const list = {
  paddingLeft:20,
  lineHeight:1.8
};