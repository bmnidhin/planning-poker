import React from 'react';
import { Game } from '../../types/game';
import { Player } from '../../types/player';
import { PlayerCard } from './PlayerCard/PlayerCard';

interface PlayersProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}
export const Players: React.FC<PlayersProps> = ({ game, players, currentPlayerId }) => {
  return (
    <div className='animate-grow flex items-center justify-center w-full'>
      <div className='flex flex-wrap justify-center gap-4 w-full max-w-6xl px-4'>
        {players.map((player: Player) => (
          <PlayerCard
            key={player.id}
            game={game}
            player={player}
            currentPlayerId={currentPlayerId}
          />
        ))}
      </div>
    </div>
  );
};
