import { FC } from "react"
import styles from "../styles/Home.module.css"
import Image from "next/image"
import dynamic from "next/dynamic";
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Image alt="logo" src="/solanaLogo.png" width={200} height={30} />
      <span>Token Program</span>
      <WalletMultiButtonDynamic />
    </div>
  )
}