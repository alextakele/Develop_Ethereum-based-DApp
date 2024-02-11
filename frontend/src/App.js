import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Refund from './artifacts/contracts/Refund.sol/Refund.json';  // Update the path accordingly

const refundAddress = 'YOUR_REFUND_CONTRACT_ADDRESS';  // Replace with your deployed contract address
const refundAbi = Refund.abi;

const App = () => {
  const [provider, setProvider] = useState();
  const [inputValue, setInputValue] = useState('');
  const [blockNumber, setBlockNumber] = useState('0');
  const [gasPrice, setGasPrice] = useState('0');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('ethereum is available');

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const setBlockchainData = async () => {
        setBlockNumber(await provider.getBlockNumber());
        let gasPrice = await provider.getGasPrice();
        gasPrice = Math.trunc(ethers.utils.formatUnits(gasPrice, 'gwei'));
        setGasPrice(gasPrice);
      }

      setBlockchainData();
      setProvider(provider);
    }
  }, []);

  const accountHandler = async (account) => {
    setAccount(account);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  }

  const connectHandler = async () => {
    try {
      await provider.send('eth_requestAccounts', []);
      const accountList = await provider.listAccounts();
      console.log(accountList)
      accountHandler(accountList[0])
      setConnected(true);
    } catch (error) {
      console.error('Error connecting to the wallet:', error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const refundContract = new ethers.Contract(
      refundAddress,
      refundAbi,
      provider
    );

    const signer = provider.getSigner();
    const refundContractWithSigner = refundContract.connect(signer);

    try {
      console.log(await refundContractWithSigner.addEmployee(
        'EMPLOYEE_ADDRESS',
        123,  // center_lat
        456,  // center_lon
        789,  // radius
        10    // budget
      ));
    } catch (error) {
      console.error('Error submitting transaction:', error.message);
    }
  }

  return (
    <div className='layout'>
      <header className='navbar'>
        <div className='container'>
          <div className='logo'>Refund App</div>
          {connected ? (
            <div>
              <label>
                {`${Number.parseFloat(balance).toPrecision(4)} ETH`}
              </label>
              <button className='account-button' onClick={connectHandler}>
                {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </button>
            </div>
          ) : (
            <button className='connect-button' onClick={connectHandler}>
              Connect
            </button>
          )}
        </div>
      </header>
      <section className='cards'>
        <div className='card'>
          <h2>Add Employee</h2>
          <form onSubmit={handleSubmit}>
            {/* Include input fields for employee details */}
            <button type="submit">Add Employee</button>
          </form>
        </div>
        {/* Include other sections as needed based on your contract functions */}
      </section>
      <footer>
        <div className='container'>
          {gasPrice} gwei &bull; {blockNumber}
        </div>
      </footer>
    </div>
  )
}

export default App;
