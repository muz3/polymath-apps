import React from 'react';
import { map } from 'lodash';
import {
  SimpleTable,
  Box,
  InlineFlex,
  ProgressBar,
  TierStatus,
} from '@polymathnetwork/ui';
import { format } from '@polymathnetwork/shared/utils';

import type {
  USDTieredSTO,
  USDTieredSTOTier,
} from '../../../../../../constants';

type Props = {|
  sto: USDTieredSTO,
|};

const {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} = SimpleTable;

const headersData = [
  {
    key: 'tierStatus',
    header: '',
  },
  {
    key: 'tier',
    header: '# Tier',
  },
  {
    key: 'tokenPrice',
    header: <Box textAlign="right">Token Price</Box>,
  },
  {
    key: 'raiseTarget',
    header: <Box textAlign="right">Total Raise Target</Box>,
  },
  {
    key: 'raised',
    header: <Box textAlign="right">Raised</Box>,
  },
  {
    key: 'progress',
    header: '',
  },
];

const USDTieredSTOTiersTable = ({ sto: { tiers } }: Props) => {
  const rowsData = map(
    tiers,
    (
      {
        rate,
        totalTokens,
        tokensSold,
        totalUsd,
        usdRaised,
        status,
      }: USDTieredSTOTier,
      tierNum
    ) => {
      const id = tierNum + 1;
      const progress = tokensSold.div(totalTokens);

      return {
        id: `${id}`,
        rowProps: {
          status,
        },
        tier: id,
        tierStatus: (
          <Box mt="-1px">
            <TierStatus status={status} width="16px" height="16px" />
          </Box>
        ),
        tokenPrice: <Box textAlign="right">{format.toUSD(rate)}</Box>,
        raiseTarget: <Box textAlign="right">{format.toUSD(totalUsd)}</Box>,
        raised: <Box textAlign="right">{format.toUSD(usdRaised)}</Box>,
        progress: (
          <InlineFlex key={id}>
            <Box maxWidth="150px" mr={1}>
              <ProgressBar height="10" progress={progress.toNumber() * 100} />
            </Box>
            {format.toPercent(progress)}
          </InlineFlex>
        ),
      };
    }
  );

  return (
    <SimpleTable
      rows={rowsData}
      headers={headersData}
      render={({ rows, headers }) => (
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableHeader>{header.header}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              const rowData = rowsData.find(rowData => rowData.id === row.id);

              return (
                <TableRow
                  key={row.id}
                  isActive={rowData.rowProps.status === 'active'}
                >
                  {row.cells.map(cell => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    />
  );
};

export default USDTieredSTOTiersTable;
