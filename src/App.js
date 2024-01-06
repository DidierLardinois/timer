import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import beepSound from  './telefoon.mp3';

const Timer = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const beepRef = useRef(null); // Added ref for beep audio element

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(sessionLength * 60);
    setIsRunning(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  useEffect(() => {
    let countdownInterval;

    if (isRunning) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            beepRef.current.play();

            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    document.getElementById("break-length").innerText = breakLength;
    document.getElementById("session-length").innerText = sessionLength; // Added this line to set the session length
  }, [breakLength, sessionLength]);

  useEffect(() => {
    setTimeLeft(sessionLength * 60); // Update timeLeft when sessionLength changes
  }, [sessionLength]);

  return (
    <div id="timer-app">
      <button id="break-decrement" onClick={decrementBreakLength}>
        Decrement Break Length
      </button>
      <div id="break-label">Break Length: <span id="break-length">{breakLength}</span></div>
      <button id="break-increment" onClick={incrementBreakLength}>
        Increment Break Length
      </button>

      <button id="session-decrement" onClick={decrementSessionLength}>
        Decrement Session Length
      </button>
      <div id="session-label">Session Length: <span id="session-length">{sessionLength}</span></div> {/* Added span element with id="session-length" */}
      <button id="session-increment" onClick={incrementSessionLength}>
        Increment Session Length
      </button>

      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" onClick={startStopTimer}>
        Start/Stop
      </button>
      <button id="reset" onClick={resetTimer}>
        Reset
      </button>

      <audio id="beep" src={beepSound} preload="auto" ref={beepRef} muted/> {/* Added ref to beep audio element */}
    </div>
  );
};

export default Timer;
