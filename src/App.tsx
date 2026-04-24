import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Loading } from './components/Loading/Loading';
import { Toolbar } from './components/Toolbar/Toolbar';
import DeleteOldGames from './pages/DeleteOldGames/DeleteOldGames';
import { GamePage } from './pages/GamePage/GamePage';
import HomePage from './pages/HomePage/HomePage';
import JoinPage from './pages/JoinPage/JoinPage';


function App() {
  return (
    <div className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen overflow-hidden'>
      <Suspense
        fallback={
          <div className='text-center items-center justify-center flex'>
            <Loading />
          </div>
        }
      >
        <Router>
          <Toolbar />
          <Switch>
            <Route path='/game/:id' component={GamePage} />
            <Route path='/delete-old-games' component={DeleteOldGames} />
            <Route path='/join/:id' component={JoinPage} />
            <Route exact path='/*' component={HomePage} />
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
