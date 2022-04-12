pragma solidity ^0.5.0;
//pair should should inherit this

contract Token {
    string  public name = "Stonks Coin";
    string  public symbol = "STC";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8   public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
//tells how many token u have, balance of every token holder
    mapping(address => uint256) public balanceOf;
    //keep track of the allowance between the owner and the spender that is acessing the fund of the SC
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }
//send token to someone to another person
    function transfer(address _to, uint256 _value) public returns (bool success) {
        //accessing fund from someone's user wallet it own or contract it self
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
//let somebody else spend my token
    function approve(address _spender, uint256 _value) public returns (bool success) {
        //keep track how much does the spender have allowance to access the owner's 
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
//allow other smart contract to spend money
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        //access ERC20 token from _from address variable, should be run after approval
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}