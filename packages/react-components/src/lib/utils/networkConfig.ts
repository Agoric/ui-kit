export type NetworkNotice = {
  start: string;
  // In the future this might be optional to indicate that it's user-dismissable.
  // In that case the client would need some persistent state, perhaps keyed by `message`.
  end: string;
  message: string;
};

export const activeNotices = (notices: Array<NetworkNotice>) => {
  if (!notices) return [];

  const now = Date.now();
  const active = notices.filter(n => {
    const startD = Date.parse(n.start);
    if (startD > now) {
      return false;
    }
    const endD = Date.parse(n.end);
    return startD < endD;
  });
  return active.map(n => n.message);
};
