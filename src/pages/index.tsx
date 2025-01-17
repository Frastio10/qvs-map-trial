// import GenerateDots from "@/components/Maps/GenerateDots/WorldMapGenerateDots";
import WorldMapPatternD3 from "@/components/Maps/Pattern/WorldMapPatternD3";
import React from "react";

const WorldMap = () => {
  return (
    <div style={{ background: "#FAFAFA", maxWidth: "1000px" }}>
      <WorldMapPatternD3
        mainCountries={["VEN", "IND"]}
        secondariesCountries={["BRA"]}
      />

      {/* <GenerateDots */}
      {/*   mainCountries={["USA", "RUS"]} */}
      {/*   secondariesCountries={["BRA"]} */}
      {/* /> */}
    </div>
  );
};

export default WorldMap;
