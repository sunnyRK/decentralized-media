pragma solidity ^0.6.0;

import "./Ownable.sol";

contract EthFilecoinStorage is Ownable {
    
    struct profile {
        string[] ipfsHashOfMedia;
        string filecoinToken;
        string userFilecoinAddress;
        bool isRegister;
        mapping(string => string) fileName;
    }
    
    mapping(address => profile) public profileMapping;
    
    modifier isRegister(address _addr) {
        require(profileMapping[_addr].isRegister, "Not registered.");
        _;
    }
    
    modifier isNotRegister(address _addr) {
        require(!profileMapping[_addr].isRegister, "Already registered.");
        _;
    }
    
    event registerUserevent(address owner);
    event uploadHash(address owner, string ipfsHash);
    
    function registerUser(string memory filecoinToken, string memory userFilecoinAddress) public isNotRegister(msg.sender) {
        require(!profileMapping[msg.sender].isRegister, "Already registered.");
        profileMapping[msg.sender].filecoinToken = filecoinToken;
        profileMapping[msg.sender].userFilecoinAddress = userFilecoinAddress;
        profileMapping[msg.sender].isRegister = true;
        emit registerUserevent(msg.sender);
    }
    
    function UploadNewIpfsHash(string memory ipfsHash, string memory fileName) public isRegister(msg.sender) {
        profileMapping[msg.sender].ipfsHashOfMedia.push(ipfsHash);
        profileMapping[msg.sender].fileName[ipfsHash] = fileName;
        emit uploadHash(msg.sender, ipfsHash);
        
    }
    
    function getIpfsHashByIndex(uint256 index, address _addr) isRegister(_addr) public view returns(string memory) {
        return profileMapping[_addr].ipfsHashOfMedia[index];
    }
    
    function getIpfsHashLength(address _addr) isRegister((_addr)) public view returns(uint256) {
        return profileMapping[_addr].ipfsHashOfMedia.length;
    }
    
    function getFilecoinToken(address _addr) isRegister((_addr)) public view returns(string memory) {
        return profileMapping[_addr].filecoinToken;
    }
    
    function getFilecoinUserAddress(address _addr) isRegister((_addr)) public view returns(string memory) {
        return profileMapping[_addr].userFilecoinAddress;
    }
    
    function isRegisterUser(address _addr) public view returns(bool) {
        return profileMapping[_addr].isRegister;
    } 
    
    function getFileName(address _addr, string memory ipfsHash) public view returns(string memory) {
        return (
            profileMapping[_addr].fileName[ipfsHash]
        );
    }
}