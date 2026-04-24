import React from 'react';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { CardPicker } from '../../Players/CardPicker/CardPicker';
import { Players } from '../../Players/Players';
import { GameController } from '../GameController/GameController';

interface GameAreaProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}
export const GameArea: React.FC<GameAreaProps> = ({ game, players, currentPlayerId }) => {
  return (
    <>
      <div className='flex flex-col min-h-screen items-center justify-center pb-48 pt-20'>
        <Players game={game} players={players} currentPlayerId={currentPlayerId} />
        <GameController game={game} players={players} currentPlayerId={currentPlayerId} />
      </div>
      <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
    </>
  );
};

export default GameArea;
