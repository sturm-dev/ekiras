import {listOfErrors} from '../constants';

export const handleError = (error: any): {error: string} => {
  let errorMessageToReturn = 'unknown error';

  listOfErrors.forEach(errorMessage => {
    if ((error as any).toString().includes(errorMessage))
      errorMessageToReturn = errorMessage;
  });

  if (errorMessageToReturn === 'unknown error') console.warn(`error`, error);

  return {error: errorMessageToReturn};
};
