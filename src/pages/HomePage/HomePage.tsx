import { useRouteMatch } from 'react-router-dom';
import { Divider } from '../../components/Divider/Divider';
import { CreateGame } from '../../components/Poker/CreateGame/CreateGame';
import { JoinGame } from '../../components/Poker/JoinGame/JoinGame';
import { RecentGames } from '../../components/Poker/RecentGames/RecentGames';
import SessionControllerImage from './../../images/Session.jpg';

export const HomePage = () => {
  return (
    <>
      <div className='flex flex-col items-center w-full animate-fade-in-down'>
        <HeroSection />
        <Divider />
        <RecentGamesSection />
        <Divider />
        <UIDesignSection />
      </div>
    </>
  );
};

import { HTMLAttributes, ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
};

const Section = ({ children, maxWidth = 'max-w-7xl', className = '' }: SectionProps) => (
  <div
    className={`flex flex-col lg:flex-row w-full ${maxWidth} items-center justify-center ${className}`}
  >
    {children}
  </div>
);

type ColumnProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Column = ({ children, className = '', ...props }: ColumnProps) => (
  <div className={`w-full lg:w-1/2 px-4 ${className}`} {...props}>
    {children}
  </div>
);

const HeroSection = () => {
  const isJoin = useRouteMatch('/join');
  return (
    <Section className='pt-8'>
      <Column className='flex flex-col items-center'>
        <div className='w-full max-w-md'>{isJoin ? <JoinGame /> : <CreateGame />}</div>
      </Column>
    </Section>
  );
};

const RecentGamesSection = () => {
  return (
    <Section>
      <Column className='mb-8 lg:mb-0'>
        <div className='p-6 flex flex-col items-center justify-center'>
          <RecentGames />
        </div>
      </Column>
      <Column>
        <div className='p-6 flex flex-col items-center justify-center'>
          <p className='text-base'>
            Here is your recent Planning/Refinement sessions, click on the session name to join the session again.
          </p>
        </div>
      </Column>
    </Section>
  );
};

const UIDesignSection = () => {
  return (
    <Section maxWidth='max-w-5xl'>
      <Column className='mb-8 lg:mb-0'>
        <div className='p-6 flex flex-col items-center justify-center'>
          <h2 className='text-xl font-semibold mb-2'>
            Intuitive UI Design
          </h2>
          <p className='text-base'>
            Beautiful design for voting the story points, showing team members voting status with emojis(👍 - Voting Done, 🤔 - Yet to Vote). Once the card values are revealed, the card color helps to understand if the team's voting is sync or not. Session Moderator has full control on revealing story points and restarting the session.
          </p>
        </div>
      </Column>
      <Column>
        <div className='flex justify-center'>
          <div className='p-4'>
            <img
              className='-mt-2 w-[600px] h-auto rounded-lg shadow-md'
              alt='Session controller'
              src={SessionControllerImage}
            />
          </div>
        </div>
      </Column>
    </Section>
  );
};

export default HomePage;
