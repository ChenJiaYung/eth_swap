require('babel-register');
require('babel-polyfill');

//import sc directly from truffle project
//could chnage wehre the sc are
//could take sc json abi file and import into App.js to use the sc directly with the web3.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
