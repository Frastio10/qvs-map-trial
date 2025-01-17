import React, { FC, useEffect, useRef } from "react";
import { feature } from "topojson-client";
import { Topology } from "topojson-specification";

import * as d3 from "d3";
import styles from "./WorldMap.module.css";

type Feature = {
  type: string;
  id: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
};

const regions = [
  {
    color: "#CDDBE1",
    text: "ALL REGIONS",
    type: "all",
  },
  {
    color: "#9AAEB5",
    text: "REGION 1",
    type: "secondary",
  },
  {
    color: "#233137",
    text: "REGION 2",
    type: "main",
  },
];

const WorldMapPatternD3: FC<{
  children?: React.ReactNode;
  mainCountries: string[];
  secondariesCountries: string[];
}> = ({ children, mainCountries, secondariesCountries = [] }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const featureUrl = "/features.json";

    const width = 3480;
    const height = 2160;

    const projection = d3
      .geoMercator()
      .scale(500)
      .translate([width / 2, height / 2 + 400]);

    const isHighlighted = (countryId: string) =>
      mainCountries.includes(countryId) ||
      secondariesCountries.includes(countryId);

    const getRegionType = (countryId: string) => {
      if (mainCountries.includes(countryId)) return "main";
      else if (secondariesCountries.includes(countryId)) return "secondary";
      else return "all";
    };

    const getRegionPatternId = (countryId: string) => {
      const region = getRegionType(countryId);
      return `url(#dots-${region})`;
    };

    d3.json<Topology>(featureUrl).then((topology) => {
      if (!topology) return;
      const geojson = feature(topology, topology.objects.world);

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#FAFAFA");

      const parent = svg
        .append("g")
        .selectAll("path")
        // @ts-expect-error D3 somehow doesnt accept this topojson object
        .data(geojson.features)
        .enter();

      const pathParentGroup = parent
        .append("g")
        .attr("clip-path", (d) => `url(#clip-${(d as Feature).id})`);

      pathParentGroup
        .append("defs")
        .append("clipPath")
        .attr("id", (d) => `clip-${(d as Feature).id}`)
        .append("path")
        // @ts-expect-error for some reason d give typescript error
        .attr("d", d3.geoPath().projection(projection));

      // All Regions
      pathParentGroup
        .append("path")
        // @ts-expect-error for some reason d give typescript error
        .attr("d", d3.geoPath().projection(projection))
        .style("fill", (d) => getRegionPatternId((d as Feature).id))
        .style("transition", (d) =>
          isHighlighted((d as Feature).id)
            ? "0.5s ease-in-out"
            : "0.25s all ease-in",
        )
        .on("mouseover", function () {
          d3.select(this).style("fill", "url(#dots-main)");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", (d) =>
            getRegionPatternId((d as Feature).id),
          );
        });

      // For shine animation on highlighted region
      pathParentGroup
        .filter((d) => isHighlighted((d as Feature).id))
        .append("rect")
        .attr("width", "550")
        .attr("height", "100%")
        .attr("fill", "url(#slide-gradient)")
        .attr("transform", "translate(-3500,10)")

        .append("animateTransform")
        .attr("attributeName", "transform")
        .attr("type", "translate")
        .attr("from", "-3500 0")
        .attr("to", "3500 0")
        .attr("repeatCount", "1")
        .attr("dur", "3s");
    });
  }, []);

  return (
    <div className={styles.element}>
      <svg className="map" ref={svgRef}>
        <defs>
          {regions.map((region) => (
            <pattern
              key={region.type}
              id={`dots-${region.type}`}
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="5" fill="#CDDBE1">
                <animate
                  attributeName="fill"
                  from="#CDDBE1"
                  to={region.color}
                  dur="2s"
                  repeatCount="1"
                  fill="freeze"
                  begin="1s;op.end+1s"
                />
              </circle>
            </pattern>
          ))}

          {/* For shine animation */}
          <linearGradient id="slide-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "rgba(255,255,255,0)", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "rgba(255,255,255,0.8)", stopOpacity: 1 }}
            />
            <stop
              offset="99%"
              style={{ stopColor: "rgba(255,255,255,0)", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: "rgba(255,255,255,0)",
                stopOpacity: 1,
              }}
            />
          </linearGradient>
        </defs>
      </svg>
      {children}
      <div className={styles.regions}>
        {regions.map((region) => (
          <div key={region.text} className={styles.region}>
            <span
              className="region-indicator"
              style={{ background: region.color }}
            />
            <p className="region-title">{region.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMapPatternD3;
