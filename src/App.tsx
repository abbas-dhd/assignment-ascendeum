import { useEffect, useRef, useState } from "react";
import "./styles.css";
enum GameState {
  started,
  paused,
  stopped,
}

type BoxPosition = {
  x: number;
  y: number;
};
export default function App() {
  const timer = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [gameInterval, setGameInterval] = useState(1); // in milliseconds
  const [gameState, setGameState] = useState(GameState.stopped);

  const [boxPosition, setBoxPosition] = useState<BoxPosition>({ x: 0, y: 0 });
  const [score, setScore] = useState<number[]>([]);

  useEffect(() => {
    console.log("effect ran");
    if (gameState == GameState.started) {
      let x = Math.random() * (500 - 25);
      let y = Math.random() * (500 - 25);

      setBoxPosition({
        x,
        y,
      });

      intervalRef.current = setInterval(() => {
        // start positiong box a random

        let x = Math.random() * (500 - 25);
        let y = Math.random() * (500 - 25);

        setBoxPosition({
          x,
          y,
        });
      }, gameInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState]);

  const startGameInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    let x = Math.random() * (500 - 25);
    let y = Math.random() * (500 - 25);

    setBoxPosition({
      x,
      y,
    });

    intervalRef.current = setInterval(() => {
      // start positiong box a random

      let x = Math.random() * (500 - 25);
      let y = Math.random() * (500 - 25);

      setBoxPosition({
        x,
        y,
      });
    }, gameInterval * 1000);
  };

  return (
    <div className="App">
      <div
        style={{ display: "flex", justifyContent: "flex-start", width: "100" }}
      >
        <Buttons
          onStart={() => {
            timer.current = Date.now();
            setGameState(GameState.started);

            // start timer
            timer.current = Date.now();
          }}
          onPause={() => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setGameState(GameState.paused);
          }}
          onReset={() => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setGameState(GameState.stopped);
            setBoxPosition({ x: 0, y: 0 });
            setScore([]);
          }}
        />
        <input
          type="number"
          min={1}
          max={10}
          style={{ width: "100%" }}
          placeholder="Interval"
          value={gameInterval}
          onChange={(e) => {
            let _interval = Number(e.currentTarget.value);
            if (isNaN(_interval)) {
              setGameInterval(1); // setting 1 second by default
            } else {
              setGameInterval(_interval);
            }
          }}
        />
      </div>
      <GameWindow
        boxPosition={boxPosition}
        showBox={gameState === GameState.started}
        onBoxClick={() => {
          let timeDiff: number = Date.now() - (timer.current ?? 0);
          console.log(timeDiff / 1000);
          setScore((prev) => {
            return [...prev, timeDiff / 1000];
          });

          startGameInterval();
          // timer.current = Date.now();
        }}
      />
      <ScoreSection score={score} />
    </div>
  );
}

const GameWindow = ({
  showBox,
  boxPosition,
  onBoxClick,
}: {
  boxPosition: BoxPosition;
  onBoxClick: () => void;
  showBox: boolean;
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "500px",
        height: "500px",
        background: "lightblue",
      }}
    >
      <div
        id="box"
        onClick={onBoxClick}
        style={{
          display: `${showBox ? "block" : "none"}`,
          position: "absolute",
          height: "25px",
          width: "25px",
          left: `${boxPosition.x}px`,
          top: `${boxPosition.y}px`,
          backgroundColor: "red",
        }}
      ></div>
    </div>
  );
};

const Buttons = ({
  onPause,
  onReset,
  onStart,
}: {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
      <button
        onClick={() => {
          onStart();
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          onPause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          onReset();
        }}
      >
        Reset
      </button>
    </div>
  );
};

const ScoreSection = ({ score }: { score: number[] }) => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>Mouse Click</div>
        <div>Reaction time</div>
      </div>
      {score.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: "1rem" }}>
          <div>{index + 1}</div>
          <div>{item}</div>
        </div>
      ))}
    </div>
  );
};
