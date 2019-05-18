// still need to remove direct DOM manipulation for playing audio.

/* ================ */
/*   Break Control  *
                       /* ================ */

class BreakControl extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "break-control" },
      React.createElement("h2", { id: "break-label" }, "Break Length"),
      React.createElement("button", {
        id: "break-increment",
        onClick: this.props.increment },
      React.createElement("i", { class: "fas fa-caret-up" })),


      React.createElement("h2", { id: "break-length" }, this.props.length),

      React.createElement("button", {
        id: "break-decrement",
        onClick: this.props.decrement },
      React.createElement("i", { class: "fas fa-caret-down" }))));



  }}


/* ================== */
/*   Session Control  */
/* ================== */

class SessionControl extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "session-control" },
      React.createElement("h2", { id: "session-label" }, "Session Length"),
      React.createElement("button", {
        id: "session-increment",
        onClick: this.props.increment },
      React.createElement("i", { class: "fas fa-caret-up" })),


      React.createElement("h2", { id: "session-length" }, this.props.length),

      React.createElement("button", {
        id: "session-decrement",
        onClick: this.props.decrement },
      React.createElement("i", { class: "fas fa-caret-down" }))));



  }}


/* =================== */
/*   Countdown Timer   */
/* =================== */

class Timer extends React.Component {

  render() {
    // Change title text so timer can be seen when on another page
    document.title = this.props.minutes + ":" + this.props.seconds;
    return (
      React.createElement("div", { id: "timer" },
      React.createElement("h2", { id: "timer-label" }, this.props.headingString),
      React.createElement("h2", { id: "time-left" }, this.props.minutes, ":", this.props.seconds)));


  }}


/* =================== */
/*    Timer Control    */
/* =================== */

class TimerControl extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "timer-control" },
      React.createElement("button", {
        id: "start_stop",
        onClick: this.props.toggle },
      React.createElement("i", { class: "fas fa-play" }), " ", React.createElement("i", { class: "fas fa-pause" })),
      React.createElement("button", {
        id: "reset",
        onClick: this.props.reset },
      React.createElement("i", { class: "fas fa-undo" }))));



  }}


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
      running: false,
      sessionOrBreak: "Session" };

    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.reset = this.reset.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.toggleRun = this.toggleRun.bind(this);

    // Audio ref (not yet used)
    this.playAudio = React.createRef();

    // Declare interval so it can be stopped
    this.countdown = 0;
  }

  /* HANDLE INCREMENT/DECREMENT */
  breakDecrement() {
    if (this.state.breakLength > 1) {
      this.setState((prevState, props) => ({
        breakLength: prevState.breakLength - 1 }));

    }
  }
  breakIncrement() {
    if (this.state.breakLength < 60) {
      this.setState((prevState, props) => ({
        breakLength: prevState.breakLength + 1 }));

    }
  }
  sessionDecrement() {
    if (this.state.sessionLength > 1) {
      this.setState((prevState, props) => ({
        sessionLength: prevState.sessionLength - 1,
        minutesDisplay: prevState.minutesDisplay - 1,
        secondsRemaining: prevState.secondsRemaining - 60 }));

    }
  }
  sessionIncrement() {
    if (this.state.sessionLength < 60) {
      this.setState((prevState, props) => ({
        sessionLength: prevState.sessionLength + 1,
        minutesDisplay: prevState.minutesDisplay + 1,
        secondsRemaining: prevState.secondsRemaining + 60 }));

    }
  }

  reset() {
    this.stop();

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      secondsRemaining: 1500,
      minutesDisplay: "25",
      secondsDisplay: "00",
      running: false,
      sessionOrBreak: "Session" });


    // Stop beeping
    let beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  }

  toggleRun() {
    let running = this.state.running;
    if (running) {
      this.stop();
    } else {
      this.run();
    }
  }



  run() {
    // First clear any possible previous interval to prevent bugs
    clearInterval(this.countdown);


    this.countdown = setInterval(() => {
      if (this.state.secondsRemaining >= 1) {

        // First set to "running" and then count a second before updating the DOM
        this.setState((prevState, props) => ({
          running: true,
          secondsRemaining: prevState.secondsRemaining - 1 }));


        var minutesRaw = Math.floor(this.state.secondsRemaining / 60);
        var secondsRaw = Math.floor(this.state.secondsRemaining % 60);
        var seconds = String(secondsRaw).padStart(2, 0);
        var minutes = String(minutesRaw).padStart(2, 0);

        // Update DOM
        this.setState((prevState, props) => ({
          minutesDisplay: minutes,
          secondsDisplay: seconds }));


      } else {
        // When timer runs down
        let beep = document.getElementById("beep");
        beep.play();
        var periodType = "";
        var periodLength;

        if (this.state.sessionOrBreak === "Session") {
          periodType = "Break";
          // Adding one seems kinda hacky
          periodLength = this.state.breakLength * 60 + 1;
        } else {
          periodType = "Session";
          // Adding one seems kinda hacky
          periodLength = this.state.sessionLength * 60 + 1;
        }

        this.setState((prevState, props) => ({
          sessionOrBreak: periodType,
          secondsRemaining: periodLength }));

      }
    }, 1000);
  }

  stop() {
    clearInterval(this.countdown);
    /*this.countdown = undefined; //not sure if it helps */
    this.setState({
      running: false });

  }

  render() {
    // Debug
    console.log(this.state);
    return (
      React.createElement("div", { id: "app" },
      React.createElement("h1", null, "Pomodoro Timer"),
      React.createElement(BreakControl, { length: this.state.breakLength, decrement: this.breakDecrement, increment: this.breakIncrement }),
      React.createElement(SessionControl, { length: this.state.sessionLength, decrement: this.sessionDecrement, increment: this.sessionIncrement }),
      React.createElement(Timer, { headingString: this.state.sessionOrBreak, minutes: this.state.minutesDisplay, seconds: this.state.secondsDisplay }),
      React.createElement(TimerControl, { toggle: this.toggleRun, reset: this.reset }),
      React.createElement("audio", {
        id: "beep",
        src: "https://goo.gl/65cBl1",
        ref: this.playAudio })));




  }}


/* ================== */
/* React DOM Renderer */
/* ================== */

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));