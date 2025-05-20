import Logo from "../assets/Logo2.png";

const phrases = [
  "Well, this is awkward... the page ghosted us.",
  "404: The page ran off to join the circus.",
  "Oops! Looks like the page took a wrong turn at Albuquerque.",
  "This page doesn't exist. But our mechanic is on it!",
  "Page not found. Probably in a witness protection program.",
  "Looks like someone forgot to install this page!",
  "You’ve hit a pothole in the internet highway.",
  "404 Error: Page is out grabbing coffee. Be back never.",
  "Well, this is embarrassing... it’s not you, it’s the page.",
  "This page took an early retirement."
];

const FourOfFour = () => {
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
    <center>
      <div style={{ textAlign: "center", padding: "2rem", height: '100vh' }} className="my-auto">
        <img
          src={Logo}
          alt="Logo"
          style={{
            marginBottom: "2rem",
            width: "100%",
            maxWidth: "720px",
            height: "auto"
          }}
        />
        <h1 style={{ fontSize: "5rem", color: "#02610a" }}><b>404 - Page Not Found</b></h1>
        <p style={{
          fontStyle: "italic",
          marginTop: "1rem",
          color: "#c0c0c0",
          fontSize: '2rem',
          paddingBottom: "1rem"
        }}>
          {randomPhrase}
        </p>
      </div>
    </center>
  );
};

export default FourOfFour;