import {emptyAddress} from '../constants';
import {formatPost} from './formatPost';

export const postOwnerIsNotEmptyAddress = (value: any): boolean =>
  formatPost(value).author !== emptyAddress;
