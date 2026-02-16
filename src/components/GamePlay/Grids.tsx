import SingleGameMode from "./GamePlayCards";
import { gameModeData } from "./gameModeData";

const GameModeGrids = () => {
  return (
    <div>
      <div className="mx-auto max-w-full px-0">
        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
          {gameModeData &&
            gameModeData.map((gameMode, key) => (
              <SingleGameMode gameMode={gameMode} key={key} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GameModeGrids;
