import coin from "../assets/coin.svg";
import rocket from "../assets/shuttle.svg";
import slime from "../assets/splash.svg";

import "../css/key.css";

const Key = () => {
  return (
    <div className="Key__Window">
      <div className="Key__Title">
        <img alt="coin" src={coin}></img>
        <h2>RULES</h2>
        <img alt="coin" src={coin}></img>
      </div>
      <div className="Key__Instructions">
        <p>Be the first to fist to get to the box and win the coin !</p>
        <p>Be the first to collect 10 coins, to win</p>
        <p>Use the arrow keys on your keyboard</p>
        <p>or select the arrow keys at the bottom of the screen</p>
        <p>Be careful as not all the boxes contain coins</p>
        <p>Chat with other players using the messaging system</p>
      </div>
      <div className="Key__AllModifiersContainer">
        <div className="Key__EachModifer">
          <img alt="rocket" src={rocket}></img>
          <p>Finding a rocket in a box will speed you up</p>
        </div>
        <div className="Key__EachModifer">
          <img alt="slime" src={slime}></img>
          <p>Finding slime in a box will slow you down</p>
        </div>
      </div>
    </div>
  );
};

export default Key;
