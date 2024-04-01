import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useState } from "react";
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"

export const CreateTokenAccount: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [txSig, setTxSig] = useState('')
  const [tokenAccount, setTokenAccount] = useState('')

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  }
  async function onCreateTokenAccount(event: any) {
    event.preventDefault()
    if (!publicKey) {
      return
    }
    const transaction = new web3.Transaction()
    const mint = new web3.PublicKey(event.target.mint.value)
    const owner = new web3.PublicKey(event.target.owner.value)
    const associatedToken = await token.getAssociatedTokenAddress(
      mint,
      owner,
      false,
      token.TOKEN_PROGRAM_ID
    )
    transaction.add(
      token.createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        token.TOKEN_PROGRAM_ID,
        token.ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )
    sendTransaction(transaction, connection)
      .then((sig) => {
        setTxSig(sig)
        setTokenAccount(associatedToken.toString())
      })
  }
  return (
    <Box color="gray.400">
      {
        publicKey ?
          <form onSubmit={onCreateTokenAccount}>
            <FormControl isRequired>
              <FormLabel>Token Mint:</FormLabel>
              <Input
                id="mint"
                placeholder="Enter Token Mint address"
              />
            </FormControl>
            <FormControl my={4} isRequired>
              <FormLabel>Token Account Owner:</FormLabel>
              <Input
                id="owner"
                placeholder="Enter Token Account Owner PublicKey"
              />
            </FormControl>
            <Button type="submit">Create Token Account</Button>
          </form>
          : <span></span>
      }
      {
        txSig ? (
          <Box color="gray.400">
            <p>Token Account Address: {tokenAccount}</p>
            <p>View your transaction on</p>
            <a href={link()}>Solana Explorer</a>
          </Box>
        ) : null
      }
    </Box>
  )
}