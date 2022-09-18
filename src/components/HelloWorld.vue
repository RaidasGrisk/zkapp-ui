<script setup>
import { ref, onMounted } from 'vue'
import { useLoadingBar, useMessage, useNotification } from 'naive-ui'

import { SimpleZkapp_ } from "/home/raidas/Desktop/zkapp-snarkyjs-new";

import {
  Field,
  PrivateKey,
  PublicKey,
  Mina,
  isReady,
  shutdown,
  fetchAccount,
  setGraphqlEndpoint,
} from 'snarkyjs';

// ui - components
const loadingBar = useLoadingBar()
const message = useMessage()
const notification = useNotification()
const loadingSnarkyJs = ref(true)

// zk-app
const zkappState = ref('')
const zkApp = ref({})
const transaction = ref({})
const equationAnswer = ref()

// keys
const publicKey_ = ref('')
const privateKey_ = ref('')

// redeployed contract address:
// B62qoD7GZfMURQSpEF98HBTCuuchzgiw43dNsZXanMg8w6AYKLCuVfc
// EKFQuwPXne8GdobsevcvJS5LoPmvVv2xdHthgDa2N1EU5yEaJkUn

// other funded test accounts
// B62qqBAUo5smz1whfdRjniFUnPv1V4Z1Y2VFPv16Zp1Z4497wmXmBgR
// EKEGgnxvJZCAdoWWVpP2xdXpEMnYcbiWs7Z3sma3xSfnyY2tzt4C

// B62qrr2RZSaDtPDcifbbczkugvCBptRRACeFhL4M1sYbZWt66NU1hy3
// EKE6we4DHzjpq6q2bK5rNyq9DQ5ZHP4bA23T8bPZCBvzxGxYc7Fo
//
// B62qoQKcwPWbYPbuM5wRN9kGQXxgXGuHadL694tbw9ZoYctExz7cepW
// EKEjSbJVEx4qPjHJzEd1HSGLQeGCA51SLU473ECvWppnhuhEh3c7
//
// B62qp41xP6LQvwoyk3wjVEXoUBvkRm5wTDoZbeAooWNYzA5U5Wt2t2e
// EKF8gg8dkhH6Dj7XAs3FCBX6BFBaffjAWqFRPCjpE29GdBuggDrQ
//
// B62qqkRPb1njwuwQ9VMJV39enASmkB3BvQDfpakhKryY4sGAMtzoqY5
// EKFHoANnDUaMCMc9gLqte5cgjE4WEgWsUFLMSH2yYQYL7FG8gdb5

const generateKeys = () => {
  const privateKey__ = PrivateKey.random();
  privateKey_.value = privateKey__.toBase58();
  publicKey_.value = privateKey__.toPublicKey().toBase58();
}

// this is the steps vals
const stepsStatus = ref({
  currentStatus: 'process',
  current: 1
})
// const currentStatus = ref("process")
// const current = ref(1)

// some other vars
const zkAppAddress = 'B62qoD7GZfMURQSpEF98HBTCuuchzgiw43dNsZXanMg8w6AYKLCuVfc'
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
  await sleep(1500)
  await isReady;
  loadingSnarkyJs.value = false
})

const connectToNetwork = async (zkAppAddress) => {

  loadingBar.start()
  await sleep(200)
  steps.value[1].isLoading = true

  // create Berkeley connection
  console.log('Connect to mina berkeley');
  const graphqlEndpoint = 'https://proxy.berkeley.minaexplorer.com/graphql';
  setGraphqlEndpoint(graphqlEndpoint);
  let Berkeley = Mina.BerkeleyQANet(graphqlEndpoint);
  Mina.setActiveInstance(Berkeley);
  console.log('done')
  message.success("connected to Berkeley")

  steps.value[1].isLoading = false
  steps.value[1].isFinished = true
  stepsStatus.value.current = 2
  loadingBar.finish()
}

