import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import Footer from "./footer";

function Layout() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    const t = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Nav />
      <main
        className={`flex-1 transition-all duration-500 ease-smooth ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
