import React, { useEffect, useRef, useState } from "react";
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [gameInterval, setGameInterval] = useState(1); // in seconds
  const [gameState, setGameState] = useState(GameState.stopped);

  const [boxPosition, setBoxPosition] = useState<BoxPosition>({ x: 0, y: 0 });
  const [score, setScore] = useState<number[]>([]);

  const startGameOnInterval = () => {
    // reset if any previous timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // position box first instantly
    setBoxPosition(getRandomBoxPosition());

    // and now start placing objects on intervals
    intervalRef.current = setInterval(() => {
      // start positiong box a random
      setBoxPosition(getRandomBoxPosition());
    }, gameInterval * 1000);
  };

  useEffect(() => {
    if (gameState == GameState.started) {
      startGameOnInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // not adding startGameOnInterval as dependency as we only want to invoke effect when game state changes
  }, [gameState]);

  const getRandomBoxPosition = (): BoxPosition => {
    const x = Math.random() * (500 - 25);
    const y = Math.random() * (500 - 25);

    return { x, y };
  };

  const startGame = () => {
    timer.current = Date.now();
    setGameState(GameState.started);

    // start timer
    timer.current = Date.now();
  };

  const resetGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setGameState(GameState.stopped);
    setBoxPosition({ x: 0, y: 0 });
    setScore([]);
  };

  const pauseGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setGameState(GameState.paused);
  };

  return (
    <div className="App">
      <div
        style={{ display: "flex", justifyContent: "flex-start", width: "100" }}
      >
        <Buttons
          onStart={() => startGame()}
          onPause={() => pauseGame()}
          onReset={() => resetGame()}
        />
        <input
          type="number"
          min={1}
          max={10}
          style={{ width: "100%" }}
          placeholder="Interval"
          value={gameInterval}
          onChange={(e) => {
            const _interval = Number(e.currentTarget.value);
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
          const timeDiff: number = Date.now() - (timer.current ?? 0);
          console.log(timeDiff / 1000);
          setScore((prev) => {
            return [...prev, timeDiff / 1000];
          });

          startGameOnInterval();

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