const fetchYourAccountFromNetwork = async () => {

  loadingBar.start()
  steps.value[2].isLoading = true

  if (!publicKey_.value) {
    message.warning('Generate or input a key pair!')
    loadingBar.error()
    steps.value[2].isLoading = false
    return
  } else {
    console.log('try fetch an account', publicKey_.value);
    let { account, error } = await fetchAccount(
      { publicKey: PublicKey.fromBase58(publicKey_.value) }
    );
    console.log('account', account);
    console.log('error', JSON.stringify(error, null, 2));
    if (account) {
      message.success(`balance: ${account.balance}`)
    } else {
      message.warning('account balance is empty?')
      loadingBar.error()
      steps.value[2].isLoading = false
      return
    }
  }

  steps.value[2].isLoading = false
  steps.value[2].isFinished = true
  stepsStatus.value.current = 3
  loadingBar.finish()

}

const compileZkApp = async (zkAppAddress) => {

  loadingBar.start()
  steps.value[3].isLoading = true
  await sleep(500)

  message.warning(
    `This will take a while. Arm yourself with patience. The browser might not respond for a while...`,
  )

  const n = notification.create({
    title: 'Why compile?',
    content: `Usually smart contracts sit on chain and we can trigger a method by sending a transaction. Then a node will run the method of the smart contract.
    \nBut thats not what we're going to do. Instead, we fetch the smart contract and compile it locally so that we can run it in our local environment (the browser). The network nodes will not run it for us.`,
  })

  // compile the zkapp
  console.log('before compiling')
  await sleep(1500)
  console.log('Compiling smart contract...', zkAppAddress);
  await SimpleZkapp_.compile();
  console.log(SimpleZkapp_)
  console.log('done')

  steps.value[3].isLoading = false
  steps.value[3].isFinished = true
  stepsStatus.value.current = 4
  loadingBar.finish()

}

const getZkAppState = async (zkappAddress) => {
  console.log('PUBLICKEY: ', zkAppAddress, PublicKey.fromBase58(zkAppAddress))
  let { account, error } = await fetchAccount({ publicKey: PublicKey.fromBase58(zkAppAddress)});
  console.log('account', JSON.stringify(account, null, 2));
  console.log('error', JSON.stringify(error, null, 2));

  // create the zkapp object
  zkApp.value = new SimpleZkapp_(PublicKey.fromBase58(zkAppAddress));
  console.log(zkApp.value);
  console.log('done');

  console.log(zkApp.value)
  let value = zkApp.value.value.get();
  zkappState.value = value
  console.log(`Found deployed zkapp, with state ${value.toBase58()}`);
}

const createTransaction = async () => {
  console.log('creating transaction')
  let feePayerKey = PrivateKey.fromBase58(privateKey_.value);
  transaction.value = await Mina.transaction(
    { feePayerKey, fee: "300_000_000" },
    () => {
      zkApp.value.giveAnswer(
        Field(equationAnswer.value),
        PublicKey.fromBase58(publicKey_.value)
      );
    }
  );
  // message.success(`Transaction hash: ${transaction.value.sendZkapp.zkapp.hash}`)
  console.log(transaction.value)
  console.log(zkApp.value)
  console.log(transaction.value.toGraphqlQuery());
  message.success('You have got the correct answer to the equation and ...', { duration: 5000 })
  message.success('You have successfully created a trasaction. But we have not sent it yet! Before doing that, we have to generate a proof.', { duration: 5000 })
}

const createProofAndSend = async () => {
  // fill in the proof - this can take a while...
  console.log('Creating an execution proof... this will take a while.');
  const n = notification.create({
    title: 'Why do we need a proof?',
    content: `A generated proof is a long string containing a cryptographic proof, that you did run this zkApp method in your browser.\n\nYou will send a transaction that will modify an on-chain value only if you know the correct answer to the equation and have the proof you ran this exact zkApp method.`,
  })

  console.log('before proof')
  console.log(transaction.value)
  console.log(transaction.value.toGraphqlQuery())
  console.log(transaction.value.toJSON())

  await transaction.value.prove();

  console.log('after proof')
  console.log(transaction.value.transaction.accountUpdates[0].authorization.proof)
  // console.log(transaction.value.toGraphqlQuery())
  // console.log(transaction.value.toJSON())

  // send the transaction to the graphql endpoint
  console.log('Sending the transaction...');
  let sendZkapp = await transaction.value.send();
  let txHash = await sendZkapp.hash()
  console.log(txHash)
  message.success(`Transaction hash: ${txHash}`)
  message.success('Transaction send')

  await shutdown();

}


