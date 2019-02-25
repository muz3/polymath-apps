import React, { Fragment } from 'react';
import { Link } from 'redux-little-router';
import {
  List,
  icons,
  IconOutlined,
  TooltipPrimary,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import { DividendCard } from '~/components/DividendCard';
import * as sc from './styles';

export interface Props {
  dividends: types.DividendPojo[];
  securityTokenSymbol: string;
}

export const DividendListPresenter = ({
  securityTokenSymbol,
  dividends,
}: Props) => (
  <List>
    {dividends.length ? (
      <Fragment>
        {dividends.map(dividend => (
          <li key={dividend.uid}>
            <DividendCard
              dividend={dividend}
              securityTokenSymbol={securityTokenSymbol}
            />
          </li>
        ))}
        <sc.NewDividendButton
          RouterLink={Link}
          onClick={() => {}}
          variant="ghost"
          iconPosition="top"
        >
          <IconOutlined
            Asset={icons.SvgPlus}
            width={25}
            height={25}
            scale={0.9}
          />
          Add new <br /> dividend <br /> distribution
          <TooltipPrimary>
            You can add new dividend distribution if previous dividend has been
            completed/expired.
          </TooltipPrimary>
        </sc.NewDividendButton>
      </Fragment>
    ) : (
      <sc.PlaceholderButton
        RouterLink={Link}
        href={`/securityTokens/${securityTokenSymbol}/dividends`}
      >
        <IconOutlined
          Asset={icons.SvgPlus}
          width={25}
          height={25}
          scale={0.9}
        />
        Add new <br /> dividend <br /> distribution
      </sc.PlaceholderButton>
    )}
  </List>
);