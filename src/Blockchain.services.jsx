import abi from './abis/src/contracts/IDecide.sol/IDecide.json'
import address from './abis/contractAddress.json'
import { getGlobalState, setGlobalState } from './store'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

const { ethereum } = window
const contractAddress = address.address
const contractAbi = abi.abi
let tx


const getEtheriumContract = () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)

    return contract
  } else {
    return getGlobalState('contract')
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWallectConnected()
      // window.location.reload()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const createPoll = async ({ title, image, startsAt, endsAt, description }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.createPoll(
      image,
      title,
      description,
      startsAt,
      endsAt,
      {
        from: connectedAccount,
      },
    )
    await tx.wait()
    await getPolls()
    toast.success('Poll created successfully 👌')
  } catch (error) {
    console.log(error)
    reportError(error)
  }
}

const updatePoll = async ({
  id,
  title,
  image,
  startsAt,
  endsAt,
  description,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.updatePoll(
      id,
      image,
      title,
      description,
      startsAt,
      endsAt,
      {
        from: connectedAccount,
      },
    )
    await tx.wait()
    await getPolls()
    toast.success('Poll updated successfully 👌')
  } catch (error) {
    reportError(error)
  }
}

const deletePoll = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.deletePoll(id, {
      from: connectedAccount,
    })
    await tx.wait()
    toast.success('Poll deleted successfully 👌')
  } catch (error) {
    reportError(error)
  }
}

const registerUser = async ({ fullname, image }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.register(image, fullname, { from: connectedAccount })
    await tx.wait()
    await getUser()
    toast.success('Registered successfully 👌')
  } catch (error) {
    reportError(error)
  }
}

const getUser = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    const user = await contract.users(connectedAccount)
    setGlobalState('user', user)
    toast.success('User retrieved successfully 👌')
  } catch (error) {
    reportError(error)
  }
}

const getPolls = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const polls = await contract.getPolls()
    setGlobalState('polls', structuredPolls(polls))
    toast.success('Polls retrieved successfully 👌',)
  } catch (error) {
    reportError(error)
  }
}

const getPoll = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const poll = await contract.getPoll(id)
    setGlobalState('poll', structuredPolls([poll])[0])
  } catch (error) {
    reportError(error)
  }
}

const contest = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.contest(id, { from: connectedAccount })
    await tx.wait()
    await getPoll(id)
    await listContestants(id)
    toast.success("Contested successfully 👌")
  } catch (error) {
    reportError(error)
  }
}

const vote = async (id, cid) => {
  {console.log(cid, 'heeelo')}
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    tx = await contract.vote(id, cid, { from: connectedAccount })
    await tx.wait()
    await getPoll(id)
    await listContestants(id)
    toast.success("Voted successfully 👌")
  } catch (error) {
    reportError(error)
  }
}

const listContestants = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const contestants = await contract.listContestants(id)
    
    setGlobalState('contestants', structuredContestants(contestants))
    setGlobalState('contestss', contestants)
  } catch (error) {
    window.alert(error.message)
    reportError(error)
  }
}

const structuredPolls = (polls) =>
  polls
    .map((poll) => ({
      id: Number(poll.id),
      title: poll.title,
      votes: Number(poll.votes),
      startsAt: Number(poll?.startsAt + '000'),
      endsAt: Number(poll?.endsAt + '000'),
      contestants: Number(poll.contestants),
      director: poll.director?.toLowerCase(),
      image: poll.image,
      deleted: poll.deleted,
      description: poll.description,
      timestamp: new Date(poll.timestamp.toNumber()).getTime(),
    }))
    .reverse()

const structuredContestants = (contestants) =>
  contestants
    .map((contestant, idx) => ({
      id: idx,
      fullname: contestant.fullname,
      image: contestant.image,
      voter: contestant.voter?.toLowerCase(),
      voters: contestant.voters.map((v) => v?.toLowerCase()),
      votes: Number(contestant.votes),
    }))
    .sort((a, b) => b.votes - a.votes)

const reportError = (error) => {
  const err = error.message.split('reason="')[1].split('",')[0]
    toast.error(`${err} 🤯`)
}

export {
  isWallectConnected,
  connectWallet,
  registerUser,
  getUser,
  createPoll,
  updatePoll,
  deletePoll,
  getPolls,
  getPoll,
  contest,
  listContestants,
  vote,
  reportError
}
