import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>辞書アプリ</h1>
      <p>Next.js と microCMS を使ったシンプルな辞書アプリです。</p>
      <Link href="/words">単語一覧を見る</Link>
    </div>
  );
}
