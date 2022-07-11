import {listOfErrors} from '../constants';

export const handleError = (error: any): {error: string} => {
  let errorMessageToReturn = 'unknown error';

  listOfErrors.forEach(errorMessage => {
    if ((error as any).toString().includes(errorMessage)) {
      errorMessageToReturn = errorMessage;
    } else {
      console.warn(`error`, error);

      return {error: 'unknown error'};
    }
  });

  return {error: errorMessageToReturn};
};
