import React from "react";
import GithubMarkUrl from "../assets/github-mark.svg";

const BottomBar: React.FC = () => {
  return (
    <footer>
      <div className="row" style={{ justifyContent: "right", padding: "10px" }}>
        <a
          href="https://github.com/Slowki/game-master"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            style={{ height: "2rem" }}
            src={GithubMarkUrl}
            alt="Github Link"
          />
        </a>
      </div>
    </footer>
  );
};

export default BottomBar;
