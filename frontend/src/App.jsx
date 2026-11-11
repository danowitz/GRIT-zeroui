import "@fontsource/roboto";

import { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Theme from "./components/Theme";
import Bar from "./components/Bar";
import EmbeddedAccountMenu from "./components/EmbeddedAccountMenu";

import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Network from "./routes/Network/Network";
import Settings from "./routes/Settings";

import Loading from "./components/Loading";

import { isEmbedded } from "./utils/Embedded.mjs";

import "./i18n";

function App() {
  const embedded = isEmbedded();

  useEffect(() => {
    document.documentElement.classList.toggle("grit-embedded", embedded);
    return () => document.documentElement.classList.remove("grit-embedded");
  }, [embedded]);

  return (
    <Theme>
      <Suspense fallback={<Loading />}>
        <BrowserRouter basename="/app">
          {embedded ? <EmbeddedAccountMenu /> : <Bar />}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/network/:nwid" component={Network} />
            <Route path="/settings" component={Settings} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </Theme>
  );
}

export default App;
