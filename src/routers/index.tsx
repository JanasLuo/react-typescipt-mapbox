import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import * as React from 'react'
import { Route, Router, Switch, Redirect } from 'react-router'
import Loadable from 'react-loadable'

import { LoadableLoading } from 'src/components/loading'

const browserHistory = createBrowserHistory()
const routerStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routerStore)

const LoadableMain = Loadable({
  loader: () => import('src/pages/main'),
  loading: LoadableLoading,
  delay: 300
})

const LoadableLogin = Loadable({
  loader: () => import('src/pages/login'),
  loading: LoadableLoading,
  delay: 300
})
const Home = Loadable({
  loader: () => import('src/pages/main/home'),
  loading: LoadableLoading,
  delay: 300
})

export default class AppRouter extends React.Component<{}, {}> {
  public render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/main" component={LoadableMain} />
          <Route path="/login" component={LoadableLogin} />
          <Route path="/home" component={Home} />
          <Redirect to="/main/home" />
        </Switch>
      </Router>
    )
  }
}

export { history }
