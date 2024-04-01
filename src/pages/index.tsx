import { Inter } from "next/font/google";
import { AppBar } from "@/components/AppBar";
import styles from "../styles/Home.module.css"
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { Button, Center, VStack } from "@chakra-ui/react";
import { CreateMint } from "@/components/CreateMint";
import { CreateTokenAccount } from "@/components/CreateTokenAccount";
import { MintTokens } from "@/components/MintTokens";

export default function Home() {
  return (
    <div className={styles.App}>
      <AppBar />
      {/* <Center> */}
        <VStack spacing={4} minWidth="32rem">
          <BalanceDisplay />
          <CreateMint />
          <CreateTokenAccount/>
          <MintTokens />
        </VStack>
      {/* </Center> */}
    </div>
  );
}
