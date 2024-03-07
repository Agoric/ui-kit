import { useContext } from 'react';
import { NetworkContext } from '../context';

export const useAgoricNetwork = () => useContext(NetworkContext);
