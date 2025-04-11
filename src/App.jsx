import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 600;
const getImagePath = (index) =>
  `/frames/${(index + 1).toString().padStart(4, "0")}.jpg`;

export default function App() {
  const canvasRef = useRef(null);
  const currentFrame = useRef(0);
  const textRef = useRef(null);

  const render = (index) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = getImagePath(index);

    img.onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(scrollFraction * FRAME_COUNT)
    );

    // Animate image
    if (frameIndex !== currentFrame.current) {
      currentFrame.current = frameIndex;
      requestAnimationFrame(() => render(frameIndex));
    }

    // Animate text fade and scale
    const fadeStart = 0.8; // Start fading in at 80% scroll
    const fadeEnd = 1.0; // Fully visible at 100% scroll
    let opacity = 0;
    let scale = 0.8;

    if (scrollFraction >= fadeStart) {
      const localProgress = (scrollFraction - fadeStart) / (fadeEnd - fadeStart);
      opacity = Math.min(1, localProgress);
      scale = 0.8 + localProgress * 0.4; // From 0.8 to 1.2
    }

    if (textRef.current) {
      textRef.current.style.opacity = opacity;
      textRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("scroll", handleScroll);
    render(0);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ height: "500vh", background: "black" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <h1
          ref={textRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.8)",
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold",
            zIndex: 10,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          Mystic
        </h1>
      </div>
    </div>
  );
}
