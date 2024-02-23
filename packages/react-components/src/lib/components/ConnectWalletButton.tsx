import { useAgoric } from '../hooks';

const truncate = (text: string, startChars: number, endChars: number) => {
  const start = text.substring(0, startChars);
  const end = text.substring(text.length - endChars, text.length);
  return start + '...' + end;
};

export const ConnectWalletButton = ({ className }: { className?: string }) => {
  const agoric = useAgoric();

  return (
    <button className={className} onClick={agoric.connect}>
      {agoric.address ? truncate(agoric.address, 8, 7) : 'Connect Wallet'}
    </button>
  );
};