</script>

<template>
  <div style="padding: 2px; max-width: 580px;">
    <n-modal v-model:show="loadingSnarkyJs">
      <n-card style="max-width: 150px;">
        <n-space vertical style="text-align: center;">
          Loading snarkyJs
          <n-spin size="large" />
        </n-space>
      </n-card>
    </n-modal>

    <n-space vertical>
      <n-h2>Before we begin, make sure you have an account with some mina in it</n-h2>
      <n-button @click="generateKeys()" :disabled="publicKey_ ? true : false">Generate key pair</n-button>
      <n-input-group>
        <n-input-group-label>public key</n-input-group-label>
        <n-input v-model:value="publicKey_"/>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>private key</n-input-group-label>
        <n-input v-model:value="privateKey_"/>
      </n-input-group>
      <n-text>
        Now use the faucet to fund the account.
        Before moving forward make sure the account already has some mina in it.
      </n-text>
    </n-space>
    <br><br>
      <n-divider />
    <br><br>
  <n-space vertical>
    <n-h2>Here is what we are going to do:</n-h2>
    <n-steps vertical :current="stepsStatus.current" :status="stepsStatus.currentStatus">
      <n-step title="Establish blockchain connection">
        <n-space vertical>
          <!-- <n-tag type="warning" size="small" round :bordered="false">remote</n-tag> -->
          <n-button @click="connectToNetwork()" :loading="steps[1].isLoading" >connect</n-button>
        </n-space>
      </n-step>
      <n-step title="Check if your account has enough funds">
        <n-space vertical>
          Check out the smart contract here.
          <n-button @click="fetchYourAccountFromNetwork()" :loading="steps[2].isLoading">Check</n-button>
        </n-space>
      </n-step>
      <n-step title="Compile the zkapp" >
        <n-space vertical>
          <!-- <n-tag type="warning" size="small" round :bordered="false">local</n-tag> -->
          <n-button @click="compileZkApp(zkAppAddress)" :loading="steps[3].isLoading">compile</n-button>
        </n-space>
      </n-step>
      <n-step title="Fetch the current zkApp state from chain">
        <n-space vertical>
        <!-- <n-tag type="warning" size="small" round :bordered="false">remote</n-tag> -->
        The state is a single variable.
        It is an on-chain value showing the public address of the last account
        that correctly solved the puzzle and sent over the generated proof.
        <n-button @click="getZkAppState(zkappAddress)" :loading="steps[4].isLoading">getZkAppState</n-button>
        <n-tag :size="'large'" style="padding: 30px;" :bordered="false">
          <div v-if="steps[4].isLoading">
            <n-spin size="large" />
          </div>
          <div else>
            <n-text depth="3">
              {{ zkappState ? zkappState : '-' }}
            </n-text>
          </div>
        </n-tag>
        You will update this state if you solve the equation below.
      </n-space>
      </n-step>
      <n-step title="Call the zkApp method">
        <n-space>
          <!-- <n-tag type="warning" size="small" round :bordered="false">local</n-tag> -->
          <div>
            Input your answer and run the smart contract method <b>locally in the browser</b>.
            Check the method source code here.
          </div>
          <n-input placeholder="10 / 2 + 2 = ?" v-model:value="equationAnswer"></n-input>
          <n-button @click="createTransaction()" :loading="steps[5].isLoading" >call the method</n-button>
        </n-space>
      </n-step>
      <n-step title="Create the zk proof and broadcast it">
        <n-button @click="createProofAndSend()" :loading="steps[6].isLoading" >createProofAndSend</n-button>
      </n-step>
    </n-steps>
  </n-space>

  <br>
  <br>
  {{ steps }}
  <br><br>
  <!-- {{ transaction ? transaction : false }} -->
  <!-- {{ transaction ? transaction.toGraphqlQuery() : false }} -->
  <n-space vertical>




  </n-space>
</div>
</template>

<style scoped>

</style>
