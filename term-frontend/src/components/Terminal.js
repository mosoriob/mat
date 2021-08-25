import React, { Component } from 'react'
import io from 'socket.io-client';
import {socket_url} from '../config';
import {XTerm} from 'xterm-for-react';
import './terminal.css';

const xtermRef = React.createRef(null);

class Terminal extends Component {

    state = {
        socket:null,
        input:''
    }

    componentDidMount(){
        const socket = io(socket_url);

        xtermRef.current.terminal.focus();

        socket.on('connect',()=>{
            console.log("Established connection with socket server");
            socket.emit('start-session');
        });

        socket.on('output',(data)=>{
            xtermRef.current.terminal.write(data);
        });

        this.setState({socket});
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.state.input!==nextState.input){
            return false
        }else{
            return true
        }
    }

    handleChange = (e)=>{       
        this.setState({input:this.state.input+e.key});
        switch(e.domEvent.keyCode){
            // Enter
            case 13:
                console.log(this.state.input)
                this.state.socket.emit('execute');
                this.setState({input:""});
                break;

            // Up arrow
            case 38:
                this.state.socket.emit('input','\u001b[A');
                break;

            // Down arrow
            case 40:
                this.state.socket.emit('input','\u001b[B');
                break;

            // Backspace
            case 8:
                this.state.socket.emit('backspace',this.state.input);
                break;

            // Ctrl+C
            case 67:
                if(e.domEvent.ctrlKey){
                    this.state.socket.emit('sigint');
                    this.setState({input:""});
                }else{
                    this.state.socket.emit('input',e.key);
                }
                break;

            default:
                this.state.socket.emit('input',e.key);

        }
    }

    render() {
        return (
            
            <div className="terminal-container">
                <div className="terminal-window">
                <header>
                    <div className="button green"></div>
                    <div className="button yellow"></div>
                    <div className="button red"></div>
                </header>
                <XTerm ref={xtermRef} onKey={this.handleChange} onData={this.handleDataChange}/>
                </div>
            </div>
        )
    }
}

export default Terminal;