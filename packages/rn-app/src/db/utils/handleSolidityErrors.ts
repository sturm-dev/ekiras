import {solidityErrors} from '../constants';

export const handleSolidityErrors = (error: any): {error: string} => {
  let errorMessageToReturn = 'unknown error';

  solidityErrors.forEach(errorMessage => {
    if ((error as any).toString().includes(errorMessage)) {
      errorMessageToReturn = errorMessage;
    } else {
      console.log(`error`, error);

      return {error: 'unknown error'};
    }
  });

  return {error: errorMessageToReturn};
};
