import { useContext } from 'react';
import { AgoricContext } from '../context';

export const useAgoric = () => useContext(AgoricContext);
