/* ================ */
/*   Break Control  */
/* ================ */

class BreakControl extends React.Component {
  render() {
    return (
      <div id="break-control">
        <h2 id="break-label">Break Length</h2>
        <button 
          id="break-increment"
          onClick={this.props.increment}
          ><i class="fas fa-caret-up"></i>
        </button>
        
        <h2 id="break-length">{this.props.length}</h2>

        <button 
          id="break-decrement"
          onClick={this.props.decrement}
          ><i class="fas fa-caret-down"></i>
        </button>
      </div>
    )
  }
}

/* ================== */
/*   Session Control  */
/* ================== */

class SessionControl extends React.Component {
  render() {
    return(
      <div id="session-control">
        <h2 id="session-label">Session Length</h2>
        <button 
          id="session-increment"
          onClick={this.props.increment}
          ><i class="fas fa-caret-up"></i>
        </button>
        
        <h2 id="session-length">{this.props.length}</h2>

        <button 
          id="session-decrement"
          onClick={this.props.decrement}
          ><i class="fas fa-caret-down"></i>
        </button>
      </div>
    )
  }
}

/* =================== */
/*   Countdown Timer   */
/* =================== */

class Timer extends React.Component {

  render() {
    console.log(this.state);
    return(
      <div id="timer">
        <h2 id="timer-label">Session</h2>
        <div id="time-left">{this.props.minutes}:{this.props.seconds}</div>
      </div>
    )
  }
}

/* =================== */
/*    Timer Control    */
/* =================== */

class TimerControl extends React.Component {
  render() {
    return(
      <div id="timer-control">
        <button 
          id="start_stop"
          onClick={this.props.toggle}
          >start/stop</button>
        <button 
          id="reset"
          onClick={this.props.reset}
          >reset
        </button>
      </div>
    )
  }
}

/* ================ */
/* Main application */
/* ================ */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      secondsRemaining: 1500,
      minutesDisplay: "25",
      secondsDisplay: "00",
      running: false
    }
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.reset = this.reset.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.toggleRun = this.toggleRun.bind(this);
    
    // Declare interval so it can be stopped
    this.countdown = 0;
  }
  
  /* HANDLE INCREMENT/DECREMENT */
  breakDecrement(){
    if(this.state.breakLength > 1) {
      this.setState((prevState, props) => ({
        breakLength: prevState.breakLength - 1
      }));
    }
  }
  breakIncrement() {
    if(this.state.breakLength < 60){
      this.setState((prevState, props) => ({
        breakLength: prevState.breakLength + 1
      }));
    }
  }
  sessionDecrement() {
    if(this.state.sessionLength > 1){
      this.setState((prevState, props) => ({
        sessionLength: prevState.sessionLength - 1,
        minutesDisplay: prevState.minutesDisplay - 1,
        secondsRemaining: prevState.secondsRemaining - 60
      }));
    }
  }
  sessionIncrement(){
    if(this.state.sessionLength < 60){
      this.setState((prevState, props) => ({
        sessionLength: prevState.sessionLength + 1,
        minutesDisplay: prevState.minutesDisplay + 1,
        secondsRemaining: prevState.secondsRemaining + 60
      }));
    }
  }
  
  reset(){
    running = false; // debug
    this.stop();
    
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      secondsRemaining: 1500,
      minutesDisplay: "25",
      secondsDisplay: "00",
      running: false
    });
  }
  
  toggleRun(){
    if(this.state.running){
      this.stop();
    } else {
      this.run();
    }
  }
  
  run() {
    this.countdown = setInterval( () => {
      if(this.state.secondsRemaining >= 0){
        var minutesRaw = Math.floor(this.state.secondsRemaining / 60);
        var secondsRaw = Math.floor(this.state.secondsRemaining % 60);
        var seconds = String(secondsRaw).padStart(2,0);
        var minutes = String(minutesRaw).padStart(2,0);
        
        this.setState((prevState, props) => ({
          running: true,
          secondsRemaining: prevState.secondsRemaining - 1,
          minutesDisplay: minutes,
          secondsDisplay: seconds
        }));
      }
    }, 1000);
  }
  
  stop() {
    clearInterval(this.countdown);
    this.setState({
      running: false
    })
  }
  
  render() {
    // Debug
    console.log(this.state);
    return (
      <div id="app">
        <h1>Pomodoro Timer</h1>
        <BreakControl length={this.state.breakLength} decrement={this.breakDecrement} increment={this.breakIncrement} />
        <SessionControl length={this.state.sessionLength} decrement={this.sessionDecrement} increment={this.sessionIncrement} />
        <Timer minutes={this.state.minutesDisplay} seconds={this.state.secondsDisplay} />
        <TimerControl toggle={this.toggleRun} reset={this.reset} />
      </div> 
    )
  }
}

/* ================== */
/* React DOM Renderer */
/* ================== */

ReactDOM.render(<App />, document.getElementById('root'))
