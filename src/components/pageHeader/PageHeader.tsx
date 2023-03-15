import { FC } from 'react';
import './PageHeader.scss';

export const PageHeader: FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div className='page-header'>
    <span className='page-header-title'>{title}</span>
    <span className='page-header-description'>{description}</span>
  </div>
);
