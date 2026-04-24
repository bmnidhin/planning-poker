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
    <div className='animate-grow flex items-center justify-center w-full h-full overflow-hidden'>
      <div className='w-full max-w-5xl px-6 h-full overflow-y-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-12'>
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
    </div>
  );
};

// Made with Bob
