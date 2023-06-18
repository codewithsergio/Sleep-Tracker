import "../styles/BreatheExercise.css";
import { useState, useEffect } from "react";

const BreathingExercise = () => {
  const [breathPhase, setBreathPhase] = useState("");
  const [breathCount, setBreathCount] = useState(0);
  const breathLength = 3000; // 1000 * seconds
  const holdLength = 1000;

  useEffect(() => {
    if (breathPhase === "") {
      return;
    }
    if (breathPhase === "inhale") {
      setBreathCount((count) => count + 1);
      const inhaleTimer = setTimeout(() => {
        setBreathPhase("hold");
      }, breathLength);
      return () => clearTimeout(inhaleTimer);
    } else if (breathPhase === "hold") {
      const holdTimer = setTimeout(() => {
        setBreathPhase("exhale");
      }, holdLength);
      return () => clearTimeout(holdTimer);
    } else if (breathPhase === "exhale") {
      const exhaleTimer = setTimeout(() => {
        if (breathCount >= 6) {
          setBreathPhase("");
          setBreathCount(0);
          return;
        }
        setBreathPhase("inhale");
      }, breathLength);
      return () => clearTimeout(exhaleTimer);
    }
  }, [breathPhase]);

  const handleCirclePress = () => {
    if (breathPhase === "") {
      setBreathPhase("inhale");
    } else {
      setBreathPhase("");
      setBreathCount(0);
    }
  };

  return (
    <div className="breath-exercise">
      <h1>Breathing Exercise</h1>
      <div className="outer-circle" onClick={handleCirclePress}>
        <div
          className={`inner-circle circle ${
            breathPhase === "hold" ? "hold" : ""
          } ${breathPhase === "inhale" ? "grow" : ""} ${
            breathPhase === "exhale" ? "shrink" : ""
          }`}
        >
          <h3>
            {breathPhase === "inhale" && "Inhale"}
            {breathPhase === "hold" && "Hold"}
            {breathPhase === "exhale" && "Exhale"}
            {breathPhase === "" && "Press to start"}
          </h3>
          <h4>
            {breathPhase === "inhale" && "Nose"}
            {breathPhase === "hold" && "1"}
            {breathPhase === "exhale" && "Mouth"}
            {breathPhase === "" && ""}
          </h4>
        </div>
      </div>
      <div>Breath Count: {breathCount}</div>
    </div>
  );
};

export default BreathingExercise;
