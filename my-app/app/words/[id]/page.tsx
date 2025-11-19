import { client } from "../../../lib/client";
import styles from "../../../styles/Words.module.css";

export default async function WordDetail({ params }) {
  const data = await client.get({ endpoint: "words", contentId: params.id });

  return (
    <div className={styles.container}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
