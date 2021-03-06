// @flow

import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ISecurityToken.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/2.x/SecurityToken.json';

import moduleFactoryArtifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ModuleFactory.json';
import BigNumber from 'bignumber.js';
import semver from 'semver';
import Contract from './Contract';
import PermissionManager from './PermissionManager';
import ManualApprovalTransferManager from './ManualApprovalTransferManager';
import TransferManager from './TransferManager';
import VolumeRestrictionTransferManager from './VolumeRestrictionTransferManager';
import PercentageTransferManager from './PercentageTransferManager';
import PartialTM from './PartialTM';
import CountTransferManager from './CountTransferManager';
import ModuleRegistry from './ModuleRegistry';
import IModuleFactory from './IModuleFactory';
import PolyToken from './PolyToken';
import STO, { FUNDRAISE_ETH, FUNDRAISE_POLY } from './STO';
import type { Address, Web3Receipt, Investor } from '../types';
import { LATEST_PROTOCOL_VERSION } from '../constants';

const MODULE_TYPES = {
  PERMISSION: 1,
  TRANSFER: 2,
  STO: 3,
  DIVIDENDS: 4,
};

const MINTED_EVENT = 'Minted';
const ISSUED_EVENT = 'Issued';

export default class SecurityToken extends Contract {
  decimals: number = 18;
  version: string = LATEST_PROTOCOL_VERSION;

  owner: () => Promise<Address>;
  name: () => Promise<string>;
  tokenDetails: () => Promise<string>;
  transfersFrozen: () => Promise<boolean>;
  granularity: () => Promise<number | BigNumber>;

  setTokenBurner: (address: Address) => Promise<Web3Receipt>;
  freezeTransfers: () => Promise<Web3Receipt>;
  unfreezeTransfers: () => Promise<Web3Receipt>;
  updateTokenDetails: (newTokenDetails: string) => Promise<Web3Receipt>;

  constructor(at: Address, art?: any = artifact) {
    super(art, at);
  }

  /**
   * This is a factory function that instanciates an ST object with its corresponding, version-specific artifacts.
   */
  static async create(at: Address): Promise<SecurityToken> {
    let temp = new SecurityToken(at, artifact);
    const version = await temp.getVersion();
    temp.version = version;
    if (semver.lt(version, LATEST_PROTOCOL_VERSION)) {
      temp = new SecurityToken(at, artifact2);
      temp.version = version;
      return temp;
    }
    return temp;
  }

  async getVersion(): Promise<string> {
    const versionArray = await this._methods.getVersion().call();
    return versionArray.join('.');
  }

  addDecimals(n: number | BigNumber): Promise<BigNumber> {
    return new BigNumber(10).toPower(this.decimals).times(n);
  }

  removeDecimals(n: number | BigNumber): Promise<BigNumber> {
    return new BigNumber(n).div(new BigNumber(10).toPower(this.decimals));
  }

  async tokenDetails(): Promise<string> {
    return this._methods.tokenDetails().call();
  }

  async isDivisible(): Promise<boolean> {
    return Number(await this.granularity()) === 1;
  }

  // @NOTE this is not backward compatible with poly-core 3.x, but it's not being used execpt
  // for in investors portal, which is obsolete.
  async verifyTransfer(
    from: Address,
    to: Address,
    amount: BigNumber
  ): Promise<boolean> {
    return this._methods
      .verifyTransfer(
        from,
        to,
        this.addDecimals(amount),
        Contract._params.web3.utils.fromAscii('')
      )
      .call();
  }

  async mintingFrozen(): Promise<boolean> {
    return this._methods.mintingFrozen().call();
  }

  async isIssuable(): Promise<boolean> {
    const version = await this.getVersion();
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return !(await this.mintingFrozen());

    return this._methods.isIssuable().call();
  }

