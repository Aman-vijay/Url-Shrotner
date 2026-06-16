import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

  
const LocationStats = ({stats}) => {

    const cityCount = stats.reduce((acc,item)=>{
        if(acc[item.city]){
            acc[item.city]+=1;
        }
        else
        acc[item.city] =1;
    return acc;
    },{})

    const cities = Object.entries(cityCount).map(([city,count])=>({
        city,
        count
    })
    ).sort((a,b)=>b.count-a.count);

    const topCities = cities.slice(0,5);
    const restCount = cities.slice(5).reduce((sum, c) => sum + c.count, 0);
    const data = restCount > 0 ? [...topCities, { city: "Other", count: restCount }] : topCities;
  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20 }} accessibilityLayer>
      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.1)" />
      <XAxis dataKey="city" stroke="oklch(0.7 0.01 250)" />
      <YAxis stroke="oklch(0.7 0.01 250)" />
      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.008 250)", border: "1px solid oklch(1 0 0 / 0.12)", borderRadius: 8 }} />
      <Bar dataKey="count" fill="oklch(0.72 0.17 165)" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
  )
}

export default LocationStats
