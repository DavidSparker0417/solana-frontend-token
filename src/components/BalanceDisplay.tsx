import { Box } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";

export const BalanceDisplay: FC = () => {
  const [balance, setBalance] = useState(0)
  const {connection} = useConnection()
  const {publicKey} = useWallet()

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(0)
      return
    }

    connection.getAccountInfo(publicKey)
      .then((accountInfo) => {
        setBalance(accountInfo ? accountInfo.lamports : 0)
      })
  }, [connection, publicKey])

  return (
    <Box color="gray.200" mt={4}>
      SOL Balance: {balance/LAMPORTS_PER_SOL}
    </Box>
  )
}