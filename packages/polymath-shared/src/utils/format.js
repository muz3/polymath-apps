// @flow
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { times, isNumber } from 'lodash';

import type { BigNumber as BigNumberType } from 'bignumber.js';

type toUSDOpts = {
  decimals: number,
};
/**
 * Converts a number to a string formatted representing dollars
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toUSD = (
  value: number | BigNumberType,
  { decimals = 2 }: toUSDOpts = {}
) => {
  if (!isNumber(value)) {
    return `- USD`;
  }
  const number = new BigNumber(value);
  return `${number.toFormat(decimals)} USD`;
};

type ToPercentOpts = {
  decimals: number,
};
/**
 * Converts a number into a percentage
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toPercent = (
  value: number,
  { decimals = 0 }: ToPercentOpts = {}
) => {
  let decimalsFormat = '';
  times(decimals, time => {
    if (time === 0) {
      decimalsFormat = '.';
    }
    decimalsFormat += '0';
  });

  return numeral(value).format(`0,0${decimalsFormat} %`);
};

type ToTokensOpts = {
  decimals: number,
};
/**
 * Converts a number into a string representing an amount of tokens
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toTokens = (
  value: number,
  { decimals = 0 }: ToTokensOpts = {}
) => {
  if (!isNumber(value)) {
    return `-`;
  }
  const number = new BigNumber(value);
  return number.toFormat(decimals);
};