  async mint(investor: Address, amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.mint(investor, this.addDecimals(amount)));
  }

  async issue(investor: Address, amount: BigNumber): Promise<Web3Receipt> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.mint(...arguments);
    return this._tx(this._methods.mint(investor, this.addDecimals(amount)));
  }

  async burn(amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.burn(this.addDecimals(amount)));
  }

  async redeem(amount: BigNumber): Promise<Web3Receipt> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.burn(...arguments);
    return this._tx(this._methods.redeem(this.addDecimals(amount)));
  }

  async getModuleByName(name: string): Promise<Address> {
    const address = (await this._methods
      .getModulesByName(this._toBytes(name))
      .call())[0];
    if (this._isEmptyAddress(address)) {
      throw new Error(`Module ${name} not found`);
    }
    return address;
  }

  async getPermissionManager(): Promise<?PermissionManager> {
    try {
      const address = await this.getModuleByName('GeneralPermissionManager');
      return new PermissionManager(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getPartialTM(): Promise<?PartialTM> {
    try {
      const address = await this.getModuleByName('RestrictedPartialSaleTM');
      return new PartialTM(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getApprovalManager(): Promise<?ManualApprovalTransferManager> {
    try {
      const address = await this.getModuleByName(
        'ManualApprovalTransferManager'
      );
      return new ManualApprovalTransferManager(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getVolumeRestrictionTransferManager(): Promise<?VolumeRestrictionTransferManager> {
    try {
      const address = await this.getModuleByName('VolumeRestrictionTM');
      return new VolumeRestrictionTransferManager(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getTransferManager(): Promise<?TransferManager> {
    try {
      const address = await this.getModuleByName('GeneralTransferManager');
      return new TransferManager(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getPercentageTM(): Promise<?PercentageTransferManager> {
    try {
      const address = await this.getModuleByName('PercentageTransferManager');
      return new PercentageTransferManager(address);
    } catch (e) {
      return null;
    }
  }

  async getCountTM(): Promise<?CountTransferManager> {
    try {
      const address = await this.getModuleByName('CountTransferManager');
      return new CountTransferManager(address, this.version);
    } catch (e) {
      return null;
    }
  }

  async getSTO(): Promise<?STO> {
    try {
      const address = await this.getModuleByName('CappedSTO');
      return new STO(address, this);
    } catch (e) {
      return null;
    }
  }

  async withdrawPoly(amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.withdrawPoly(PolyToken.addDecimals(amount)));
  }

  async transfer(to: Address, amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.transfer(to, this.addDecimals(amount)));
  }

  async transferFrom(
    from: Address,
    to: Address,
    amount: BigNumber
  ): Promise<Web3Receipt> {
    return this._tx(
      this._methods.transferFrom(from, to, this.addDecimals(amount))
    );
  }

  async mintMulti(
    addresses: Array<Address>,
    amounts: Array<number | BigNumber>
  ): Promise<Web3Receipt> {
    const amountsFinal = [];
    for (let amount of amounts) {
      amountsFinal.push(this.addDecimals(amount));
    }

    return this._tx(this._methods.mintMulti(addresses, amountsFinal));
  }

  async issueMulti(
    addresses: Array<Address>,
    amounts: Array<number | BigNumber>
  ): Promise<Web3Receipt> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.mintMulti(...arguments);

    const amountsFinal = [];
    for (let amount of amounts) {
      amountsFinal.push(this.addDecimals(amount));
    }

    const res = await this._tx(
      this._methods.issueMulti(addresses, amountsFinal)
    );
    return res;
  }

  async getMinted(): Promise<Array<Investor>> {
    // $FlowFixMe
    const tm = await this.getTransferManager();
    const investors = await tm.getWhitelist(true);
    const eventName = semver.lt(this.version, LATEST_PROTOCOL_VERSION)
      ? MINTED_EVENT
      : ISSUED_EVENT;
    const events = await this._contractWS.getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: 'latest',
    });

    for (let event of events) {
      const amount = this.removeDecimals(event.returnValues._value);
      for (let i = 0; i < investors.length; i++) {
        if (event.returnValues._to === investors[i].address) {
          if (investors[i].minted) {
            investors[i].minted = investors[i].minted.plus(amount);
          } else {
            investors[i].minted = new BigNumber(amount);
          }
          break;
        }
      }
    }

    const result = [];
    for (let i = 0; i < investors.length; i++) {
      if (investors[i].minted) {
        result.push(investors[i]);
      }
    }

    return result;
  }

  async addModule(
    address: string,
    data: string,
    maxCost: number,
    budget: number,
    isArchived: boolean = false
  ) {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return await this._tx(
        this._methods.addModule(address, data, maxCost, budget)
      );

    return await this._tx(
      this._methods.addModule(address, data, maxCost, budget, isArchived)
    );
  }

  async getModuleFactory(name: string, type: number) {
    // NOTE: getModulesByTypeAndToken will return a module factory that's compatible with the token in hands.
    let availableModules = await ModuleRegistry._methods
      .getModulesByTypeAndToken(type, this.address)
      .call();
    let result = null;
    if (!availableModules || !availableModules.length) {
      return result;
    }

    let counter = 0;

    while (result === null && counter < availableModules.length) {
      const moduleFactory = new IModuleFactory(
        moduleFactoryArtifact,
        availableModules[counter]
      );
      const hexName = await moduleFactory._methods.name().call();
      const currentName = Contract._params.web3.utils.hexToAscii(hexName);
      if (currentName.localeCompare(name) === 0) {
        result = moduleFactory;
        break;
      }
      counter++;
    }

    return result;
  }

  async setCappedSTO(
    start: Date,
    end: Date,
    cap: number,
    rate: number,
    isEth: boolean, // fundraise type, use true for ETH or false for POLY
    fundsReceiver: Address
  ): Promise<Web3Receipt> {
    const cappedSTOFactory = await this.getModuleFactory(
      'CappedSTO',
      MODULE_TYPES.STO
    );
    const setupCost = await cappedSTOFactory.setupCost();
    const balance = await PolyToken.balanceOf(this.address);
    //Skip transfer transaction if setupCost already paid
    if (balance.lt(setupCost)) {
      await PolyToken.transfer(this.address, setupCost);
    }
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_startTime',
          },
          {
            type: 'uint256',
            name: '_endTime',
          },
          {
            type: 'uint256',
            name: '_cap',
          },
          {
            type: 'uint256',
            name: '_rate',
          },
          {
            type: 'uint8[]',
            name: '_fundRaiseTypes',
          },
          {
            type: 'address',
            name: '_fundsReceiver',
          },
        ],
      },
      [
        this._toUnixTS(start),
        this._toUnixTS(end),
        this._toWei(cap),
        rate,
        isEth ? [FUNDRAISE_ETH] : [FUNDRAISE_POLY],
        fundsReceiver,
      ]
    );
    return this.addModule(
      cappedSTOFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  // @FIXME this function should be adding a USDTiered module instead of Capped. However,
  // it's not used any where.
  async setUSDTieredSTO(): Promise<Web3Receipt> {
    const cappedSTOFactory = await this.getModuleFactory(
      'CappedSTO',
      MODULE_TYPES.STO
    );
    const setupCost = await cappedSTOFactory.setupCost();
    await PolyToken.transfer(this.address, setupCost);
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_startTime',
          },
          {
            type: 'uint256',
            name: '_endTime',
          },
          {
            type: 'uint256',
            name: '_cap',
          },
          {
            type: 'uint256',
            name: '_rate',
          },
          {
            type: 'uint8[]',
            name: '_fundRaiseTypes',
          },
          {
            type: 'address',
            name: '_fundsReceiver',
          },
        ],
      },
      [
        this._toUnixTS(start),
        this._toUnixTS(end),
        this._toWei(cap),
        rate,
        isEth ? [FUNDRAISE_ETH] : [FUNDRAISE_POLY],
        fundsReceiver,
      ]
    );
    return this.addModule(
      cappedSTOFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0,
      false
    );
  }

  async setPercentageTM(percentage: number): Promise<Web3Receipt> {
    const percentageTransferManagerFactory = await this.getModuleFactory(
      'PercentageTransferManager',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await percentageTransferManagerFactory.setupCost();
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_maxHolderPercentage',
          },
          {
            type: 'bool',
            name: '_allowPrimaryIssuance',
          },
        ],
      },
      [PercentageTransferManager.addDecimals(percentage), false]
    );
    return this.addModule(
      percentageTransferManagerFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async setPermissionManager(): Promise<Web3Receipt> {
    const generalPermissionManagerFactory = await this.getModuleFactory(
      'GeneralPermissionManager',
      MODULE_TYPES.PERMISSION
    );
    const setupCost = await generalPermissionManagerFactory.setupCost();
    const data = this._toBytes('');
    return this.addModule(
      generalPermissionManagerFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async setPartialTM(): Promise<Web3Receipt> {
    const partialTransferFactory = await this.getModuleFactory(
      'RestrictedPartialSaleTM',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await partialTransferFactory.setupCost();
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'address',
            name: '_treasuryWallet',
          },
        ],
      },
      [this.account]
    );
    return this.addModule(
      partialTransferFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async setApprovalManager(): Promise<Web3Receipt> {
    const approvalManagerFactory = await this.getModuleFactory(
      'ManualApprovalTransferManager',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await approvalManagerFactory.setupCost();
    const data = this._toBytes('');
    return this.addModule(
      approvalManagerFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async setVolumeRestrictionTransferManager(): Promise<Web3Receipt> {
    const volumeRestrictionTransferManagerFactory = await this.getModuleFactory(
      'VolumeRestrictionTM',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await volumeRestrictionTransferManagerFactory.setupCost();
    const data = this._toBytes('');
    return this.addModule(
      volumeRestrictionTransferManagerFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async setCountTM(count: number): Promise<Web3Receipt> {
    const countTransferManagerFactory = await this.getModuleFactory(
      'CountTransferManager',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await countTransferManagerFactory.setupCost();
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_maxHolderCount',
          },
        ],
      },
      [count]
    );
    return this.addModule(
      countTransferManagerFactory.address,
      data,
      PolyToken.addDecimals(setupCost),
      0
    );
  }

  async getModule(at: Address): Promise<Web3Receipt> {
    return this._methods.getModule(at).call();
  }

  async arhiveModule(at: Address): Promise<Web3Receipt> {
    return this._tx(this._methods.archiveModule(at));
  }

  async unarchiveModule(at: Address): Promise<Web3Receipt> {
    return this._tx(this._methods.unarchiveModule(at));
  }
}
