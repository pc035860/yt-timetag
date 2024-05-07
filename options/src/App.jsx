import { Router, Route, Switch, Redirect } from 'wouter';
import DataPage from './pages/Data';
import ExplorerPage from './pages/Explorer';
import AboutPage from './pages/About';
import Tabs from './components/Tabs';
import SetupTheme from './components/SetupTheme';

import { useHashLocation } from 'wouter/use-hash-location';

import './fontAwesome';

import './App.css';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'business',
  [SetupTheme.SCHEME.LIGHT]: 'corporate',
};

function App() {
  return (
    <Router hook={useHashLocation}>
      <>
        <SetupTheme config={THEME_CONFIG} />

        <Tabs />

        <Switch>
          <Route path="/explorer" component={ExplorerPage} />
          <Route path="/data" component={DataPage} />
          <Route path="/about" component={AboutPage} />
          <Redirect to="/data" />
        </Switch>
        {/* <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setCount(count => count + 1)}
          >
            count is {count}
          </button>
        </div>
        <div className="card">
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p> */}
      </>
    </Router>
  );
}

export default App;
