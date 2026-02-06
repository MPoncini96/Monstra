import SectionTitle from "../Common/SectionTitle";
import SingleGameMode from "./GamePlayCards";
import { gameModeData } from "./gameModeData";

const GameModeGrids = () => {
  return (
    <div>
      <div className="mx-auto max-w-full px-0">
        <SectionTitle
          subTitle="Game Modes"
          title="Choose Your Arena"
          paragraph="Test strategies, battle other players, and earn rewards as your monsters evolve."
        />
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
