App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },

    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const certificateList = await $.getJSON('CertificateList.json')
      App.contracts.CertificateList = TruffleContract(certificateList)
      App.contracts.CertificateList.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.certificateList = await App.contracts.CertificateList.deployed()
    },
  
    render: async () => {

      $('.data').hide();

      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Certificates
      await App.renderCertificates()
  
      // Update loading state
      App.setLoading(false)

      $('.data').show();
    },
  
    renderCertificates: async () => {

      // Load the total certificate count from the blockchain
      const certificateCount = await App.certificateList.certificateCount()

      // Render out each certificate with a new certificate template
      for (var i = 1; i <= certificateCount; i++) {
        // Fetch the certificate data from the blockchain
        const certificate = await App.certificateList.certificates(i)
        const certificateId = i
        const name = certificate[0]
        const branch = certificate[1]
        const college = certificate[2]
        const grade = certificate[3]
  
        // Create the html for the certificate
        var addRowContent = "<tr><td>" + certificateId + "</td><td>" + name + "</td><td>" 
                              + branch + "</td><td>" + grade + "</td><td>" + college + "</td></tr>";
        $(".table tbody").append(addRowContent);
      }
    },

    createCertificate: async () => {
      App.setLoading(true)
      const name = $('#name').val()
      const branch = $('#branch').val()
      const college = $('#college').val()
      const grade = $('#grade').val()
      await App.certificateList.createCertificate(name, branch, college, grade)
      window.location.reload()
    },

    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })