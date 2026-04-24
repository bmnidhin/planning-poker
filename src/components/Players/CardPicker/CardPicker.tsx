import React, { useEffect, useState } from 'react';
import { updatePlayerValue } from '../../../service/players';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { CardConfig, getCards, getRandomEmoji } from './CardConfigs';

interface CardPickerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

export const CardPicker: React.FC<CardPickerProps> = ({ game, players, currentPlayerId }) => {
  const [randomEmoji, setRandomEmoji] = useState(getRandomEmoji);
  const playPlayer = (gameId: string, playerId: string, card: CardConfig) => {
    if (game.gameStatus !== Status.Finished) {
      updatePlayerValue(gameId, playerId, card.value, randomEmoji);
    }
  };

  useEffect(() => {
    if (game.gameStatus === Status.Started) {
      setRandomEmoji(getRandomEmoji);
    }
  }, [game.gameStatus]);

  const cards = game.cards?.length ? game.cards : getCards(game.gameType);

  return (
    <div className='fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t-2 border-gray-300 dark:border-gray-700 shadow-2xl z-30 animate-fade-in-down'>
      <div className='text-center text-lg font-semibold py-3'>
        {game.gameStatus !== Status.Finished
          ? 'Click on the card to vote'
          : 'Session not ready for Voting! Wait for moderator to start'}
      </div>
      <div className='flex flex-wrap justify-center gap-4 py-4 px-2 overflow-x-auto'>
        {cards.map((card: CardConfig, index) => {
          const isSelected = players.find((p) => p.id === currentPlayerId)?.value === card.value;
          return (
            <div
              key={card.value}
              id={`card-${card.displayValue}`}
              className={`
              cursor-pointer select-none transition-all duration-300
              rounded-2xl shadow-lg
              flex flex-col items-center justify-center
              text-gray-800 dark:text-gray-200
              w-20 h-28
              md:w-24 md:h-32
              ${
                isSelected
                  ? 'border-4 border-blue-600 dark:border-blue-400 z-10 shadow-xl scale-110'
                  : 'border-4 border-blue-400 dark:border-blue-500 shadow-md scale-100 hover:scale-105'
              }
              ${
                game.gameStatus === Status.Finished
                  ? 'pointer-events-none opacity-50 cursor-not-allowed'
                  : ''
              }
            `}
              style={{
                backgroundColor: card.color,
              }}
              onClick={() => playPlayer(game.id, currentPlayerId, card)}
            >
              <div className='flex items-center justify-center h-full w-full'>
                {card.value >= 0 && (
                  <span className={`font-bold ${card.displayValue.length < 2 ? 'text-5xl' : 'text-4xl'}`}>
                    {card.displayValue}
                  </span>
                )}
                {card.value === -1 && (
                  <span className='text-5xl'>
                    {randomEmoji}
                  </span>
                )}
                {card.value === -2 && (
                  <span className='text-5xl'>❓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
