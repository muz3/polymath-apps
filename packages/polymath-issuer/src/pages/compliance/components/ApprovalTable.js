// @flow

import React, { Component } from 'react';
import { DataTable, Icon } from 'carbon-components-react';
import { Button, addressShortifier } from '@polymathnetwork/ui';
import ApprovalModal from './ApprovalModal';
import { connect } from 'react-redux';
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
  // {
  //   header: 'Unique ID (TxHash) of Approval',
  //   key: 'txhash',
  // },
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
    fromAddress: '-',
    toAddress: '-',
    // txhash: '-',
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
    this.setState({ isApprovalModalOpen: true });
  };

  handleClose = () => {
    this.setState(
      { isEditingApproval: false },
      this.setState({ isApprovalModalOpen: false })
    ); // TODO: RACE CONDITION MODAL CLOSES TOO SLOW
    // this.setState({ isEditingApproval: false });
    this.props.editApproval(null);
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

  formatCell = cell => {
    if (!cell.value) return '-';
    switch (cell.info.header) {
      case 'fromAddress':
      case 'toAddress':
        return addressShortifier(cell.value);
      case 'expiry':
        return moment.unix(cell.value).format('MMM DD YYYY');
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
              <TableContainer title="">
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
                      {headers.map(header => (
                        <TableHeader
                          key={header}
                          {...getHeaderProps({ header })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow
                        key={row.id}
                        onMouseOver={() => console.log('test')}
                      >
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>
                            {this.formatCell(cell)}
                          </TableCell>
                        ))}
                        {approvals.length > 0 ? (
                          <TableCell>
                            <div style={{ display: 'flex' }}>
                              <Icon
                                onClick={() => this.handleEdit(row.id)}
                                className="table-icon"
                                name="edit"
                                width="12"
                                height="12"
                              />
                              <Icon
                                onClick={() => this.handleDelete(row.id)}
                                className="table-icon"
                                style={{ marginLeft: '10px' }}
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
});

const mapDispatchToProps = {
  editApproval,
  removeApprovalFromApprovals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApprovalTable);