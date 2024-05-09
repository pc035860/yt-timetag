import { Router, Route, Switch, Redirect } from 'wouter';
import DataPage from './pages/Data';
import ExplorerPage from './pages/Explorer';
import AboutPage from './pages/About';
import Tabs from './components/Tabs';
import SetupTheme from './components/SetupTheme';

import { useHashLocation } from 'wouter/use-hash-location';
import { t } from './utils/i18n';

import './fontAwesome';

import './App.css';
import { useLayoutEffect } from 'react';

const THEME_CONFIG = {
  [SetupTheme.SCHEME.DARK]: 'dim',
  [SetupTheme.SCHEME.LIGHT]: 'pastel',
};

function App() {
  useLayoutEffect(() => {
    document.title = `${t('extName')}`;
  }, []);

  return (
    <Router hook={useHashLocation}>
      <>
        <SetupTheme config={THEME_CONFIG} />

        <Switch>
          <Route path="/explorer">
            <div className="container mx-auto">
              <Tabs className="max-w-[400px] mt-8 relative z-10" />
            </div>
          </Route>
          <Route>
            <Tabs className="mx-auto max-w-[400px] mt-8 relative z-10" />
          </Route>
        </Switch>

        <Switch>
          <Route path="/explorer" component={ExplorerPage} />
          <Route path="/data" component={DataPage} />
          <Route path="/about" component={AboutPage} />
          <Redirect to="/explorer" />
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
