// @flow

import { STO } from '@polymathnetwork/js';
import type {
  STOFactory,
  STODetails,
  STOPurchase,
} from '@polymathnetwork/js/types';

import * as a from '../actions/sto';
import type { Action } from '../actions/sto';

export const STAGE_FETCHING = 0;
export const STAGE_SELECT = 1;
export const STAGE_CONFIGURE = 2;
export const STAGE_OVERVIEW = 3;
export const STAGE_COMPLETED = 4;

export type STOState = {
  stage: number,
  contract: ?STO,
  details: ?STODetails,
  factories: Array<STOFactory>,
  factory: ?STOFactory,
  purchases: Array<STOPurchase>,
  pauseStatus: boolean,
};

const defaultState: STOState = {
  stage: STAGE_FETCHING,
  contract: null,
  details: null,
  factories: [],
  factory: null,
  purchases: [],
  pauseStatus: true,
};

export default (state: STOState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA: {
      const now = new Date();
      const { details, contract } = action;
      let isFinished = false;
      if (details) {
        const { capReached, isOpen, end, endDate } = details;
        const finishDate = end || endDate;
        isFinished = (capReached && !isOpen) || now >= finishDate;
      }
      return {
        ...state,
        stage: contract
          ? isFinished
            ? STAGE_COMPLETED
            : STAGE_OVERVIEW
          : STAGE_SELECT,
        contract: contract,
        details: details,
      };
    }
    case a.FACTORIES:
      return {
        ...state,
        factories: action.factories,
      };
    case a.USE_FACTORY:
      return {
        ...state,
        stage: STAGE_CONFIGURE,
        factory: action.factory,
      };
    case a.PURCHASES:
      return {
        ...state,
        purchases: action.purchases,
      };
    case a.GO_BACK:
      return {
        ...state,
        stage: STAGE_SELECT,
      };
    case a.PAUSE_STATUS:
      return {
        ...state,
        pauseStatus: action.status,
      };
    default:
      return state;
  }
};
