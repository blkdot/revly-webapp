/* eslint-disable react/require-default-props */
import { FC, ReactNode } from 'react';
import './PageHeader.scss';

export const PageHeader: FC<{
  title: string;
  description: string;
  extra?: ReactNode;
}> = ({ title, description, extra }) => (
  <div className='page-header'>
    <div className='page-header-text'>
      <span className='page-header-title'>{title}</span>
      <span className='page-header-description'>{description}</span>
    </div>
    {extra && extra}
  </div>
);
