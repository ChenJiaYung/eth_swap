pragma solidity ^0.5.0; 
import "./Token.sol";
//ERC20PAIR
contract Exchange {
    string public name = "Stonks Exchange";
    //variable that represent token sc 
    Token public token;
    uint public rate = 100;
    
    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );
    

    function buyTokens() public payable{
        //Amount of Etherum * redemption rate
        //Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        //whatever passing into require is true keep execute, and another way around
        //Making sure user has enough balance to purchase
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        //User can't sell more tokens that they have
        require(token.balanceOf(msg.sender) >= _amount);

        //calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        //Require that ethswap has enough to redeem
        require(address(this).balance >= etherAmount);

        //perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        //Emit an event
        emit TokensSold(msg.sender,address(token),_amount,rate);
    }
}
