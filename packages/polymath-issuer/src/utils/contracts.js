// @flow

/**
 * Temporary utilities for interacting with smart contracts, this will
 * be replaced by the new version of polymathjs
 */

import Contract, { ModuleRegistry, PolyToken } from '@polymathnetwork/js';
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import IModuleFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/IModuleFactory.json';
import { ModuleFactoryAbisByType, MODULE_TYPES } from '../constants';

import type { STOModule } from '../constants';

/**
 * Retrieves an STOModule's information based on an address
 * @param address
 *
 * @returns An object with information about the STOModule
 */
export async function getSTOModule(address: string) {
  const web3Client = Contract._params.web3;
  const GenericModuleFactory = new web3Client.eth.Contract(
    IModuleFactoryArtifacts.abi,
    address
  );

  // Create a generic contract instance using the IModuleFactory abi
  const nameRes = await GenericModuleFactory.methods.getName().call();
  const type = web3.utils.hexToUtf8(nameRes);

  const moduleAbi = ModuleFactoryAbisByType[type];
  if (!moduleAbi) {
    throw new Error(`Abi not found for module factory of type "${type}"`);
  }

  // Generate a Contract instance depending on the ModuleFactory type
  const ModuleFactory = new web3Client.eth.Contract(moduleAbi, address);

  const descriptionRes = await ModuleFactory.methods.getDescription().call();
  const titleRes = await ModuleFactory.methods.getTitle().call();
  const ownerRes = await ModuleFactory.methods.owner().call();
  const setupCostRes = await ModuleFactory.methods.setupCost().call();
  const setupCost = PolyToken.removeDecimals(setupCostRes);

  const stoModuleData = {
    title: titleRes,
    description: descriptionRes,
    type,
    address,
    ownerAddress: ownerRes,
    setupCost,
  };

  return stoModuleData;
}

/**
 * Returns a list of STOModules' information that are compatible with a given
 * security token
 *
 * @param securityTokenAddress
 *
 * @return Array of objects containing information about the available
 * STO modules
 */
export async function getSTOModules(securityTokenAddress: string) {
  const addresses: string[] = await ModuleRegistry.getModulesByTypeAndToken(
    MODULE_TYPES.STO,
    securityTokenAddress
  );

  const gettingSTOModulesData = addresses.map(getSTOModule);

  const stoModules: STOModule[] = await Promise.all(gettingSTOModulesData);

  return stoModules;
}