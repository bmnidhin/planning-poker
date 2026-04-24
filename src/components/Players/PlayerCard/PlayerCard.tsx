import React from 'react';
import { removePlayer } from '../../../service/players';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { isModerator } from '../../../utils/isModerator';
import { TrashSVG } from '../../SVGs/Trash';
import { getCards } from '../CardPicker/CardConfigs';

interface PlayerCardProps {
  game: Game;
  player: Player;
  currentPlayerId: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ game, player, currentPlayerId }) => {
  const removeUser = (gameId: string, playerId: string) => {
    removePlayer(gameId, playerId);
  };

  return (
    <div
      className='rounded-xl shadow-lg w-32 h-44 border-[3px] border-blue-500 bg-white dark:bg-gray-800 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105'
    >
      <div
        className='flex-1 flex items-center justify-center py-4'
        style={{
          backgroundColor: getCardColor(game, player.value) || 'white',
        }}
      >
        <span className={`font-bold ${getCardValue(player, game)?.length < 2 ? 'text-5xl' : 'text-4xl'}`}>
          {getCardValue(player, game)}
        </span>
      </div>
      <div className='bg-white dark:bg-gray-900 px-3 py-3 flex items-center justify-between min-h-[56px]'>
        <div className='text-left font-bold text-sm truncate flex-1 text-gray-900 dark:text-gray-100' title={player.name}>
          {player.name}
        </div>
        {isModerator(game.createdById, currentPlayerId, game.isAllowMembersToManageSession) &&
          player.id !== currentPlayerId && (
            <button
              title='Remove'
              className='cursor-pointer p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition ml-1 flex-shrink-0'
              onClick={() => removeUser(game.id, player.id)}
              data-testid='remove-button'
            >
              <TrashSVG className='h-4 w-4 text-red-500' />
            </button>
          )}
      </div>
    </div>
  );
};

const getCardColor = (game: Game, value: number | undefined): string => {
  if (game.gameStatus == Status.Finished) {
    const card = getCards(game.gameType).find((card) => card.value === value);
    return card ? card.color : '';
  }
  return '';
};

const getCardValue = (player: Player, game: Game) => {
  if (game.gameStatus !== Status.Finished) {
    return player.status === Status.Finished ? '👍' : '🤔';
  }

  if (game.gameStatus === Status.Finished) {
    if (player.status === Status.Finished) {
      if (player.value && player.value === -1) {
        return player.emoji || '☕'; // coffee emoji
      }
      return getCardDisplayValue(game, player.value);
    }
    return '🤔';
  }
  return '';
};

const getCardDisplayValue = (game: Game, cardValue: number | undefined): string => {
  const cards = game.cards?.length > 0 ? game.cards : getCards(game.gameType);
  return (
    cards.find((card) => card.value === cardValue)?.displayValue || cardValue?.toString() || ''
  );
};
