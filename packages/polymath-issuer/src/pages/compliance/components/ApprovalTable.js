// @flow

import React, { Component } from 'react';
import { DataTable, Icon } from 'carbon-components-react';
import { Button, addressShortifier } from '@polymathnetwork/ui';
import ApprovalModal from './ApprovalModal';
import { connect } from 'react-redux';
import { utils } from '@polymathnetwork/new-shared';
import { EtherscanSubdomains } from '@polymathnetwork/shared/constants';
import {
  removeApprovalFromApprovals,
  editApproval,
} from '../../../actions/compliance';
import moment from 'moment';
const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbar,
  TableToolbarContent,
} = DataTable;

const columns = [
  {
    header: 'From Investor Wallet Address',
    key: 'fromAddress',
  },
  {
    header: 'To Investor Wallet Address',
    key: 'toAddress',
  },
  {
    header: 'Approval Expiry',
    key: 'expiry',
  },
  {
    header: 'Unique ID (TxHash) of Approval',
    key: 'txHash',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Approved Token Transfer',
    key: 'tokens',
  },
  {
    header: 'Tokens Transferred to Date',
    key: 'tokensTransferred',
  },
];

const emptyRow = [
  {
    id: '0',
    description: '-',
    tokens: '-',
    tokensTransferred: '-',
  },
];

type State = {|
  isApprovalModalOpen: boolean,
  isEditingApproval: boolean,
|};

class ApprovalTable extends Component<Props, State> {
  state = {
    isApprovalModalOpen: false,
    isEditingApproval: false,
  };

  handleOpen = () => {
    this.setState({ isEditingApproval: false, isApprovalModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isApprovalModalOpen: false });
    // this.props.editApproval(null);
  };

  handleDelete = id => {
    this.props.removeApprovalFromApprovals(id);
  };

  handleEdit = id => {
    const { approvals, editApproval } = this.props;
    let approval = approvals.find(i => i.id === id);
    editApproval(approval);
    this.setState({ isApprovalModalOpen: true, isEditingApproval: true });
  };

  formatCommas = x => {
    let parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  formatCell = (row, cell) => {
    const { etherscanSubdomain } = this.props;
    if (!cell.value) return '-';
    switch (cell.info.header) {
      case 'fromAddress':
      case 'toAddress':
        return addressShortifier(cell.value);
      case 'expiry':
        return moment.unix(cell.value).format('MMM DD YYYY, hh:mm:ss a');
      case 'tokens':
        return (
          <a
            href={`https://${
              etherscanSubdomain ? etherscanSubdomain + '.' : ''
            }etherscan.io/tx/${row.cells[3].value}`}
            target="_blank"
          >
            {this.formatCommas(cell.value)}
          </a>
        );
      case 'tokensTransferred':
        return this.formatCommas(cell.value);
      default:
        return cell.value;
    }
  };
  render() {
    const { approvals } = this.props;
    return (
      <div>
        <ApprovalModal
          isOpen={this.state.isApprovalModalOpen}
          isEdit={this.state.isEditingApproval}
          handleClose={this.handleClose}
        />
        <DataTable
          headers={columns}
          rows={approvals < 1 ? emptyRow : approvals}
          render={({ rows, headers, getHeaderProps }) => {
            return (
              <TableContainer title="" style={{ minWidth: '73rem' }}>
                <TableToolbar>
                  <TableToolbarContent>
                    {/* pass in `onInputChange` change here to make filtering work */}
                    <Button onClick={this.handleOpen} icon="icon--add">
                      Add new exemption
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map(
                        header =>
                          header.key !== 'txHash' && (
                            <TableHeader
                              key={header}
                              {...getHeaderProps({ header })}
                            >
                              {header.header}
                            </TableHeader>
                          )
                      )}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow
                        key={row.id}
                        // onMouseOver={() => console.log(row)}
                      >
                        {row.cells.map(
                          cell =>
                            cell.info.header !== 'txHash' && (
                              <TableCell key={cell.id}>
                                {this.formatCell(row, cell)}
                              </TableCell>
                            )
                        )}
                        {approvals.length > 0 ? (
                          <TableCell>
                            <div style={{ display: 'flex' }}>
                              <Icon
                                style={
                                  row.cells[5].value - row.cells[6].value ===
                                    0 || row.cells[2].value * 1000 < Date.now()
                                    ? { display: 'none' }
                                    : {}
                                }
                                onClick={() => this.handleEdit(row.id)}
                                className="table-icon"
                                name="edit"
                                width="12"
                                height="12"
                              />
                              <Icon
                                style={
                                  row.cells[5].value - row.cells[6].value ===
                                    0 || row.cells[2].value * 1000 < Date.now()
                                    ? { display: 'none' }
                                    : { marginLeft: '10px' }
                                }
                                onClick={() => this.handleDelete(row.id)}
                                className="table-icon"
                                name="delete"
                                width="12"
                                height="12"
                              />
                            </div>
                          </TableCell>
                        ) : (
                          <TableCell />
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  approvals: state.whitelist.approvals,
  etherscanSubdomain: EtherscanSubdomains[state.network.id],
});

const mapDispatchToProps = {
  editApproval,
  removeApprovalFromApprovals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApprovalTable);
