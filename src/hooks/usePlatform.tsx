import { useContext } from 'react';
import { PlatformContext } from '../contexts/PlatformContext';

export const usePlatform = () => useContext(PlatformContext) as any;

export default usePlatform;
