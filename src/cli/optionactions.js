'use strict';
const path = require('path');
const eth = require('./../ethereum/ethereum');
const config = require('./../config/config');
const web3 = require('web3');
/**
 * Actions for CLI options
 * @param {Object} rawOptions - Commander options object
 * @param {string} connection - Connection type ('ipc', 'none')
 * @returns {Object} - Transaction options
 */
module.exports = function(rawOptions, connection) {
  /** Path adjustments */
  const ethPaths = eth.contracts.paths;
  ethPaths.contract = rawOptions.contract || ethPaths.contract;
  ethPaths.built = rawOptions.built || ethPaths.built;
  ethPaths.address = rawOptions.address || ethPaths.address;

  if (connection === 'none') {
    return;
  }

  // Try to connect via IPC if the host is specified. Otherwise RPC
  if (rawOptions.ipchost && typeof rawOptions.ipchost === 'string') {
    if (!rawOptions.ipchost.endsWith('.ipc')) {
      rawOptions.ipchost = path.join(process.cwd(), rawOptions.ipchost, 'geth.ipc');
    }
    eth.initIPC(rawOptions.ipchost);
  } else if (rawOptions.ipchost || connection === 'ipc') {
    eth.initIPC();
  } else {
    eth.init(rawOptions.rpchost, rawOptions.rpcport);
  }

  /** Transaction option adjustments */
  rawOptions = Object.assign({}, rawOptions);
  const options = {};

  if (rawOptions.from) options.from = rawOptions.from;
  if (rawOptions.to) options.to = rawOptions.to;
  if (rawOptions.value) options.value = Number(eth.web3.toWei(rawOptions.value, 'ether').toString()); // Ether to wei
  if (rawOptions.gas) options.gas = rawOptions.gas;
  if (rawOptions.gasprice) options.gasPrice = rawOptions.gasprice;
  if (rawOptions.data) options.data = rawOptions.data;
  if (rawOptions.nonce) options.nonce = rawOptions.nonce;
  if (rawOptions.account) options.account = rawOptions.account;
  if (rawOptions.maxgas) options.maxGas = rawOptions.maxgas;

  return options;
};
