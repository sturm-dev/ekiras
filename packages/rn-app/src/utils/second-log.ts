import {ACTIVE_MORE_LOGS} from 'src/config/constants';

export const secondLog = (...args: any[]) => {
  if (ACTIVE_MORE_LOGS === true) console.log(...args);
};
