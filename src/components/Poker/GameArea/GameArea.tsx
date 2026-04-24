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
      <div className='flex flex-col h-screen pt-16 pb-36'>
                <div className='flex-shrink-0'>
          <GameController game={game} players={players} currentPlayerId={currentPlayerId} />
        </div>
        <div className='flex-1 overflow-hidden mt-12'>
          <Players game={game} players={players} currentPlayerId={currentPlayerId} />
        </div>
      </div>
      <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
    </>
  );
};

export default GameArea;
