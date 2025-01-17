// import React, { FC, useEffect, useRef } from "react";
// import { feature } from "topojson-client";
// import * as d3 from "d3";
// import styles from "./WorldMap.module.css";

// type Feature = {
//   type: string;
//   id: string;
//   properties: {
//     name: string;
//   };
//   geometry: {
//     type: string;
//     coordinates: number[][][];
//   };
// };

// const regions = [
//   {
//     color: "#CDDBE1",
//     text: "ALL REGIONS",
//     type: "all",
//   },
//   {
//     color: "#9AAEB5",
//     text: "REGION 1",
//     type: "secondary",
//   },
//   {
//     color: "#233137",
//     text: "REGION 2",
//     type: "main",
//   },
// ];

// const WorldMapD3: FC<{
//   children?: React.ReactNode;
//   mainCountries: string[];
//   secondariesCountries: string[];
// }> = ({ children, mainCountries, secondariesCountries = [] }) => {
//   const svgRef = useRef(null);

//   const isHighlighted = (countryId: string) =>
//     mainCountries.includes(countryId) ||
//     secondariesCountries.includes(countryId);

//   const getRegionType = (countryId: string) => {
//     if (mainCountries.includes(countryId)) return "main";
//     else if (secondariesCountries.includes(countryId)) return "secondary";
//     else return "all";
//   };

//   useEffect(() => {
//     const featureUrl = "/features.json";
//     const width = 3480;
//     const height = 2160;
//     const dotSpacing = 20; // Adjust for dot density
//     const dotRadius = 5; // Adjust for dot size

//     const projection = d3
//       .geoMercator()
//       .scale(500)
//       .translate([width / 2, height / 2 + 400]);

//     const createDotGrid = (feature: Feature) => {
//       const path = d3.geoPath().projection(projection);
//       const bounds = path.bound(feature);
//       const [[x0, y0], [x1, y1]] = bounds;
//       const dots = [];

//       for (let x = x0; x <= x1; x += dotSpacing) {
//         for (let y = y0; y <= y1; y += dotSpacing) {
//           // Convert to geographic coordinates
//           const geoCoords = projection.invert([x, y]);
//           // Check if point is inside the country
//           if (geoCoords && d3.geoContains(feature, geoCoords)) {
//             dots.push([x, y]);
//           }
//         }
//       }
//       return dots;
//     };

//     d3.json(featureUrl).then((topology: any) => {
//       const geojson = feature(topology, topology.objects.world);
//       const svg = d3
//         .select(svgRef.current)
//         .attr("width", width)
//         .attr("height", height)
//         .attr("viewBox", `0 0 ${width} ${height}`);

//       // Clear previous content
//       svg.selectAll("*").remove();

//       // Background
//       svg
//         .append("rect")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("fill", "#FAFAFA");

//       // Create container for dots
//       const dotContainer = svg.append("g").attr("class", "dot-container");

//       // Process each country
//       geojson.features.forEach((feature: Feature) => {
//         const regionType = getRegionType(feature.id);
//         const region = regions.find((r) => r.type === regionType);
//         const dots = createDotGrid(feature);

//         // Add dots for this country
//         const countryDots = dotContainer
//           .selectAll(`dots-${feature.id}`)
//           .data(dots)
//           .enter()
//           .append("circle")
//           .attr("cx", (d) => d[0])
//           .attr("cy", (d) => d[1])
//           .attr("r", dotRadius)
//           .attr("fill", region?.color || "#CDDBE1")
//           .attr("class", `dots-${feature.id}`);

//         // Add hover effects
//         if (!isHighlighted(feature.id)) {
//           countryDots
//             .on("mouseover", function () {
//               d3.select(this).attr(
//                 "fill",
//                 regions.find((r) => r.type === "main")?.color,
//               );
//             })
//             .on("mouseout", function () {
//               d3.select(this).attr("fill", region?.color || "#CDDBE1");
//             });
//         }

//         // Add shine animation for highlighted countries
//         if (isHighlighted(feature.id)) {
//           const shineGradient = svg
//             .append("linearGradient")
//             .attr("id", `shine-gradient-${feature.id}`)
//             .attr("x1", "0%")
//             .attr("y1", "0%")
//             .attr("x2", "100%")
//             .attr("y2", "0%");

//           shineGradient
//             .append("stop")
//             .attr("offset", "0%")
//             .attr("stop-color", "rgba(255,255,255,0)");

//           shineGradient
//             .append("stop")
//             .attr("offset", "50%")
//             .attr("stop-color", "rgba(255,255,255,0.8)");

//           shineGradient
//             .append("stop")
//             .attr("offset", "100%")
//             .attr("stop-color", "rgba(255,255,255,0)");

//           const path = d3.geoPath().projection(projection);
//           const bounds = path.bounds(feature);
//           const [[x0, y0], [x1, y1]] = bounds;

//           const shine = dotContainer
//             .append("rect")
//             .attr("x", x0)
//             .attr("y", y0)
//             .attr("width", 550)
//             .attr("height", y1 - y0)
//             .attr("fill", `url(#shine-gradient-${feature.id})`)
//             .attr("transform", `translate(${-3500},10)`);

//           shine
//             .append("animateTransform")
//             .attr("attributeName", "transform")
//             .attr("type", "translate")
//             .attr("from", "-3500 0")
//             .attr("to", "3500 0")
//             .attr("repeatCount", "1")
//             .attr("dur", "3s");
//         }
//       });
//     });
//   }, [mainCountries, secondariesCountries]);

//   return (
//     <div className={styles.element}>
//       <svg ref={svgRef}></svg>
//       {children}
//       <div className={styles.regions}>
//         {regions.map((region) => (
//           <div key={region.text} className={styles.region}>
//             <span style={{ background: region.color }} />
//             <p>{region.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WorldMapD3;
