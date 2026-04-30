import { useEffect, useState } from "react";

export default function PropertyNearby({ property }) {

  const [places,setPlaces] = useState([]);

  const location = [
    property?.locality,
    property?.city,
    property?.state
  ].filter(Boolean).join(" ");

  useEffect(()=>{

    if(!location) return;

    fetch(`/api/nearby?location=${encodeURIComponent(location)}`)
      .then(res=>res.json())
      .then(data=>{

        if(Array.isArray(data)){
          setPlaces(data);
        } else if(data?.results){
          setPlaces(data.results);
        } else {
          setPlaces([]);
        }

      })
      .catch(()=>setPlaces([]));

  },[location]);

  return(

    <div style={{
      maxWidth:1200,
      margin:"auto",
      padding:"30px 0"
    }}>

      <div style={{
        display:"flex",
        alignItems:"center",
        marginBottom:15
      }}>

        <h3 style={{
          fontSize:18,
          fontWeight:600
        }}>
          📍 Places nearby
        </h3>

      </div>

      {places.length === 0 && (
        <p style={{color:"#777"}}>No nearby places found</p>
      )}

      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:10
      }}>

        {places.slice(0,6).map((p,i)=>(

          <div
            key={i}
            style={{
              border:"1px solid #ddd",
              background:"#f7f7f7",
              padding:"8px 14px",
              borderRadius:20,
              fontSize:14,
              cursor:"default"
            }}
          >
            {p.name}
          </div>

        ))}

      </div>

    </div>

  );

}