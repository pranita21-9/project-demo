const TodoList = artifacts.require("CertificateList");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};
