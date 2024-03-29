<script setup>
import { ref, onMounted } from 'vue'
import { useLoadingBar, useMessage, useNotification, NIcon } from 'naive-ui'

import { SimpleZkapp } from './zkApp/zkapp.js';

import {
  Field,
  PrivateKey,
  PublicKey,
  Mina,
  fetchAccount,
} from 'o1js';

// ui - components
const loadingBar = useLoadingBar()
const message = useMessage()
const notification = useNotification()
const loadingO1js = ref(true)

// zk-app
const zkappState = ref('')
const zkApp = ref({})
const transaction = ref({})
const equationAnswer = ref()

// keys
const publicKey_ = ref('')
const privateKey_ = ref('')

// prefunded accounts [ public / private ]
const prefundedAccounts = [
  [
    'B62qonTvKWLXDEzr4sLuyE9NgkzNN8XivSUYKryckyYdSrEJREwVmX7',
    'EKFA4EGPvvK1TpPrjMJPpWKR1U24UQLuqxPpiXM7fJbTfLiyXutZ'
  ],
  [
    'B62qp1jy6CmFevfJJnqP4yiEDiSmEXYYQ5FckHUeMCtnEupWZAvU9qG',
    'EKFA8GDQUcd8MzggFWMLrKTUxgFKTkFZmyUatQukP1mn3LJxD6Aw'
  ],
  [
    'B62qixjXfKP3N9KXEhnSQ9hHEmBwjEjjgnryFmSHJBK2KBodvGdQh2A',
    'EKEHncSQMWugRfpbLYyHVDUdRc86XEkC1EbKfWH6YrXpcRftxecx'
  ],
  [
    'B62qmqGq3EmzYXfSifJRRkbRfx6RHuiDw3fCgCXygg3xKASAi431RP2',
    'EKF2PVhdFTUtdJTQ1XWUw4ccncM3U2PuEyLyPDcNHLJEqY5fQCXr'
  ],
  [
    'B62qiziFbwu65PWMYgx1rvDLqxSau9fMsvpq6FuhgEUBCoBQQYNmVGK',
    'EKFHAMkPPU3WLqHRvzf4Ri1smXuk3ydKA8jSyyukKJbbPe1cCjba'
  ],
]


const generateNewKeys = () => {
  const privateKey__ = PrivateKey.random();
  privateKey_.value = privateKey__.toBase58();
  publicKey_.value = privateKey__.toPublicKey().toBase58();
}

const generatePrefundedKeys = () => {
  let keyPair = prefundedAccounts[Math.floor(Math.random()*prefundedAccounts.length)];
  privateKey_.value = keyPair[1]
  publicKey_.value = keyPair[0]
}

// this is the steps vals
const stepsStatus = ref({
  currentStatus: 'process',
  current: 1
})
// const currentStatus = ref("process")
// const current = ref(1)

// some other vars
// redeployed contract address:
const zkAppAddress = 'B62qrxp6zwJAYiQQqAi88izJ1KmVfGjra3HUwsZFoC9ptPZ6UVYdd7o'
const steps = ref({
  1: {
    'isFinished': false,
    'isLoading': false,
  },
  2: {
    'isFinished': false,
    'isLoading': false,
  },
  3: {
    'isFinished': false,
    'isLoading': false,
  },
  4: {
    'isFinished': false,
    'isLoading': false,
  },
  5: {
    'isFinished': false,
    'isLoading': false,
  },
  6: {
    'isFinished': false,
    'isLoading': false,
  },
})

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
  let msg = message.create('Loading', { type: 'success', duration: 10000 })
  await sleep(1500)
  loadingO1js.value = false

  // create Berkeley connection
  const graphqlEndpoint = 'https://proxy.berkeley.minaexplorer.com/graphql';
  const Network = Mina.Network(graphqlEndpoint);
  const fee = Number(0.1) * 1e9; // in nanomina (1 billion = 1.0 mina)
  Mina.setActiveInstance(Network);
  msg.content = 'Ready to interact with berkeley!'

})

const checkAccountBalance = async () => {

  loadingBar.start()
  steps.value[1].isLoading = true

  if (!publicKey_.value) {
    message.warning('Generate or input a key pair!')
    loadingBar.error()
    steps.value[1].isLoading = false
    return
  } else {
    console.log('try fetch an account', publicKey_.value);
    let { account, error } = await fetchAccount(
      { publicKey: PublicKey.fromBase58(publicKey_.value) }
    );
    console.log('account', account);
    console.log('error', JSON.stringify(error, null, 2));
    if (account) {
      message.success(`Account balance: ${account.balance}`)
    } else {
      message.warning('account balance is empty?')
      loadingBar.error()
      steps.value[1].isLoading = false
      return
    }
  }

  steps.value[1].isLoading = false
  steps.value[1].isFinished = true
  stepsStatus.value.current = 2
  loadingBar.finish()

}

