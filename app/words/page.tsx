import { client } from "../../../lib/client";
import Link from "next/link";
import styles from "./Words.module.css";

export default async function WordsPage() {
  const data = await client.getList({ endpoint: "words" });

  return (
    <div className={styles.container}>
      <h1>単語一覧</h1>
      <ul>
        {data.contents.map((item) => (
          <li key={item.id}>
            <Link href={`/words/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
