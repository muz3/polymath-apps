import React, { Fragment, Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Card,
  Paragraph,
  Grid,
  FormItem,
  TextInput,
  CurrencySelect,
  TooltipIcon,
} from '@polymathnetwork/new-ui';
import { FormValues } from '../Container';
import { FormikProps } from 'formik';

interface Props extends FormikProps<FormValues> {}

export class Step3 extends Component<Props> {
  public render() {
    const { handleSubmit } = this.props;
    return (
      <Card p="gridGap">
        <Heading variant="h2" mb="l">
          3. Set Dividends Distribution Parameters
        </Heading>
        <Fragment>
          <Grid gridGap="gridGap" gridAutoFlow="row" width={512}>
            <FormItem name="distributionName">
              <FormItem.Label>Dividend Distribution Name</FormItem.Label>
              <FormItem.Input
                component={TextInput}
                placeholder="Enter the name"
              />
              <FormItem.Error />
            </FormItem>
            <FormItem name="walletAddress">
              <FormItem.Label>
                <Paragraph>
                  <span>Wallet Address to Receive Tax Withholdings</span>
                  <TooltipIcon>
                    Taxes are withheld by the dividends smart contract at the
                    time dividends are distributed. This wallet address will
                    receive the tax withholdings when they are withdrawn
                    following the dividends distribution.
                  </TooltipIcon>
                </Paragraph>
              </FormItem.Label>
              <FormItem.Input
                component={TextInput}
                placeholder="Enter wallet address"
              />
              <FormItem.Error />
            </FormItem>
            <FormItem name="currency">
              <FormItem.Label>Issue in</FormItem.Label>
              <FormItem.Input
                component={CurrencySelect}
                placeholder="Choose currency"
              />
            </FormItem>
            <Box width="336px" mt={0}>
              <FormItem name="value">
                <FormItem.Label>Dividend Amount</FormItem.Label>
                <FormItem.Input
                  component={TextInput}
                  placeholder="Enter the value"
                  inputProps={{ unit: 'POLY' }}
                />
                <FormItem.Error />
              </FormItem>
            </Box>
          </Grid>
          <Box mt="xl">
            <Button type="submit">Configure Dividends</Button>
          </Box>
        </Fragment>
      </Card>
    );
  }
}
