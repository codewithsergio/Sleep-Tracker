import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { db } from "../firebase/firebase-config";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import "../styles/Home.css";
import BottomNavBar from "../components/BottomNavBar";
import { getAuth, signOut } from "firebase/auth";

function Home() {
  const { dispatch, userData, sleepData } = useContext(Context);
  useEffect(() => {}, [userData, sleepData]);
  const auth = getAuth();

  const calculateSleepDuration = (sleepTime: string, wakeUpTime: string) => {
    console.log(sleepTime, wakeUpTime);
    const sleepTimeRegex = /(\d+):(\d+)(am|pm)/i;
    const sleepTimeMatches = sleepTime.match(sleepTimeRegex);
    const wakeUpTimeMatches = wakeUpTime.match(sleepTimeRegex);

    console.log("starting calculation");

    if (!sleepTimeMatches || !wakeUpTimeMatches) {
      console.log("error line 16");
      throw new Error("Invalid time format");
    }

    const [, sleepHour, sleepMinute, sleepPeriod] = sleepTimeMatches;
    const [, wakeUpHour, wakeUpMinute, wakeUpPeriod] = wakeUpTimeMatches;

    let sleepHourAdjusted = parseInt(sleepHour);
    if (sleepPeriod === "pm" && sleepHour !== "12") {
      sleepHourAdjusted += 12;
    } else if (sleepPeriod === "am" && sleepHour === "12") {
      sleepHourAdjusted = 0;
    }

    let wakeUpHourAdjusted = parseInt(wakeUpHour);
    if (wakeUpPeriod === "pm" && wakeUpHour !== "12") {
      wakeUpHourAdjusted += 12;
    } else if (wakeUpPeriod === "am" && wakeUpHour === "12") {
      wakeUpHourAdjusted = 0;
    }

    let sleepDurationInMinutes =
      wakeUpHourAdjusted * 60 +
      parseInt(wakeUpMinute) -
      (sleepHourAdjusted * 60 + parseInt(sleepMinute));

    if (sleepDurationInMinutes < 0) {
      sleepDurationInMinutes += 24 * 60;
    }

    const hours = Math.floor(sleepDurationInMinutes / 60);
    const minutes = sleepDurationInMinutes % 60;

    console.log(
      "returning sleep duration value",
      `${hours}:${minutes.toString().padStart(2, "0")}`
    );

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const getCurrentDate = (): [string, string, number] => {
    let meridiem = "";
    const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth() + 1;
    // const currentDay = currentDate.getDate();
    let todayRawHours = currentDate.getHours(); // Returns the hour (0 - 23)
    let hours = todayRawHours;
    if (hours == 0) {
      hours = 12;
      meridiem = "am";
    } else if (hours === 12) {
      meridiem = "pm";
    } else if (hours > 12) {
      hours = hours - 12;
      meridiem = "pm";
    } else {
      meridiem = "am";
    }
    let minutesNumber = currentDate.getMinutes(); // Returns the minutes (0 - 59)
    let minutes = "";
    if (minutesNumber < 10) {
      minutes = `0${minutesNumber}`;
    } else {
      minutes = `${minutesNumber}`;
    }
    // const date = `${currentMonth}/${currentDay}/${year}`;
    const dateWithDay = currentDate.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = `${hours}:${minutes}${meridiem}`;
    return [dateWithDay, time, todayRawHours];
  };

  const addSleepTime = () => {
    // Parse date and update sleepTimeDict
    // with new sleep date and time.
    const parsedDataInfo = getCurrentDate();
    const parsedDate: string = parsedDataInfo[0];
    const parsedTime: string = parsedDataInfo[1];
    // Add sleep time
    if (
      confirm(
        `Are you sure you want to add a sleep time for ${parsedDate} at ${parsedTime}?`
      ) == true
    ) {
      updateDoc(doc(db, "users", userData.uid), {
        sleepTimeDict: { date: parsedDate, time: parsedTime },
      })
        .then(() => {
          alert(
            `${userData.name}, you have added your sleep time on ${parsedDate} to be ${parsedTime}.`
          );
        })
        .catch((error) => {
          alert(error.message);
        });
      dispatch({
        type: "ADD_SLEEP_TIME",
        payload: {
          date: parsedDate,
          time: parsedTime,
        },
      });
    }
  };

  const addWakeTime = () => {
    // Parse date and update timeWokeUpList
    // with new wake up date and time.
    const parsedDataInfo = getCurrentDate();
    const parsedDate = parsedDataInfo[0];
    const parsedTime = parsedDataInfo[1];
    // Create sleepRange variable
    const previousTimeSlept = sleepData.sleepTimeDict.time;
    const hoursOfSleepVariable = calculateSleepDuration(
      previousTimeSlept,
      parsedTime
    );
    const sleepRangeVariable = `${previousTimeSlept}-${parsedTime}`;
    if (
      confirm(
        `Are you sure you want to add a wake time for ${parsedDate} at ${parsedTime}?`
      ) == true
    ) {
      updateDoc(doc(db, "users", userData.uid), {
        timeWokeUpList: arrayUnion({
          date: parsedDate,
          sleepTimeRange: sleepRangeVariable,
          hoursOfSleep: hoursOfSleepVariable,
        }),
      })
        .then(() => {
          alert(
            `${userData.name}, you have added your wake up time on ${parsedDate} to be ${parsedTime}.`
          );
        })
        .catch((error) => {
          alert(error.message);
        });
      dispatch({
        type: "ADD_WAKE_TIME",
        payload: {
          date: parsedDate,
          sleepTimeRange: sleepRangeVariable,
          hoursOfSleep: hoursOfSleepVariable,
        },
      });
    }
  };

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="home">
      <div className="button signout" onClick={signUserOut}>
        Sign Out
      </div>
      <div className="title-screen">
        <h1>
          <span id="name-span">{userData.name}</span>, here you can keep track
          of your sleeping schedule!
        </h1>
      </div>
      <div className="button-group">
        <button id="sleepButton" onClick={addSleepTime}>
          Going to bed now
        </button>
        <button id="wakeButton" onClick={addWakeTime}>
          Just woke up
        </button>
      </div>
      <div className="sleep-record-list">
        <h2>Sleep Schedule</h2>
        {sleepData.timeWokeUpList && sleepData.timeWokeUpList.length === 0 ? (
          <div>No data to show</div>
        ) : (
          sleepData.timeWokeUpList
            .slice()
            .reverse()
            .map((thisDate: any, index: number) => {
              const splitValues = thisDate.hoursOfSleep.split(":");
              const minutesToInt = parseInt(splitValues[1]);
              const formattedTime = `${splitValues[0]}h ${minutesToInt}min`;
              return (
                <div className="card" key={index}>
                  <div className="card-left-info">
                    <p className="card-date">{thisDate.date}</p>
                    <p className="time-range">{thisDate.sleepTimeRange}</p>
                  </div>
                  <p>{formattedTime}</p>
                </div>
              );
            })
        )}
      </div>
      <BottomNavBar />
    </div>
  );
}

export default Home;
