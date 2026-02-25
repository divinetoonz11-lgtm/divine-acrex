import React,{useEffect,useState} from "react";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  AreaChart,Area,
  LineChart,Line,
  PieChart,Pie,Cell,
  BarChart,Bar,
  XAxis,YAxis,Tooltip,Legend,CartesianGrid
} from "recharts";

const COLORS=["#2563eb","#16a34a","#f59e0b","#ef4444","#7c3aed"];

export default function DealerOverview(){
  const [data,setData]=useState(null);

  useEffect(()=>{
    (async()=>{
      const res=await fetch("/api/dealer/analytics");
      const json=await res.json();
      if(json.ok) setData(json);
    })();
  },[]);

  if(!data) return null;

  const {kpis,months,monthly,leadSources,cityPerformance}=data;

  const chartData=months.map((m,i)=>({
    month:m,
    properties:monthly.properties[i],
    leads:monthly.leads[i]
  }));

  return(
    <div>

      {/* KPI GRID */}
      <div style={grid}>
        <Kpi title="Total Properties" value={kpis.totalProperties}/>
        <Kpi title="Active Listings" value={kpis.activeListings}/>
        <Kpi title="Total Leads" value={kpis.totalLeads}/>
        <Kpi title="Closed Deals" value={kpis.closedDeals}/>
        <Kpi title="Conversion %" value={kpis.conversionRate} suffix="%"/>
        <Kpi title="Revenue ₹" value={kpis.totalRevenue}/>
      </div>

      {/* AREA CHART */}
      <Card title="Monthly Growth">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="month"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Area type="monotone" dataKey="properties" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2}/>
            <Area type="monotone" dataKey="leads" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* PIE + BAR */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
        <Card title="Lead Sources">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={leadSources} dataKey="value" nameKey="name" outerRadius={100}>
                {leadSources.map((_,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="City Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityPerformance}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="city"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="listings" fill="#2563eb"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* FUNNEL SIMULATION */}
      <Card title="Conversion Funnel">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Funnel label="Leads" value={kpis.totalLeads}/>
          <Funnel label="Active Deals" value={kpis.activeListings}/>
          <Funnel label="Closed Deals" value={kpis.closedDeals}/>
        </div>
      </Card>

    </div>
  );
}

const Kpi=({title,value,suffix=""})=>(
  <div style={kpi}>
    <div>{title}</div>
    <div style={{fontSize:24,fontWeight:900}}>
      <CountUp end={Number(value)} duration={1.5} separator="," suffix={suffix}/>
    </div>
  </div>
);

const Funnel=({label,value})=>(
  <div style={{background:"#e5edff",padding:10,borderRadius:10}}>
    {label}: <b>{value}</b>
  </div>
);

const Card=({title,children})=>(
  <div style={{background:"#fff",padding:20,borderRadius:16,marginTop:20}}>
    <h3>{title}</h3>
    {children}
  </div>
);

const grid={
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
  gap:20
};

const kpi={
  background:"#0a2a5e",
  color:"#fff",
  padding:20,
  borderRadius:16
};