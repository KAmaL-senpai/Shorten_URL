import { useState } from "react";
import styles from "./App.module.css";
import axios from "axios";

function App() {
  const [short, setShort] = useState(false);
  const [inp, setInp] = useState("");
  const [errInp, setErrInp] = useState("");
  const [ans, setAns] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  let handleShorten = async (inp) => {
    if (inp.length < 10) {
      setErrInp("Enter a link of atleast 10 characters");
      return;
    }
    if (!/^https?:\/\//.test(inp)) {
      setErrInp("URL must start with http:// or https://");
      return;
    }
    // Check if it's a valid URL
    try {
      new URL(inp); // this will throw an error if the URL is invalid
    } catch {
      setErrInp("Invalid URL format");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/shorten",
        {
          url: inp,
        }
      );

      setAns(res.data.shortUrl);
      setOriginalUrl(inp);
      setShort(true);
      setErrInp("");
      setInp("");
    } catch (error) {
      setErrInp("Invalid link");
      console.error(error);
    }
  };

  return (
    <div className={styles.main}>
      <img src="https://m.media-amazon.com/images/I/81-wJ1F3afL.jpg" alt="" />
      <div className={styles.searchBox}>
        <p>Paste the URL to Shorten:</p>
        <input
          type="text"
          value={inp}
          onChange={(e) => setInp(e.target.value)}
        />
        <p style={{ fontSize: "1rem", color: "red" }}>{errInp}</p>
        <button onClick={() => handleShorten(inp)}>Search</button>
        <br />
        {short && (
          <div className={styles.result}>
            <p>
              <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                {ans.replace("/shorten-url-h3xy.onrender.com/", "")}
              </a>
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ans);
                alert("Short URL copied to clipboard!");
              }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
