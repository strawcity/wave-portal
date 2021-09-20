import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import abi from './utils/WavePortal.json'
import Lottie from 'react-lottie-player'
import './App.css'
import loading from './loading.json'
import ErrorView from './components/ErrorView'

function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const contractABI = abi.abi
  console.log(contractABI)
  const contractAdress = '0x398fDF8F6A4bB231ff45F0435ECB5dFd27f59121'
  const [allWaves, setAllWaves] = useState([])
  const [isMining, setIsMining] = useState(false)
  const [siteError, setError] = useState({ showError: false, message: '' })
  const [message, setMessage] = useState('')

  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAdress, contractABI, signer)

    let waves = await waveportalContract.getAllWaves()

    let wavesCleaned = []

    waves.forEach((wave) => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message,
      })
    })

    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(oldArray => [...oldArray, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }])
    })

  }

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window
    console.log('check for wallet')
    if (!ethereum) {
      console.log('You need MetaMask for this!')
      return
    } else {
      console.log('We have the ethereum object: ', ethereum)
    }

    //Check if we're authorized to access the user's wallet
    ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      // We could have multiple accounts, check for one.
      if (accounts.length !== 0) {
        // Grab the first account we have access to
        const account = accounts[0]
        console.log('found an authorized account: ', account)

        // Store the users public wallet address for later!
        getAllWaves().catch((err) => {
          console.log(err)
          setError({ showError: true, error: 'You need to be on the Rinkeby test network' })

        })
        setCurrentAccount(account)

      } else {
        console.log('No authorized account found')
      }
    })
  }

  const connectWallet = () => {
    const { ethereum } = window
    if (!ethereum) {
      setError({ showError: true, error: 'You need MetaMask for this!' })
      return
    }

    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        console.log('Connected ', accounts[0])
        setCurrentAccount(accounts[0])
        getAllWaves()
      })
      .catch((err) => console.log(err))
  }

  const wave = async () => {
    console.log(message)
    if (message) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const waveportalContract = new ethers.Contract(contractAdress, contractABI, signer)

      let count = await waveportalContract.getTotalWaves()
      console.log('Retrieved total wave count...', count.toNumber())

      const waveTxn = await waveportalContract.wave(message, { gasLimit: 300000 })

      console.log('Mining...', waveTxn.hash)
      setIsMining(true)

      await waveTxn.wait().then(() => console.log('done')).catch((err) => {
        console.log(err)
        setError({ showError: true, error: `Easy partner, there's a 10 minute cooldown round these parts` })
      })
      console.log('Mined -- ', waveTxn.hash)
      setIsMining(false)
      // setHasGottenNewWaves(false)

      count = await waveportalContract.getTotalWaves()
      console.log('Retrieved total wave count...', count.toNumber())
    } else {
      setError({ showError: true, error: 'Dont forget to write a message!' })

    }

  }

  useEffect(() => {
    checkIfWalletIsConnected()
  })

  return (
    <>
      <ErrorView setError={setError} siteError={siteError} />
      <div className='main-container w-full h-screen overflow-scroll bg-brand-red flex items-center flex-col'>
        <div className='card-container bg-red-50 w-1/2 rounded-lg text-center flex flex-col justify-between mt-7'>
          <div className='header yesteryear text-brand-red-darkest text-8xl pt-8'>Wavr</div>
          <div className='bio px-12 pb-9 pt-6'>
            {`I'm Erik and I'm learning all the blockchain stuff and things.`}
            <br />
            {`Drop me a line and a wave here!`}
            <br />
            <br />
            {`There's a 1 in 10 chance you get a lil ETH in return for sending a message and a wave!`}
          </div>

          <div className='mb-6'>You'll need some <a href='https://faucet.rinkeby.io'>Rinkeby ETH</a></div>

          {!isMining ? (
            <>
              {currentAccount && (<div>
                <input
                  className=' border-8 border-brand-green w-full px-3 py-4 text-center'
                  type='text'
                  placeholder='Write a message here'
                  onChange={(input) => setMessage(input.target.value)}
                />
              </div>)}

              <button
                className='waveButton text-xl rounded-bl-lg rounded-br-lg py-6 font-bold bg-brand-green text-brand-pink'
                onClick={currentAccount ? wave : connectWallet}
              >
                {currentAccount ? 'Send a message' : 'Connect your wallet'}
              </button></>
          ) : (
            <div style={{ height: "148px" }} className='waveButton text-xl rounded-bl-lg rounded-br-lg py-6  bg-brand-green  flex items-center justify-around'>
              <Lottie
                loop
                animationData={loading}
                play
                direction={-1}
                style={{ width: 150, height: 120 }}
              />
              <div className="yesteryear text-brand-pink text-5xl ">Mining</div>
              <Lottie
                loop
                animationData={loading}
                play
                style={{ width: 150, height: 120 }}
              />
            </div>
          )}

        </div>
        {allWaves.length > 0 && (
          <div className='waves-container w-1/2 my-9 p-2 rounded-md bg-brand-pink flex flex-col-reverse'>
            {allWaves.map((wave, index) => {
              return (
                <>
                  {index !== 0 && (
                    <hr className="h-2 p-0 m-0" />
                  )}

                  <div className="bg-white p-5 flex flex-col" key={index}>
                    <div className="yesteryear text-3xl">{`"`}{wave.message}{`"`}</div>
                    <div>{'-'}{wave.address} </div>
                    <div className="text-xs">{' on '} {wave.timestamp.toString()}</div>
                  </div>

                </>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}

export default App
