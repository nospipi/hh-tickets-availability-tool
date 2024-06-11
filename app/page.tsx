import styles from "./page.module.css";
import NavBar from "./navbar/Navbar";
import Container from "./container/Container";

//------------------------------------------------------------------------

export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar />
      <Container />
    </main>
  );
}
