const express = require('express'); // using express library
const bodyParser = require("body-parser"); // it acts as a container
//The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code 
//Node-config organizes hierarchical configurations for your app deployments.

require("dotenv").config({ path: ".env" });
const app = express(); // assigning express instance to a variable app
const Web3 = require('web3'); // using web3 to integrate to blockchain
const urlEncodedData = bodyParser.urlencoded({extended: false}); // here we fetch data from the container
app.use(urlEncodedData);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = "0xfa4dfB7F76C586bD0304FB1A95Efd7D5ADeec5DA";
const contractABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_scndName",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "_admNo",
				"type": "int256"
			}
		],
		"name": "setDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "firstName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "scndName",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "admNo",
						"type": "int256"
					}
				],
				"internalType": "struct details.student",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_admNo",
				"type": "int256"
			}
		],
		"name": "getDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "firstName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "scndName",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "admNo",
						"type": "int256"
					}
				],
				"internalType": "struct details.student",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_a",
				"type": "string"
			}
		],
		"name": "printHello",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
const providerURL = "http://127.0.0.1:7545"
const web3 = new Web3(providerURL);
var myContract = new web3.eth.Contract(contractABI, contractAddress, {  //created an instance of the contract
	from: "0x208965eAf92e25C87Ad9bAC7AA86f019e49320F8",
	gas: 3000000
  });

//inside an async function, you can use the await keyword before a call to a function that returns a promise. This makes the code wait at that
// point until the promise is settled, at which point the fulfilled value of the promise is treated as a return value, or the rejected value is thrown.
app.get('/', async (req, res) => {
	res.sendFile(  __dirname + "/index.html")
})

app.get('/getDetail', async (req, res) => {
	res.sendFile(  __dirname + "/getDetails.html")
})


//The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call.

var account = [];

// retrieve the account[0] address from the ganache
async function accountList() {
	 account = await  web3.eth.getAccounts() 
	console.log(account[1]); 
}
accountList(); 

// Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
// for accounts.signTransaction().

//retrieve data from server using the getDetails()
/*app.post('/getDetails', urlEncodedData, async (req, res) => {
	console.log(req.body.firstName);
	res.send(req.body.firstName + req.body.scndName + req.body.admNo); //to print the data together
})*/

//to set or store data in the mapping using the setDetails()
app.post('/setDetails', urlEncodedData,  async(req, res) => { // with mention urlEncodedData we actually use the data.
try {
	const chainId = await web3.eth.getChainId();

	/*const account = web3.eth.getAccounts().then((accounts) => { // to gather the account addresses
		console.log("accounts: ", accounts[0]);
	  });*/
	  //The web3.eth package allows you to interact with an Ethereum blockchain and Ethereum smart contracts.  The Eth module for interacting with the Ethereum network (web3.eth).
	  const tx = await myContract.methods.setDetails(
													req.body.firstName,
													 req.body.scndName,
													  req.body.admNo)

	const gas = await tx.estimateGas({ from: account[1]});
	const gasPrice = await web3.eth.getGasPrice();
	const data = tx.encodeABI();
	const nonce = await web3.eth.getTransactionCount(account[1]);

	const signedTx = await web3.eth.accounts.signTransaction({
		to: myContract.options.address,
		from: account[1],
		data,
		gasPrice,
		gas,
		nonce,
		chainId: chainId
	}, PRIVATE_KEY)

	console.log(signedTx);
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction) //Basically a raw transaction is a machine representation of a transaction, with the signature attached to it
	res.send(receipt);

} catch (error) {
	console.error(error);

}
})

//get method to retrieve data
app.post('/getDetails', urlEncodedData, async(req, res) => { //methods is used to interect with function definition and abi
  console.log(req.body.admNo)
	const value = await myContract.methods.getDetails(req.body.admNo).call(); //get the details of admNo 123 from the mapping in the contract
    res.send(value);  
})

app.listen(3000, (req, res) => {
    console.log("Server is up and running at localhost:3000");
})




