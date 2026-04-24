import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertDialog } from '../../../components/AlertDialog/AlertDialog';
import {
  finishGame,
  removeGame,
  resetGame,
  updateGame,
  updateStoryName,
} from '../../../service/games';
import { Game, GameType } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { isModerator } from '../../../utils/isModerator';
import { ExitSVG } from '../../SVGs/Exit';
import { EyeSVG } from '../../SVGs/Eye';
import { InfoSVG } from '../../SVGs/Info';
import { LinkSVG } from '../../SVGs/Link';
import { RefreshSVG } from '../../SVGs/Refresh';
import { TrashSVG } from '../../SVGs/Trash';

interface GameControllerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

export const GameController: React.FC<GameControllerProps> = ({
  game,
  players,
  currentPlayerId,
}) => {
  const history = useHistory();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    if (
      game.autoReveal &&
      game.gameStatus === 'In Progress' &&
      Array.isArray(players) &&
      players.length > 0 &&
      players.every((p: Player) => p.status === Status.Finished)
    ) {
      finishGame(game.id);
    }
  }, [
    game.autoReveal,
    game,
    JSON.stringify(players.map((p) => ({ id: p.id, value: p.value, status: p.status }))),
  ]);

  const onAutoReveal = (value: boolean) => {
    updateGame(game.id, { autoReveal: value });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${game.id}`);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 5000);
  };

  const leaveGame = () => history.push(`/`);
  const handleRemoveGame = async (id: string) => {
    await removeGame(id);
    window.location.href = '/';
  };

  const isMod = isModerator(game.createdById, currentPlayerId, game.isAllowMembersToManageSession);

  return (
    <div className='relative flex w-full px-2'>
      {/* Room Name and Status - Top Left */}
      <div className='fixed top-16 left-4 z-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 max-w-xs'>
        <div className='text-lg font-bold truncate mb-1'>{game.name}</div>
        <div className='flex items-center gap-2 text-sm'>
          <span className='font-medium'>Status:</span>
          <span className='font-semibold'>{game.gameStatus}</span>
          <span>{getGameStatusIcon(game.gameStatus)}</span>
        </div>
        <AverageComponent game={game} players={players} />
      </div>

      {/* Reveal and Restart - Top of Screen */}
      <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-4'>
        <button
          onClick={() => finishGame(game.id)}
          data-testid='reveal-button'
          className='px-8 py-4 text-xl font-bold text-white bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-400 dark:border-green-700 flex items-center gap-3'
        >
          <EyeSVG className='h-7 w-7' />
          Reveal
        </button>
        <button
          onClick={() => resetGame(game.id)}
          data-testid='restart-button'
          className='px-8 py-4 text-xl font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-400 dark:border-blue-700 flex items-center gap-3'
        >
          <RefreshSVG className='h-7 w-7' />
          Restart
        </button>
      </div>

      {/* Auto Reveal - Top Right */}
      {isMod && (
        <div className='fixed top-20 right-4 z-40'>
          <div className='p-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
            <AutoReveal
              autoReveal={game.autoReveal || false}
              onAutoReveal={(value) => onAutoReveal(value)}
            />
          </div>
        </div>
      )}

      {/* Control Buttons - Top Left Vertical Grid */}
      <div className='fixed top-44 left-4 z-40 flex flex-col gap-3'>
        {isMod && (
          <ControllerButton
            icon={<TrashSVG className='h-9 w-9 text-red-500' />}
            label='Delete'
            className='hover:bg-red-200'
            testId='delete-button'
          >
            <AlertDialog
              id={game.id}
              message='Are you sure? This will delete this session and remove all players.'
              onConfirm={() => handleRemoveGame(game.id)}
              data-testid='delete-button-dialog'
            >
              <button
                className='p-2 cursor-pointer rounded-full bg-white dark:bg-gray-900 hover:bg-red-200 transition'
                title='Delete'
              >
                <TrashSVG className='h-9 w-9 text-red-500' />
              </button>
            </AlertDialog>
          </ControllerButton>
        )}
        <ControllerButton
          onClick={leaveGame}
          icon={<ExitSVG className='h-9 w-9 text-orange-500 ' />}
          label='Exit'
          className='hover:bg-red-200'
          testId='exit-button'
        />
        <ControllerButton
          onClick={copyInviteLink}
          icon={<LinkSVG className='h-9 w-9 text-blue-500' />}
          label='Invite'
          className='hover:bg-blue-200'
          testId='invite-button'
          title='Copy invite link'
        />
      </div>


      {/* Snackbar/Alert */}
      {showCopiedMessage && (
        <div className='fixed top-6 right-6 z-50'>
          <div
            className='bg-green-100 border border-green-200  text-gray-800 opacity-85 px-4 py-3 text-xs rounded shadow'
            role='alert'
          >
            <span className='block font-bold'>Invite Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const ControllerButton = ({
  onClick,
  icon,
  label,
  className,
  testId,
  title,
  children,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  className: string;
  testId?: string;
  title?: string;
  children?: React.ReactNode;
}) => (
  <div className='flex flex-col items-center'>
    {children ? (
      children
    ) : (
      <button
        type='button'
        role='button'
        aria-label={label}
        id={testId}
        key={testId}
        onClick={onClick}
        data-testid={testId}
        className={`p-2 cursor-pointer rounded-full bg-white dark:bg-gray-900 ${className} transition`}
        title={title || label}
      >
        {icon}
      </button>
    )}
    <span className='text-xs mt-1'>{label}</span>
  </div>
);

interface AutoRevealProps {
  autoReveal: boolean;
  onAutoReveal: (autoReveal: boolean) => void;
}

export const AutoReveal: React.FC<AutoRevealProps> = ({ autoReveal, onAutoReveal }) => {
  return (
    <div className='flex flex-col items-center'>
      <label className='flex items-center cursor-pointer'>
        <span className='mr-1 text-xs'>Auto Reveal</span>
        <button
          type='button'
          role='switch'
          aria-checked={autoReveal}
          onClick={() => onAutoReveal(!autoReveal)}
          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
            autoReveal ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          style={{ minWidth: '2rem' }}
        >
          <span
            className={`inline-block h-3 w-3 cursor-pointer transform rounded-full bg-white shadow transition-transform ${
              autoReveal ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
    </div>
  );
};

const getGameStatusIcon = (gameStatus: string) => {
  switch (gameStatus) {
    case 'In Progress':
      return '⏱️';
    case 'Finished':
      return '🎉';
    default:
      return '🚀';
  }
};

const AverageComponent: React.FC<{ game: Game; players: Player[] }> = ({ game, players }) => {
  const gameType = game.gameType;
  const NOT_APPLICABLE = 'N/A';
  const EMPTY = '-';
  const canShowAverage = gameType !== GameType.TShirt && gameType !== GameType.TShirtAndNumber;

  if (!canShowAverage) {
    return null;
  }

  const gameAverage = getAverage(game, players);
  let average = game.gameStatus === Status.Finished && gameAverage ? gameAverage.toFixed(2) : EMPTY;

  // if (!areAllFinishedPlayersDisplayValuesNumeric(game, players)) {
  //   average = NOT_APPLICABLE;
  // }

  return (
    <>
      <div className='mx-2 h-6 border-l border-gray-400 dark:border-gray-600' />
      <span className='text-sm font-medium'>Average:</span>
      <span className='px-2 py-1 ml-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 font-bold shadow-sm border border-gray-200 inline-flex items-center relative'>
        {average}
        {average !== EMPTY && average !== NOT_APPLICABLE && (
          <>
            <span className='relative group ml-1'>
              <span className='cursor-pointer group ml-1 flex'>
                <InfoSVG className='h-4 w-4 text-gray-600 dark:text-gray-300' />
              </span>
              <span className='absolute left-1/2 top-full mt-2 z-10 -translate-x-1/2 w-max min-w-[80px] rounded bg-white dark:bg-gray-900 bg-opacity-90 px-2 py-1 text-xs font-semibold border border-gray-200 dark:border-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                {`Rounded Average : ${Math.round(gameAverage) || 0}`}
              </span>
            </span>
          </>
        )}
      </span>
    </>
  );
};

export function areAllFinishedPlayersDisplayValuesNumeric(game: Game, players: Player[]): boolean {
  return players
    .filter((player) => player.status === Status.Finished)
    .every((player) => {
      const value =
        game.gameType === GameType.Custom
          ? Number(game.cards.find((card) => card.value === player.value)?.displayValue)
          : player.value;

      if (!value) return false;
      const num = typeof value === 'number' ? value : Number(value);
      return !isNaN(num);
    });
}

export const getAverage = (game: Game, players: Player[]): number => {
  let values = 0;
  let numberOfPlayersPlayed = 0;
  const cards = game.cards;
  players.forEach((player) => {
    const value =
      game.gameType === GameType.Custom
        ? Number(cards.find((card) => card.value === player.value)?.displayValue)
        : player.value;

    if (
      player.status === Status.Finished &&
      value !== undefined &&
      !isNaN(value) &&
      value &&
      value >= 0
    ) {
      values = values + value;
      numberOfPlayersPlayed++;
    }
  });
  return Math.round((values / numberOfPlayersPlayed) * 100) / 100;
};
