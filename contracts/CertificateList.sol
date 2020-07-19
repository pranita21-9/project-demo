pragma solidity ^0.5.0;

contract CertificateList {
    mapping(uint => Data) public certificates;
    uint public certificateCount;
    address owner;

    constructor() public {
        owner = msg.sender;
        //default
        createCertificate("George", "Bachelor of Computer Engineering",
                                "Dr. Babasaheb Ambedkar Technological University", "First Class With Distinction"); //Default
    }

    modifier _ownerOnly() {
      require(msg.sender == owner, "Not authorized.");
      _;
    }

    struct Data {
        string name;
        string branch;
        string grade;
        string college;
    }

    function createCertificate
    (string memory _name, string memory _branch, string memory _college, string memory _grade)
    public
    _ownerOnly
    {
        certificateCount++;
        certificates[certificateCount] = Data(_name, _branch, _grade, _college);
    }
}