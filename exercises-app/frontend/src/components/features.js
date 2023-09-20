import React, { useState, useEffect } from 'react';
import "../App.css"

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

export function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function scrollToBottom(element) {
  if (element && element.current) {
    element.current.scrollIntoView({ behavior: 'smooth' });
  }
}



export function handleIncrement(start, min, max, step, handler) {
  const newCount = start + step;
  if (start < max && start > min) {
    handler(newCount);
  } else if (start === max && step < 0) {
    handler(newCount);
  } else if (start === min && step > 0) {
    handler(newCount);
  }
};

export function Timer({ TimerVar, StatusUser, PauseVar, MaxExcItem, excItemNum, setExcItemNum }) {
  // ,PauseVar,RepsVar,SetsVar,PausebSets) {
  // const Time = TimerVar; // Total countdown time in seconds
  const [remainingTime, setRemainingTime] = useState(3000);
  const [statusProgress, setStatusProgress] = useState("countdown");
  useEffect(() => {

    const timer = setInterval(() => {
      if (remainingTime > 0 && StatusUser === "Started") {
        setRemainingTime((prevTime) => prevTime - 10);
      } else if (StatusUser === "Paused" || StatusUser === "Prep") {
        setRemainingTime((prevTime) => prevTime - 0);
      } else if (StatusUser === "Stopped") {
        setRemainingTime(3000); // 3 seconds in milliseconds
        setStatusProgress("countdown");

      } else if (remainingTime === 0 && statusProgress === "work") {

        if (excItemNum < MaxExcItem) {
          setStatusProgress("pause");
          setExcItemNum((prevNum) => prevNum + 1);

        } else {
          setStatusProgress("countdown")
          setRemainingTime(3000)
        }
        setRemainingTime(PauseVar * 1000);

      } else if (remainingTime === 0 && statusProgress === "countdown") {
        setRemainingTime(TimerVar * 1000);
        setStatusProgress("work");

      } else if (remainingTime === 0 && statusProgress === "pause") {
        setRemainingTime(TimerVar * 1000);
        setStatusProgress("work");
      } else {
        clearInterval(timer);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [remainingTime, StatusUser, TimerVar, PauseVar]);

  return (
    <div>
      {statusProgress === "work" && !(StatusUser === "Stopped" || StatusUser === "Prep") ? (
        <div>
          Excercising left: {Math.floor(remainingTime / 1000)}.{Math.floor((remainingTime % 1000) / 100)} s
        </div>
      ) : (statusProgress === "pause" || statusProgress === "countdown") && !(StatusUser === "Stopped" || StatusUser === "Prep") ? (
        <div>
          Start in: {Math.floor(remainingTime / 1000)}.{Math.floor((remainingTime % 1000) / 100)} s

        </div>
      ) : null}
      
    </div>
  )
}