const getZkAppState = async (zkappAddress) => {

  loadingBar.start()
  steps.value[2].isLoading = true

  let { account, error } = await fetchAccount({ publicKey: PublicKey.fromBase58(zkAppAddress) });
  console.log('account', JSON.stringify(account, null, 2));
  console.log('error', JSON.stringify(error, null, 2));

  if (error) {
    steps.value[2].isLoading = false
    steps.value[2].isFinished = true
    stepsStatus.value.current = 1
    loadingBar.error()
    return
  }

  // create the zkapp object
  try {
    let zkApp = new SimpleZkapp(PublicKey.fromBase58(zkAppAddress));
    let value = zkApp.value.get();
    zkappState.value = value.toBase58();
    console.log(`Found deployed zkapp, with state ${value.toBase58()}`);
  } catch (error) {
    console.log(error)
    steps.value[2].isLoading = false
    steps.value[2].isFinished = true
    stepsStatus.value.current = 2
    loadingBar.error()
    return
  }

  steps.value[2].isLoading = false
  steps.value[2].isFinished = true
  stepsStatus.value.current = 3
  loadingBar.finish()
}

const compileZkApp = async () => {

  loadingBar.start()
  steps.value[3].isLoading = true
  await sleep(500)

  message.warning(
    `This will take a while. Arm yourself with patience. The browser might not respond for a while...`,
  )

  const n = notification.create({
    title: 'Why compile?',
    content: `Typically, smart contracts reside on the blockchain, and you invoke their functions by sending transactions. The network's nodes then execute these functions for you.
    \nHowever, in the case of Mina, we take a different approach. Instead of relying on the network to execute our smart contract, we fetch the contract, compile it and run locally. This means we can run it in our own local environment, like a web browser, without requiring the network nodes to handle the execution.`,
  })

  // compile the zkapp
  console.log('before compiling')
  await sleep(1500)
  console.log('Compiling zk program...');
  console.log(SimpleZkapp)
  const { verificationKey } = await SimpleZkapp.compile();
  console.log('Verification key: ', verificationKey)

  steps.value[3].isLoading = false
  steps.value[3].isFinished = true
  stepsStatus.value.current = 4
  loadingBar.finish()

}

const createTransaction = async (zkAppAddress) => {

  loadingBar.start()
  steps.value[4].isLoading = true

  try {
    // unfortunately, have to create the object once again, because ref does not work.
    let feePayerKey = PrivateKey.fromBase58(privateKey_.value);
    let feepayerAddress = feePayerKey.toPublicKey();
    let zkApp = new SimpleZkapp(PublicKey.fromBase58(zkAppAddress));
    let fee = Number(0.1) * 1e9;

    transaction.value = await Mina.transaction(
      { sender: feepayerAddress, fee }, () => {
        zkApp.giveAnswer(Field(equationAnswer.value), feepayerAddress);
      }
    );
    message.success('You have got the correct answer to the equation and ...', { duration: 10000 })
    message.success('You have successfully generated a transaction. \nBut we have not sent it yet! Before doing that, we have to generate a proof.', { duration: 10000 })

  } catch (error) {
    message.error('Error', { duration: 10000 })
    console.log(error)
    steps.value[4].isLoading = false
    steps.value[4].isFinished = true
    stepsStatus.value.current = 4
    loadingBar.error()
    return
  }

  steps.value[4].isLoading = false
  steps.value[4].isFinished = true
  stepsStatus.value.current = 5
  loadingBar.finish()

}

const createProof = async () => {

  message.warning("This will take a while. Arm yourself with patience. The browser might not respond for a while...")
  loadingBar.start()
  steps.value[5].isLoading = true

  notification.create({
    title: 'Why do we need a proof?',
    content: `A generated proof is a long string containing a cryptographic confirmation that you indeed executed this zkApp method in your browser.
    \nYou will send a transaction that will modify an on-chain value only if you possess both the answer to the equation and the proof of the zkApp method execution.`,
  })

  await sleep(500)

  try {
    await transaction.value.prove();
    console.log('Full proof: ', transaction.value.transaction.accountUpdates[0].authorization.proof)
  } catch (error) {
    console.log(error)
    steps.value[5].isLoading = false
    steps.value[5].isFinished = true
    stepsStatus.value.current = 5
    loadingBar.error()
    return
  }

  notification.create({
    title: 'Congratulations, you have successfully produced the proof!',
    content: 'Here is how it looks like: \n\n' + transaction.value.transaction.accountUpdates[0].authorization.proof.slice(0, 150) + ' ...'
  })

  steps.value[5].isLoading = false
  steps.value[5].isFinished = true
  stepsStatus.value.current = 6
  loadingBar.finish()

}

