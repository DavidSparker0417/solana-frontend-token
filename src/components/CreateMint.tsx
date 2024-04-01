import { Box, Button } from "@chakra-ui/react";
import { FC, useState } from "react";
import * as token from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js"

export const CreateMint: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [txSig, setTxSig] = useState('')
  const [mint, setMint] = useState('')

  function link() {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  }
  async function handleCreateMint() {
    if (!publicKey) {
      return
    }

    const mint = web3.Keypair.generate()
    const transaction = new web3.Transaction()
    const lamports = await token.getMinimumBalanceForRentExemptMint(connection)
    const programId = token.TOKEN_PROGRAM_ID
    transaction.add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: token.MINT_SIZE,
        lamports,
        programId
      }),
      token.createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        publicKey,
        token.TOKEN_PROGRAM_ID
      )
    )

    sendTransaction(transaction, connection, {
      signers: [mint]
    })
      .then((sig) => {
        setTxSig(sig)
        setMint(mint.publicKey.toString())
      })
  }
  return (
    <Box textColor="gray.400">
      {
        publicKey ? (
          <Button onClick={handleCreateMint}>
            Create Mint
          </Button>
        ) : (
          <span>Connect Your Wallet</span>
        )
      }
      {
        txSig ? (
          <Box>
            <p>Token Mint Address: {mint}</p>
            <p>View your transaction on</p>
            <a href={link()}>Solana Exporer</a>
          </Box>
        ) : null
      }
    </Box>
  )
}