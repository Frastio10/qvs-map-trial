import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/features.json";
const initialCountryISO = ["USA", "RUS", "BRA"]; // Replace with the desired country ISO code

export default function MapChart() {
  const [highlightedCountry, setHighlightedCountry] =
    useState<string[]>(initialCountryISO);

  useEffect(() => {
    setHighlightedCountry(initialCountryISO);
  }, []);

  return (
    <div style={{ width: "1056px" }}>
      {/* Define the dotted pattern */}
      <svg width="0" height="0">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="1" fill="#CDDBE1" />
          </pattern>
          <pattern
            id="dot-pattern-highlight"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="1" fill="#233137" />
          </pattern>

          <defs>
            <linearGradient
              id="slide-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
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
              ></stop>
            </linearGradient>
          </defs>
        </defs>
      </svg>

      <ComposableMap projection="geoMercator" style={{ background: "#FAFAFA" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo, idx) => {
              const isHighlighted = highlightedCountry.includes(geo.id);
              const clipPathId = `clip-${geo.id}`;
              return (
                <g key={idx} clipPath={`url(#${clipPathId})`}>
                  <defs>
                    <clipPath id={clipPathId}>
                      <path d={geo.svgPath} />
                    </clipPath>
                  </defs>
                  <Geography
                    id={geo.id}
                    geography={geo}
                    className={isHighlighted ? "highlight-map" : ""}
                    style={{
                      default: {
                        fill: isHighlighted
                          ? "url(#dot-pattern-highlight)"
                          : "url(#dot-pattern)", // Highlight or default pattern
                        transition: isHighlighted
                          ? "0.5s ease-in-out"
                          : "0.25s all ease-in", // Add animation
                      },
                      hover: {
                        fill: "url(#dot-pattern-highlight)", // Hover style
                        transition: "0.25s all ease-in",
                      },
                      pressed: {
                        fill: "url(#dot-pattern-highlight)", // Hover style
                        transition: "0.25s all ease-in",
                      },
                    }}
                  />

                  {isHighlighted ? (
                    <rect
                      width="350"
                      height="100%"
                      fill="url(#slide-gradient)"
                      transform="translate(-380,10)"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        from="-800 0"
                        to="800 0"
                        dur="3s"
                        repeatCount="1"
                        begin="1s;op.end+1s"
                      />
                    </rect>
                  ) : (
                    <></>
                  )}
                </g>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
