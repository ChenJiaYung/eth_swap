import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
//json array thet describe the function of the sc tell u how the function work, we could use this abi to create a js version of this SC
import Exchange from '../abis/Exchange.json';
import NavBar from './NavBar';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import './App.css';
//{} to execute js inside HTML code
//this.props to pass data 
class Main extends Component {

async componentWillMount(){
  //happens before div happens
  await this.loadWeb3()
  await this.loadBlockchainData()
}
 
async loadBlockchainData(){
  const web3 = window.web3

  //fetch user metamask info
  const accounts = await web3.eth.getAccounts()
  //setting state so we could access public key in other places
  this.setState({ account: accounts[0] })

  //call() to fetch balance from connected user(ETHER)
  const ethBalance = await web3.eth.getBalance(this.state.account)
  //store to state
  this.setState({ ethBalance })
  console.log(this.state.ethBalance)
  
  
  //Token SC
  //JS version of the SC to interact call function from metamask
  //get network id from web3
  const networkId = await web3.eth.net.getId()
  const tokenData = Token.networks[networkId]
  //if token data exist
  if(tokenData){
    //abi include function of SC
    //address- tells where SC is
  const token = new web3.eth.Contract(Token.abi, tokenData.address)
  this.setState({token})

  //call() to fetch balance from connected user(STC)
  let tokenBalance = await token.methods.balanceOf(this.state.account).call()
  this.setState({tokenBalance: tokenBalance.toString()})

  }else{
    //if token not deploy to the network
    window.alert('Token network not deployed to detected network')
  }
  
  //exchange SC
  const exchangeData = Exchange.networks[networkId]
  if(exchangeData){
    //abi include function of SC
    //address- tells where SC is
    const exchange = new web3.eth.Contract(Exchange.abi, exchangeData.address)
  this.setState({exchange})

  }else{
    //if token not deploy to the network
    window.alert('Exchange network not deployed to detected network')
  }


}
//async to support await
async loadWeb3(){
  //metamask privacy mode- reuquires dapp ask permssion to view users' account
  if(window.ethereum){
    //modern web browser
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }else if(window.web3){
    //legacy browser
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    //browser without metamask installed
    window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
  }
}

buyTokens = (etherAmount) =>{
  this.state.exchange.methods.buyTokens().send({value: etherAmount,from: this.state.account })
}

sellTokens = (tokenAmount) =>{
  this.state.token.methods.approve(this.state.exchange.address, tokenAmount).send({from: this.state.account }).on('transactionHash', (hash) => {
    this.state.exchange.methods.sellTokens(tokenAmount).send({ from: this.state.account })
  })
}

//run when component is created
constructor(props) {
  super(props)
  //setting up default state
  this.state = { 
    account: '',
    token: {},
    exchange: {},
    ethBalance: '0',
    tokenBalance: '0',
    ethRate: '0',
    stcRate: '0',
    currentForm: 'buy'
  }
}

render() {
  let content
  if(this.state.currentForm === 'buy'){
    content = <BuyForm ethBalance={this.state.ethBalance} tokenBalance={this.state.tokenBalance} buyTokens={this.buyTokens}/>
  }else{
    content = <SellForm ethBalance={this.state.ethBalance} tokenBalance={this.state.tokenBalance} sellTokens={this.sellTokens}/>
  }
  
  return (
    <div id="content">
      <NavBar account = {this.state.account}/>
      
      
        <div className="container-fluid mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
            >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'sell' })
              }}
            >
            Sell
          </button>
        </div>
        
          <main role="main" className="text-center ml-auto mr-auto" style={{maxWidth:'600px'}}>
            <div className="content mr-auto ml-auto">
  
            {content}
  
            </div>
          </main>
        </div>

    </div>
  );
}
}

export default Main;
