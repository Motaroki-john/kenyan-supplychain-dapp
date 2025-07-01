// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    struct Batch {
        string productType;
        string location;
        uint256 timestamp;
        address farmer;
        address buyer;
        bool certified;
    }

    uint256 public batchCount = 0;
    mapping(uint256 => Batch) public batches;

    event NewBatch(uint256 batchId, string productType, address indexed farmer);
    event TransferBatch(uint256 batchId, address indexed from, address indexed to);
    event CertifyBatch(uint256 batchId, bool certified);

    function createBatch(string memory _productType, string memory _location) public {
        batches[batchCount] = Batch(_productType, _location, block.timestamp, msg.sender, address(0), false);
        emit NewBatch(batchCount, _productType, msg.sender);
        batchCount++;
    }

    function transferOwnership(uint256 _batchId, address _buyer) public {
        require(batches[_batchId].farmer == msg.sender, "Only farmer can transfer.");
        batches[_batchId].buyer = _buyer;
        emit TransferBatch(_batchId, msg.sender, _buyer);
    }

    function certifyBatch(uint256 _batchId) public {
        batches[_batchId].certified = true;
        emit CertifyBatch(_batchId, true);
    }

    function getBatch(uint256 _batchId) public view returns (
        string memory, string memory, uint256, address, address, bool
    ) {
        Batch memory b = batches[_batchId];
        return (b.productType, b.location, b.timestamp, b.farmer, b.buyer, b.certified);
    }
}
