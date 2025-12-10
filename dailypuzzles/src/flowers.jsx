import React from "react";

// Flower component (same as your previous)
function Flower({
  flowerSize = 80,
  petalColor = "blue",
  middleColor = "red",
}) {
  const stemHeight = flowerSize / 2;
  const stemWidth = stemHeight / 10;
  const petalCount = Math.floor(5+Math.random()*5);
  const petalAngle = 360 / petalCount;

  const petals = Array.from({ length: petalCount }).map((_, i) => (
    <div
      key={i}
      className="petal"
      style={{ background: petalColor, transform: `rotate(${petalAngle * i}deg)` }}
    />
  ));

  return (
    <div
      className="flower"
      style={{
        position: "relative",
        width: flowerSize,
        height: flowerSize,
        marginRight: "-8px",
        marginLeft: "-8px",
        marginTop: "-8px"
      }}
    >
      <div
        className="stem"
        style={{
          position: "absolute",
          bottom: 0,
          left: `calc(50% - ${stemWidth / 2}px)`,
          width: '2px',
          height: stemHeight,
          background: "#557a4c",
        }}
      />

      <div
        className="petals"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "50% 50%",
            animation: `spin ${Math.floor(5 + Math.random() * 20)}s linear infinite`,
        }}
      >
        {petals}
      </div>

      <div
        className="middle"
        style={{
          width: flowerSize * 0.15,
          height: flowerSize * 0.15,
          background: middleColor,
          borderRadius: "50%",
          position: "absolute",
          top: `calc(50% - ${flowerSize * 0.075}px)`,
          left: `calc(50% - ${flowerSize * 0.075}px)`,
        }}
      />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
            100% { transform: rotate(360deg); }
          }

          .petal {
            width: ${flowerSize * 0.2}px;
            height: ${flowerSize * 0.266}px;
            
            position: absolute;
            left: calc(50% - ${flowerSize * 0.1}px);
            top: calc(50% - ${flowerSize / 60}px);
            clip-path: ellipse(40% 40% at 50% 60%);
            transform-origin: 50% 6%;
          }
        `}
      </style>
    </div>
  );
}

// Flowers container generating 10 random flowers
export default function Flowers({length = 10}) {
  const flowers = Array.from({ length: length }).map((_, i) => {
    const size = Math.floor(Math.random() * 15) + 40; // random 50–100px
    const petalColors = ["#07A0C3", "#FAA6FF", "#FCAB10", "#AA7DCE"];
    const middleColors = ["#FFE371"];
    return (
      <Flower
        key={i}
        flowerSize={size}
        petalColor={petalColors[Math.floor(Math.random() * petalColors.length)]}
        middleColor={middleColors[Math.floor(Math.random() * middleColors.length)]}
      />
    );
  });

  return (
    <div
      className="flowers"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap:"0px",
        borderBottom: "2px solid #557a4c",
        alignItems: "flex-end",
        height: "55px",
        width: "208px",
        flexWrap: "nowrap",
        margin: "auto"
      }}
    >
      {flowers}
    </div>
  );
}
