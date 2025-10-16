import NavBar from "./Navbar";
import Footer from "./Footer";
import Home from "../pages/Home"

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Home />
      <Footer />
    </>
  );
}
