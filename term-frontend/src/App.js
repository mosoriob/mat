import React, { Component } from 'react';
import './App.css';
import Terminal from './components/Terminal';
import Switch from 'react-switch';

class App extends Component{

  state = {
    checked:true
  }

  root = document.documentElement;

  handleModeChange = (e)=>{
    this.setState({
      checked:!this.state.checked
    },()=>{
      if(this.state.checked){
        this.root.style.setProperty('--bg-color','#1D1D1D');
      }else{
        this.root.style.setProperty('--bg-color','#fff');
      }
    });
  }

  render(){
    return (
      <div className="App">
          <Switch onChange={this.handleModeChange} checked={this.state.checked}/>
          <Terminal/>
      </div>
    );   
  }
}


export default App;
