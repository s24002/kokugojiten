import styles from "../Words.module.css";
import { client } from "../../../../lib/client";
import Link from "next/link";

export default async function WordDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await client.get({
    endpoint: "words",
    contentId: params.id,
  });

  return (
    <div className={styles.container}>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
      <Link href="/words">← 一覧に戻る</Link>
    </div>
  );
}