const broadcastTransaction = async () => {

  loadingBar.start()
  steps.value[6].isLoading = true

  // send the transaction to the graphql endpoint
  console.log('Sending the transaction...');
  try {
    let feePayerKey = PrivateKey.fromBase58(privateKey_.value);
    let sendZkapp = await transaction.value.sign([feePayerKey]).send();
    console.log(sendZkapp)
    let txHash = await sendZkapp.hash()
    console.log(txHash)
    message.success('Transaction send. The state of the smart contract will be updated after transaction is included into the next block!', { duration: 10000 })
    notification.create({
      title: 'Follow your transaction in blockexplorer',
      content: 'Transaction hash: ' + txHash + '\n\n' + 'https://berkeley.minaexplorer.com/'
    })
  } catch (error) {
    steps.value[6].isLoading = false
    steps.value[6].isFinished = true
    stepsStatus.value.current = 6
    loadingBar.error()
    return
  }

  steps.value[6].isLoading = false
  steps.value[6].isFinished = true
  stepsStatus.value.current = 6
  loadingBar.finish()
}


</script>

<template>
  <div style="padding: 2px; max-width: 580px;">
    <n-modal v-model:show="loadingO1js">
      <n-card style="max-width: 150px;">
        <n-space vertical style="text-align: center;">
          Loading o1js
          <n-spin size="large" />
        </n-space>
      </n-card>
    </n-modal>

    <n-space vertical>
      <n-h2>Before we start, make sure you have an account with some Mina in it</n-h2>
      <n-button @click="generateNewKeys()">Generate new key pair (will have to fund via faucet)</n-button>
      <n-button @click="generatePrefundedKeys()">Randomly pick keys from one of prefunded accounts</n-button>
      <n-input-group>
        <n-input-group-label>public key</n-input-group-label>
        <n-input v-model:value="publicKey_"/>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>private key</n-input-group-label>
        <n-input v-model:value="privateKey_"/>
      </n-input-group>
      <!-- <n-text>
        Before moving forward make sure the account already has some mina in it.
        <a href="https://berkeley.minaexplorer.com/faucet">Faucet link</a>.
      </n-text> -->
    </n-space>
    <br><br>
      <n-divider />
    <br><br>
  <n-space vertical>
    <n-h2>Follow the steps to prove you know the answer and store it on-chain:</n-h2>
    <n-steps vertical :current="stepsStatus.current" :status="stepsStatus.currentStatus">
      <n-step title="Check if selected account has enough funds">
        <n-space vertical>
          <n-button @click="checkAccountBalance()" :loading="steps[1].isLoading">Check</n-button>
        </n-space>
      </n-step>
      <n-step title="Check the smart contract state on-chain">
        <n-space vertical>
        <!-- <n-tag type="warning" size="small" round :bordered="false">remote</n-tag> -->
        The state consists of a single variable holding the public address of the
        most recent account that successfully solved the equation and submitted the generated proof.
                <n-button @click="getZkAppState(zkappAddress)" :loading="steps[2].isLoading">Check</n-button>
        <n-tag :size="'large'" style="padding: 30px; borderRadius: 7px;" :bordered="false">
          <div v-if="steps[2].isLoading">
            <n-spin size="small" />
          </div>
          <div else>
            <n-text depth="3">
              {{ zkappState ? zkappState : '' }}
            </n-text>
          </div>
        </n-tag>
        You will update this state if you solve the equation below.
      </n-space>
      </n-step>
      <n-step title="Compile the smart contract we will interact with">
        <n-space vertical>
          <div>Check out the smart contract <a href="https://github.com/RaidasGrisk/zkapp-snarkyjs/blob/main/src/zkapp.ts">here</a>.</div>
          <!-- <n-tag type="warning" size="small" round :bordered="false">local</n-tag> -->
          <n-button @click="compileZkApp()" :loading="steps[3].isLoading">compile</n-button>
        </n-space>
      </n-step>
      <n-step title="Call the smart contract method">
        <n-space>
          <!-- <n-tag type="warning" size="small" round :bordered="false">local</n-tag> -->
          <div>
            Input your answer and run the smart contract method <b>locally in the browser</b>.
          </div>
          <n-input placeholder="10 / 2 + 2 = ?" v-model:value="equationAnswer"></n-input>
          <n-button @click="createTransaction(zkAppAddress)" :loading="steps[4].isLoading" >Call</n-button>
        </n-space>
      </n-step>
      <n-step title="Create the zero knowledge proof">
        <n-space vertical>
          The proof will confirm, that all the things that happened in your browser while interacting with the smart contract are legit.
          <n-button @click="createProof()" :loading="steps[5].isLoading" >Create</n-button>
        </n-space>
      </n-step>
      <n-step title="Broadcast the transaction to the network">
        <n-button @click="broadcastTransaction()" :loading="steps[6].isLoading" >Broadcast</n-button>
      </n-step>
    </n-steps>
  </n-space>
  <br><br>
</div>
</template>

<style scoped>

</style>
