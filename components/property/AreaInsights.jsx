import { useEffect, useState } from "react";

export default function AreaInsights({ property }) {

  const [summary,setSummary] = useState("");
  const [images,setImages] = useState([]);

  const locality =
    property?.locality ||
    property?.area ||
    property?.address ||
    property?.city ||
    "";

  const city = property?.city || "";

  const propertyType = property?.propertyType || "";

  useEffect(()=>{

    if(!locality) return;

    loadAIData();
    loadImages();

  },[locality]);


  /* ================= AI SUMMARY ================= */

  const loadAIData = async ()=>{

    try{

      const res = await fetch(
        `/api/property-intelligence?locality=${encodeURIComponent(locality)}&city=${encodeURIComponent(city)}&propertyType=${encodeURIComponent(propertyType)}`
      );

      const data = await res.json();

      if(data.summary){
        setSummary(data.summary);
      }

    }
    catch{

      /* FALLBACK SUMMARY */

      const text = `${locality} is a well established area in ${city}.
      The locality offers connectivity through railway stations,
      metro corridors and major road networks.

      Residents benefit from nearby schools, hospitals,
      shopping malls and daily convenience stores.

      The area features a mix of residential and commercial
      developments making it suitable for both end users
      and property investors.`;

      setSummary(text);

    }

  };


  /* ================= AUTO AREA PHOTOS ================= */

  const loadImages = ()=>{

    const list = [

      `https://source.unsplash.com/800x500/?${locality},buildings`,
      `https://source.unsplash.com/800x500/?${locality},apartments`,
      `https://source.unsplash.com/800x500/?${locality},city`

    ];

    setImages(list);

  };


  return(

    <div style={wrapper}>

      {/* AREA SUMMARY */}

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

          <li>Good road connectivity</li>
          <li>Schools and hospitals nearby</li>
          <li>Shopping malls and restaurants</li>
          <li>Public transport availability</li>
          <li>Growing infrastructure</li>

        </ul>

      </div>

    </div>

  );

}


/* ================= STYLES ================= */

const wrapper = {
  padding:"40px 20px",
  maxWidth:1200,
  margin:"auto"
};

const card = {
  background:"#fff",
  border:"1px solid #eee",
  borderRadius:10,
  padding:25,
  marginBottom:30
};

const title = {
  fontSize:22,
  marginBottom:15
};

const text = {
  lineHeight:1.7,
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
  lineHeight:1.8
};