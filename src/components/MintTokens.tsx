import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { FC, useState } from "react";
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const MintTokens: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [balance, setBalance] = useState("")
  const [txSig, setTxSig] = useState("")

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  }

  async function onMintTokens(event: any) {
    event.preventDefault()
    if (!connection || !publicKey) {
      return
    }

    const mint = new web3.PublicKey(event.target.mint.value)
    const recipient = new web3.PublicKey(event.target.recipient.value)
    const amount = event.target.amount.value

    const associatedToken = await token.getAssociatedTokenAddress(
      mint, 
      recipient, 
      false, 
      token.TOKEN_PROGRAM_ID, 
      token.ASSOCIATED_TOKEN_PROGRAM_ID
    )
    const transaction = new web3.Transaction()
    transaction.add(
      token.createMintToInstruction(
        mint, associatedToken, publicKey, amount
      )
    )
    const signature = await sendTransaction(transaction, connection)
    setTxSig(signature)
    await connection.confirmTransaction(signature, "confirmed")
    const account = await token.getAccount(connection, associatedToken)
    setBalance(account.amount.toString())
  }
  return (
    <Box color="gray.200" mt={4}>
      {
        publicKey ? (
          <form onSubmit={onMintTokens}>
            <FormControl isRequired>
              <FormLabel>Token Mint</FormLabel>
              <Input
                id="mint"
                placeholder="Enter Token Mint"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Recipient:</FormLabel>
              <Input
                id="recipient"
                placeholder="Enter Recipient PublicKey"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount Tokens to Mint:</FormLabel>
              <Input
                id="amount"
                placeholder="e.g. 100"
              />
            </FormControl>
            <Button mt={4} type="submit">Mint Tokens</Button>
          </form>
        ) : null
      }
      {
        txSig ? (
          <Box color="gray.400">
            <p>Token Balance: {balance}</p>
            <p>View your transaction on</p>
            <a href={link()}>Solana Explorer</a>
          </Box>
        ) : null
      }
    </Box>
  )
}