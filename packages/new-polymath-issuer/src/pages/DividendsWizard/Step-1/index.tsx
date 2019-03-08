import React, { useState, useCallback } from 'react';
import { validators, formatters } from '@polymathnetwork/new-shared';
import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Grid,
  Card,
  Paragraph,
  Link,
  Remark,
  ModalConfirm,
  FormItem,
  Checkbox,
  CsvUploader,
} from '@polymathnetwork/new-ui';

export interface Props {
  onSubmitStep: () => void;
  values: any;
}

export const Step1 = ({ onSubmitStep, values }: Props) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  return (
    <Card p="gridGap" boxShadow={1}>
      <Heading variant="h2" mb="l">
        1. Exclude Wallets from the Dividends Calculation
      </Heading>
      <Paragraph>
        Optionally exclude specific investor wallet addresses from the dividends
        calculation and distribution by uploading their address via a CSV which
        includes one wallet (ETH) address per line.
      </Paragraph>
      <Paragraph>
        You can download{' '}
        <Link href="" download>
          <Icon Asset={icons.SvgDownload} /> Sample-Excluding-List.csv
        </Link>{' '}
        example file and edit it.
      </Paragraph>
      <Button
        variant="ghostSecondary"
        iconPosition="right"
        onClick={handleCsvModalOpen}
      >
        Upload CSV of ETH Addresses to exclude
        <Icon
          Asset={icons.SvgDownload}
          width={18}
          height={18}
          rotate="0.5turn"
        />
      </Button>
      <ModalConfirm
        isOpen={isCsvModalOpen}
        onSubmit={onSubmitStep}
        onClose={handleCsvModalClose}
        actionButtonText="Update list and proceed to the next step"
        isActionDisabled={!values.excludedWalletsCsv}
      >
        <ModalConfirm.Header>
          Upload CSV of ETH Addresses to exclude
        </ModalConfirm.Header>
        <Paragraph fontSize={2}>
          This is the explanation of what is going on here.
        </Paragraph>
        <FormItem name="excludedWalletsCsv">
          <FormItem.Input
            component={CsvUploader}
            inputProps={{
              csvConfig: {
                columns: [
                  {
                    name: 'Address',
                    validators: [validators.isString, validators.isNotEmpty],
                    required: true,
                  },
                  {
                    name: 'Sale Lockup',
                    validators: [validators.isDate, validators.isNotEmpty],
                    required: true,
                  },
                  {
                    name: 'Purchase Lockup',
                    validators: [validators.isDate, validators.isNotEmpty],
                    required: true,
                  },
                ],
                header: true,
                maxRows: 3,
              },
            }}
          >
            <CsvUploader.CsvErrors />
            <CsvUploader.CsvPreview
              tableConfig={{
                columns: [
                  {
                    accessor: 'Address',
                    Header: 'Address',
                    Cell: ({ value }) =>
                      value && formatters.toShortAddress(value, { size: 26 }),
                  },
                  {
                    accessor: 'Sale Lockup',
                    Header: 'Sale Lockup',
                  },
                  {
                    accessor: 'Purchase Lockup',
                    Header: 'Purchase Lockup',
                  },
                ],
              }}
            />
          </FormItem.Input>
          <FormItem.Error />
        </FormItem>
      </ModalConfirm>
      <Remark>
        The number of tokens contained in the wallets that are excluded from the
        dividends calculation and distribution will be deducted from the total
        supply before the final percentages are calculated. For example, if 10
        wallets each contain 1 token and 2 wallets are excluded from dividends,
        each of the remaining 8 wallets will receive 1/8 of the dividends
        <br />
        <strong>
          The maximum number of addresses that can be excluded is 100.
        </strong>
      </Remark>
      <Heading variant="h3" mt="m">
        No Dividends Exclusion Required
      </Heading>
      <FormItem name="noWalletExcluded">
        <FormItem.Input
          component={Checkbox}
          inputProps={{
            label:
              'I confirm that no wallets must be excluded from the dividends distribution.',
          }}
        />
        <FormItem.Error />
      </FormItem>
      <Box mt="xl">
        <Button onClick={onSubmitStep} disabled={!values.noWalletExcluded}>
          Skip the step
        </Button>
      </Box>
    </Card>
  );
};
