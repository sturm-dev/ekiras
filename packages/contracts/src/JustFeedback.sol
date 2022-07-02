// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract JustFeedback {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        players.push(payable(msg.sender));
    }

    function pseudoRandom() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public onlyManager {
        uint256 index = pseudoRandom() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
