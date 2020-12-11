import {Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Login from './containers/Login/Login.jsx'
import Admin from './containers/Admin/Admin.jsx'

class App extends Component{
  render(){
    return (
      <div className="app">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
          <Redirect to="/login" component={Login}/>
        </Switch>
      </div>
    )
  }
}

export default App;
