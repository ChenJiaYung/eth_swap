var Token = artifacts.require("Token");
var Exchange = artifacts.require("Exchange");


module.exports = async function(deployer){
//Deploy Token.sol
  await deployer.deploy(Token);
  const token = await Token.deployed()

//Deploy EthSwap.sol
  await deployer.deploy(Exchange, token.address);
  const exchange = await Exchange.deployed()



  //transfer all tokens to EthSwap from deployer
  await token.transfer(exchange.address, '1000000000000000000000000')

  //transfer token to pool
  
}