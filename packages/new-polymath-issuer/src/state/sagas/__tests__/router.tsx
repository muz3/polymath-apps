import React, { Component } from 'react';
import { put, call } from 'redux-saga/effects';
import { LOCATION_CHANGED, push } from 'redux-little-router';
import * as sagas from '~/state/sagas/router';
import { setChangingRoute } from '~/state/actions/app';
import { getGeneratorOutputs, mockEthereumBrowser } from '~/testUtils/helpers';

jest.mock('~/lib/polyClient', () => ({
  polyClient: {
    connect: () => {},
  },
}));

jest.mock('@polymathnetwork/sdk', () => ({
  browserUtils: {
    onAddressChange: jest.fn(() => () => {}),
    getNetworkId: jest.fn(() => 15),
  },
  Polymath: require.requireActual('@polymathnetwork/sdk').Polymath,
}));

class SamplePage extends Component {
  public render() {
    return <div>test</div>;
  }
}

describe('router sagas', () => {
  beforeEach(() => {
    mockEthereumBrowser();
  });

  describe('processRouteChange', () => {
    test('changingRoute correctly gets updated', async () => {
      const action = {
        type: LOCATION_CHANGED,
        payload: { result: { Page: SamplePage } },
      };
      const gen = sagas.processRouteChange(action as any);
      expect(gen.next().value).toEqual(put(setChangingRoute(true)));
      const results = getGeneratorOutputs(gen);
      expect(results).toContainEqual(put(setChangingRoute(false)));
    });

    test('redirects to /notFound if no matching Page is found', () => {
      const action = {
        type: LOCATION_CHANGED,
        payload: { result: {} },
      };
      const gen = sagas.processRouteChange(action as any);
      const results = getGeneratorOutputs(gen);
      expect(results).toContainEqual(put(push('/notFound')));
      expect(results).toContainEqual(put(setChangingRoute(false)));
    });
    test('runs a handler saga if configured for the route', () => {
      const handler = jest.fn();
      const action = {
        type: LOCATION_CHANGED,
        payload: {
          result: {
            handler,
            Page: SamplePage,
          },
        },
      };
      const gen = sagas.processRouteChange(action as any);
      const results = getGeneratorOutputs(gen);
      expect(results).toContainEqual(call(handler));
      expect(results).toContainEqual(put(setChangingRoute(false)));
    });
  });
});
