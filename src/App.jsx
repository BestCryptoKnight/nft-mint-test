
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import { Landing } from "./views";
import TopBar from "./components/TopBar/TopBar.jsx";

import "./style.scss";


// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

function App() {
  return (
    <Router>
      <TopBar />
      <Switch>
        <Route exact path="/pools">
          <Landing />
        </Route>
        <Route exact path="/">
          <Redirect to="pools" />
        </Route>
      </Switch>

    </Router >
  );
}

export default App;
