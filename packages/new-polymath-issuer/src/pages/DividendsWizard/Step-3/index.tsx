import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Link,
  Grid,
  Form,
  FormItem,
  TextInput,
  CurrencySelect,
  Checkbox,
  TooltipIcon,
} from '@polymathnetwork/new-ui';

export interface Props {}

export const Step3 = ({  }: Props) => (
  <Card p="gridGap">
    <Heading variant="h2" mb="l">
      3. Set Dividends Distribution Parameters
    </Heading>
    <Form
      initialValues={{
        noWalletExcluded: false,
      }}
      onSubmit={() => {}}
      render={({ handleSubmit, isValid }) => (
        <Fragment>
          <Grid gridGap="gridGap" gridAutoFlow="row" width={512}>
            <FormItem name="textInput">
              <FormItem.Label>Dividend Distribution Name</FormItem.Label>
              <FormItem.Input
                component={TextInput}
                placeholder="Enter the name"
              />
              <FormItem.Error />
            </FormItem>
            <FormItem name="textInput">
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
            <FormItem name="myCurrency">
              <FormItem.Label>Issue in</FormItem.Label>
              <FormItem.Input
                component={CurrencySelect}
                placeholder="Choose currency"
              />
            </FormItem>
            <Box width="336px" mt={0}>
              <FormItem name="textInput">
                <FormItem.Label>Dividend Amount</FormItem.Label>
                <FormItem.Input
                  component={TextInput}
                  placeholder="Enter the value"
                  unit="POLY"
                />
                <FormItem.Error />
              </FormItem>
            </Box>
          </Grid>
          <Box mt="xl">
            <Button type="submit">Configure Dividends</Button>
          </Box>
        </Fragment>
      )}
    />
  </Card>
);
