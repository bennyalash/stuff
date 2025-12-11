import React, { useMemo } from "react";

// Hash function to generate deterministic numbers from a string
function hashWordToNumber(word, max = 100) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0; // convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

// Flower component
function Flower({ flowerSize, petalColor, middleColor, spinDuration, word }) {
  const stemHeight = flowerSize / 2;
  const stemWidth = stemHeight / 10;

  // Generate petals count and angles deterministically
  const petalsArray = useMemo(() => {
    const petalCount = 5 + hashWordToNumber(word + "petalCount", 5); // 5–9 petals
    const angle = 360 / petalCount;

    return Array.from({ length: petalCount }).map((_, i) => (
      <div
        key={i}
        className="petal"
        style={{
          background: petalColor,
          transform: `rotate(${angle * i}deg)`
        }}
      />
    ));
  }, [word, petalColor]);

  return (
    <div
      className="flower"
      style={{
        position: "relative",
        width: flowerSize,
        height: flowerSize,
        marginRight: "-8px",
        marginLeft: "-8px",
        marginTop: "-8px",
      }}
    >
      <div
        className="stem"
        style={{
          position: "absolute",
          bottom: 0,
          left: `calc(50% - ${stemWidth / 2}px)`,
          width: "2px",
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
          animation: `spin ${spinDuration}s linear infinite`,
        }}
      >
        {petalsArray}
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

// Flowers container
export default function Flowers({ length = 10, word = "flower" }) {
  const petalColors = ["#07A0C3", "#FAA6FF", "#FCAB10", "#AA7DCE"];
  const middleColors = ["#FFE371"];

  // Generate all flowers deterministically using word + index
  const flowers = useMemo(() => {
    return Array.from({ length }).map((_, i) => {
      const flowerWord = word + i; // append index

      const size = 40 + hashWordToNumber(flowerWord + "size", 15); // 40–55
      const spinDuration = 5 + hashWordToNumber(flowerWord + "spin", 20); // 5–25
      const petalColor = petalColors[hashWordToNumber(flowerWord + "petalColor", petalColors.length)];
      const middleColor = middleColors[hashWordToNumber(flowerWord + "middleColor", middleColors.length)];

      return (
        <Flower
          key={i}
          flowerSize={size}
          petalColor={petalColor}
          middleColor={middleColor}
          spinDuration={spinDuration}
          word={flowerWord}
        />
      );
    });
  }, [length, word]);

  return (
    <div
      className="flowers"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0px",
        borderBottom: "2px solid #557a4c",
        alignItems: "flex-end",
        height: "55px",
        width: "208px",
        flexWrap: "nowrap",
        margin: "auto",
      }}
    >
      {flowers}
    </div>
  );
}
