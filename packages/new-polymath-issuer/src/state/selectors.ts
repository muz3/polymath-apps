import { RootState } from '~/state/store';
import { createSelector } from 'reselect';
import { filter, zipWith, forEach, includes, compact } from 'lodash';
import {
  Fetcher,
  RequestKeys,
  FetchedData,
  CacheStatus,
  RequestArgs,
} from '~/types';
import { types, utils } from '@polymathnetwork/new-shared';
import { DataRequestResults } from '~/state/reducers/dataRequests';

const getApp = (state: RootState) => state.app;
const getEntities = (state: RootState) => state.entities;
const getDataRequests = (state: RootState) => state.dataRequests;
const getSession = (state: RootState) => state.session;

const getActiveTransactionQueueId = createSelector(
  getApp,
  app => app.activeTransactionQueue
);

const getTransactionQueues = createSelector(
  getEntities,
  entities => entities.transactionQueues
);

const getTransactions = createSelector(
  getEntities,
  entities => entities.transactions
);

interface FetcherProps {
  fetchers: Fetcher<RequestArgs>[];
}

interface CachedResults {
  cachedData: DataRequestResults[''];
  key: string;
  requestKey: RequestKeys;
  args: RequestArgs;
}

const getEntityStoresPerFetcher = (
  state: RootState,
  { fetchers }: FetcherProps
) => fetchers.map(fetcher => state.entities[fetcher.entity]);

const getCachedResultsPerFetcher = (
  state: RootState,
  { fetchers }: FetcherProps
) =>
  fetchers.map<CachedResults>(fetcher => {
    const { args, propKey, entity, requestKey } = fetcher;

    const argsHash = utils.hashObj(args);
    const cachedData = state.dataRequests[requestKey][argsHash];
    const key = propKey || entity;

    return {
      cachedData,
      key,
      requestKey,
      args,
    };
  });

const getErrorsPerFetcher = (state: RootState, { fetchers }: FetcherProps) =>
  fetchers.map(({ args, propKey, requestKey, entity }) => {
    const argsHash = utils.hashObj(args);
    const cachedData = state.dataRequests[requestKey][argsHash];
    const key = propKey || entity;

    return {
      key,
      requestKey,
      args,
      errorMessage: cachedData && cachedData.errorMessage,
    };
  });

/**
 * Throws an error if more than one fetcher represents the same request (requestKey and arguments)
 * or if more than one fetcher has the same propKey
 */
const checkFetchersForDuplicates = (
  _state: RootState,
  { fetchers }: FetcherProps
): void => {
  const usedPropKeys: {
    [key: string]: boolean | undefined;
  } = {};

  const usedRequests: {
    [key: string]: boolean | undefined;
  } = {};
  fetchers.forEach(fetcher => {
    const { propKey, entity, requestKey } = fetcher;

    const hashedRequest = utils.hashObj({
      requestKey,
      ...fetcher.args,
    });

    if (usedRequests[hashedRequest]) {
      throw new Error(
        'Duplicate fetcher. Make sure you are \
not passing two fetchers with the same `requestKey` and arguments'
      );
    }

    usedRequests[hashedRequest] = true;

    const key = propKey || entity;

    if (usedPropKeys[key]) {
      throw new Error(
        'Cannot override fetched results. \
Make sure to use a different entity name in all of your \
fetchers. You can use `propKey` to override the name of the property that will hold the results.'
      );
    }

    usedPropKeys[key] = true;
  });
};

/**
 * Creates a selector that retrieves cached request data from the store.
 * The result of the selector is an object which contains all the available entities
 * as requested by each fetcher.
 */
const createGetEntitiesFromCache = () =>
  createSelector(
    [
      getEntityStoresPerFetcher,
      getCachedResultsPerFetcher,
      checkFetchersForDuplicates,
    ],
    (entityStores, cachedResults) => {
      const storesWithIds = zipWith(
        entityStores,
        cachedResults,
        (store, result) => {
          const { cachedData, key } = result;
          return { store, cachedData, key };
        }
      );

      const results: FetchedData = {};

      forEach(storesWithIds, data => {
        const { cachedData, key, store } = data;

        if (!cachedData || cachedData.fetching) {
          results[key] = [];
          return;
        }

        const { fetchedIds: cachedIds } = cachedData;

        // NOTE @monitz87: this double type assertion is required because
        // of typescript limitations with the index signature
        results[key] = filter(store.byId, entity =>
          includes(cachedIds, entity!.uid)
        ) as types.Entity[];
      });

      return results;
    }
  );

/**
 * Creates a selector that retrieves the cache status for a group of fetchers.
 * The result of the selector is an array of objects which indicate whether the data
 * associated to a particular request must be fetched again
 */
const createGetCacheStatus = () =>
  createSelector(
    [getCachedResultsPerFetcher, checkFetchersForDuplicates],
    cachedResults =>
      cachedResults.map<CacheStatus>(result => {
        const { requestKey, args, cachedData } = result;

        return {
          requestKey,
          args,
          mustBeFetched: !cachedData,
        };
      })
  );

/**
 * Creates a selector that calculates whether the required data (indicated by the fetchers)
 * is still being fetched
 */
const createGetLoadingStatus = () =>
  createSelector(
    [getCachedResultsPerFetcher, checkFetchersForDuplicates],
    cachedResults =>
      cachedResults.some(result => {
        const { cachedData } = result;

        return !cachedData || cachedData.fetching;
      })
  );

export const createGetFetchersErrorMessages = () =>
  createSelector(
    [getErrorsPerFetcher],
    results => {
      const errorMessages =
        (results && results.map(({ errorMessage }) => errorMessage)) || [];
      return compact(errorMessages);
    }
  );

/**
 * Creates a selector that retrieves the active transaction queue and
 * all of its associated transactions
 */
const createGetActiveTransactionQueue = () =>
  createSelector(
    [getTransactionQueues, getTransactions, getActiveTransactionQueueId],
    (transactionQueues, transactions, activeTransactionQueueId) => {
      if (!activeTransactionQueueId) {
        return null;
      }

      const {
        byId: { [activeTransactionQueueId]: activeTransactionQueue },
      } = transactionQueues;

      if (!activeTransactionQueue) {
        throw new Error(
          'Invalid state. There is an active transaction queue id but no corresponding transaction queue entity.'
        );
      }

      const activeTransactions = filter(
        transactions.byId,
        transaction =>
          transaction!.transactionQueueUid === activeTransactionQueueId
      ) as types.TransactionEntity[];

      if (activeTransactions.length === 0) {
        throw new Error(
          'Invalid state. There is an active transaction queue but no corresponding transaction entities.'
        );
      }

      return {
        ...activeTransactionQueue,
        transactions: [...activeTransactions],
      };
    }
  );

export {
  getApp,
  getEntities,
  getDataRequests,
  getSession,
  getActiveTransactionQueueId,
  getTransactions,
  getTransactionQueues,
  createGetEntitiesFromCache,
  createGetCacheStatus,
  createGetActiveTransactionQueue,
  checkFetchersForDuplicates,
  createGetLoadingStatus,
};
