import { GamesSVG } from '../SVGs/GamesSVG';

import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { GithubSVG } from '../SVGs/Github';
import { JoinSVG } from '../SVGs/Join';
import { MenuSVG } from '../SVGs/Menu';
import { PlusSVG } from '../SVGs/Plus';
import { ThemeControl } from '../ThemeControl/ThemeControl';
import { MenuItem } from './MenuItem';
export const title = 'Neptune Poker';

export const Toolbar = () => {
  const history = useHistory();
  const screenSize = useBreakpoint();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path: string) => {
    history.push(path);
    setIsDropdownOpen(false); // Close dropdown after navigation
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      icon: <PlusSVG />,
      label: 'New session',
      onClick: () => handleNavigation('/'),
      testId: 'toolbar.menu.newSession',
    },
    {
      icon: <JoinSVG />,
      label: 'Join session',
      onClick: () => handleNavigation('/join'),
      testId: 'toolbar.menu.joinSession',
    },
    {
      icon: <GithubSVG />,
      label: 'GitHub',
      onClick: () => (window.location.href = 'https://github.com/bmnidhin/neptune-poker'),
    },
  ];
  return (
    <div className='flex w-full items-center shadow-sm dark:shadow-gray-800'>
      <div className='inline-flex items-center'>
        <button className='button-ghost flex items-center' onClick={() => history.push('/')}>
          <div className='pr-1'>
            <GamesSVG />
          </div>
          <p className='md:text-2xl text-sm font-normal'>{title}</p>
        </button>
      </div>

      {/* Right Section */}
      <div className='inline-flex items-center justify-end flex-1'>
        {screenSize === 'md' || screenSize === 'sm' || screenSize === 'xs' ? (
          <div className='flex relative' ref={dropdownRef}>
            <ThemeControl />
            <button
              className='button-ghost flex items-center'
              onClick={toggleDropdown}
              aria-label='Toggle Menu'
            >
              <MenuSVG />
            </button>
            {isDropdownOpen && (
              <div className='absolute right-0 mt-10 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 flex flex-col'>
                {menuItems.map((item, index) => (
                  <MenuItem
                    icon={item.icon}
                    label={item.label}
                    onClick={item.onClick}
                    key={index}
                    testId={item.testId}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {menuItems.map((item, index) => (
              <MenuItem
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
                key={index}
                testId={item.testId}
              />
            ))}
            <ThemeControl />
          </>
        )}
      </div>
    </div>
  );
};
