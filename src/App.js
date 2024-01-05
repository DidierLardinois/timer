import React, { useState, useEffect, useRef } from 'react';
import beepSound from './telefoon.mp3';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // Added state for break
  const intervalRef = useRef(null);
  const beepRef = useRef(null); // Added ref for beep audio element
  const [displayBreakLength, setDisplayBreakLength] = useState(breakLength);
  const [displaySessionLength, setDisplaySessionLength] = useState(sessionLength);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (seconds < 0) {
      clearInterval(intervalRef.current);
      if (isBreak) {
        setDisplayBreakLength(displayBreakLength => displayBreakLength - 1);
        setSeconds(breakLength * 60);
      } else {
        setIsBreak(true);
        setDisplaySessionLength(displaySessionLength => displaySessionLength - 1);
        setSeconds(sessionLength * 60);
      }
      beepRef.current.play().catch(() => {
        // Autoplay was blocked. Show a UI element to let the user manually start playback.
        alert('Please click on the page to allow sound to play.');
      }); // Play the sound when countdown reaches zero
    }
  }, [seconds, isBreak, breakLength, sessionLength]);

  useEffect(() => {
    setSeconds(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    setIsRunning(true); // Start the timer when the component mounts
  }, []);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setSeconds(0);
    setIsBreak(false); // Reset isBreak to false
    document.getElementById("break-length").textContent = "5";
    document.getElementById("session-length").textContent = "25";
    document.getElementById("time-left").textContent = "25:00";
    beepRef.current.pause(); // Pause the sound when reset
    beepRef.current.currentTime = 0; // Reset the sound to the beginning
  };

  const handleBreakDecrement = () => {
    setBreakLength(breakLength => Math.max(breakLength - 1, 1));
  };

  const handleBreakIncrement = () => {
    setBreakLength(breakLength => Math.min(breakLength + 1, 60));
  };

  const handleSessionDecrement = () => {
    setSessionLength(sessionLength => Math.max(sessionLength - 1, 1));
  };

  const handleSessionIncrement = () => {
    setSessionLength(sessionLength => Math.min(sessionLength + 1, 60));
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div>
      <label id="break-label">Break Length</label>
      <label id="session-label">Session Length</label>
      <button id="break-decrement" onClick={handleBreakDecrement}>BreDec</button>
      <button id="session-decrement" onClick={handleSessionDecrement}>SesDec</button>
      <button id="break-increment" onClick={handleBreakIncrement}>BreInc</button>
      <button id="session-increment" onClick={handleSessionIncrement}>SesInc</button>
      <div id="break-length">{displayBreakLength}</div>
      <div id="session-length">{displaySessionLength}</div>
      <label id="timer-label">{isBreak ? "Break" : "Session"}</label> {/* Display "Break" when isBreak is true */}
      <div id="time-left">{formatTime(seconds)}</div>
      <button id="start_stop" onClick={handleStartStop}>START/STOP</button>
      <button id="reset" onClick={handleReset}>RESET</button>
      <audio id="beep" src={beepSound} preload="auto" ref={beepRef} muted /> {/* Added ref to beep audio element */}
    </div>
  );
}

export default Timer;
