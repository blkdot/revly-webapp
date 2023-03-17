import { FC, ReactNode } from 'react';
import { ReactComponent as Mark } from './icons/mark.svg';
import './TopInputItem.scss';

export const TopInputItem: FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => (
  <div className='top-input-item-container'>
    <div className='top-input-item-header'>
      <Mark height={16} width={16} />
      <span className='top-input-item-title'>{title}</span>
    </div>
    {children}
  </div>
);
