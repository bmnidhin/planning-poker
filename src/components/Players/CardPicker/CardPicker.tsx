import React, { useEffect, useState } from 'react';
import { updatePlayerValue } from '../../../service/players';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { CardConfig, getCards, getRandomEmoji } from './CardConfigs';

// Helper function to get dark mode compatible colors
const getDarkModeColor = (lightColor: string): string => {
  const colorMap: { [key: string]: string } = {
    '#e7edf3': '#374151', // gray-700
    '#9EC8FE': '#1e40af', // blue-800
    '#A3DFF2': '#0e7490', // cyan-800
    '#9DD49A': '#166534', // green-800
    '#F4DD94': '#854d0e', // yellow-800
    '#F39893': '#991b1b', // red-800
    '#D96C6C': '#7f1d1d', // red-900
    '#9B59B6': '#581c87', // purple-900
  };
  return colorMap[lightColor] || '#374151';
};

interface CardPickerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

export const CardPicker: React.FC<CardPickerProps> = ({ game, players, currentPlayerId }) => {
  const [randomEmoji, setRandomEmoji] = useState(getRandomEmoji);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const cards = game.cards?.length ? game.cards : getCards(game.gameType);

  return (
    <div className='fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t-2 border-gray-300 dark:border-gray-700 shadow-2xl z-30 animate-fade-in-down'>
      <div className='text-center text-sm font-semibold py-3'>
        {game.gameStatus !== Status.Finished
          ? 'Click on the card to vote'
          : 'Session not ready for Voting! Wait for moderator to start'}
      </div>
      <div className='flex flex-wrap justify-center gap-3 py-3 px-4 overflow-x-auto max-h-32 overflow-y-auto'>
        {cards.map((card: CardConfig, index) => {
          const isSelected = players.find((p) => p.id === currentPlayerId)?.value === card.value;
          return (
            <div
              key={card.value}
              id={`card-${card.displayValue}`}
              className={`
              cursor-pointer select-none transition-all duration-300
              rounded-2xl shadow-md
              flex flex-col items-center justify-center
              text-gray-800 dark:text-gray-100
              w-16 h-20
              ${
                isSelected
                  ? 'border-[3px] border-blue-600 dark:border-blue-400 z-10 shadow-lg scale-110'
                  : 'border-[3px] border-blue-400 dark:border-blue-500 shadow-sm scale-100 hover:scale-105'
              }
              ${
                game.gameStatus === Status.Finished
                  ? 'pointer-events-none opacity-50 cursor-not-allowed'
                  : ''
              }
            `}
              style={{
                backgroundColor: isDarkMode ? getDarkModeColor(card.color) : card.color,
              }}
              onClick={() => playPlayer(game.id, currentPlayerId, card)}
            >
              <div className='flex items-center justify-center h-full w-full'>
                {card.value >= 0 && (
                  <span className={`font-bold ${card.displayValue.length < 2 ? 'text-3xl' : 'text-2xl'}`}>
                    {card.displayValue}
                  </span>
                )}
                {card.value === -1 && (
                  <span className='text-3xl'>
                    {randomEmoji}
                  </span>
                )}
                {card.value === -2 && (
                  <span className='text-3xl'>❓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
