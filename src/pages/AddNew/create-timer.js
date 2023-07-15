import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

function CreateTimer() {

    const { project, issue } = useParams();
    const navigate = useNavigate();

    const [warning, setWarning] = React.useState(null);
    const [ampm, setAmpm] = React.useState('??');
    const [hours, _setHours] = React.useState(0);
    const [minutes, _setMinutes] = React.useState(0);
    const hoursRef = React.useRef(null);
    const minutesRef = React.useRef(null);

    React.useEffect(() => {
        getStartTime();
    }, [hours, minutes, ampm])

    React.useEffect(() => {
        setHours(new Date().getHours() % 12)
        setMinutes(new Date().getMinutes())
        setAmpm(new Date().getHours() >= 12 ? 'PM' : 'AM')
    }, [])

    const setHours = (v) => {
        // v = +1 or -1
        let newHours = hours;
        if (hours === 12 && !v) newHours = 0;
        else if (hours === 1 && !v) newHours = 12;
        else newHours += v;
        if (newHours <= 0) {
            newHours = 12;
        }
        if (newHours > 12) {
            newHours = 1;
        }
        _setHours(newHours);
    }


    const setMinutes = (v) => {
        // v = +1 or -1
        let m = minutes + v;
        if (m < 0) {
            m = 59;
            setHours(-1);
        }
        if (m > 59) {
            m = 0;
            setHours(+1);
        }
        _setMinutes(m);
    }



    const [createEnabled, setCreateEnabled] = React.useState(false);
    const summaryField = React.useRef(null);

    const getStartTime = () => {
        // calculate the start time relative to now, remembering that if it's 1am, the user could have started the timer at 11pm the previous day (or 23:00)
        const now = new Date();
        const hours = parseInt(hoursRef.current.value);
        let realHours = hours;
        const minutes = parseInt(minutesRef.current.value);
        const isPM = (ampm === 'PM')
        console.log(`${hours}:${minutes} ${ampm}`)

        if (hours === 12) {
            realHours = 0;
        }

        let startTime = new Date();
        startTime.setHours(isPM ? realHours + 12 : realHours);
        startTime.setMinutes(minutes);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        console.log(startTime)

        // if the start time is in the future, then it's actually yesterday, so subtract a day
        if (startTime > now) {
            startTime.setDate(startTime.getDate() - 1);
            setWarning("The time selected is in the future, this will be recorded as yesterday's time! " + startTime.toLocaleString())
            console.log(startTime)
        } else {
            setWarning(null);
        }

        return startTime;
    }

    const doCreateTimer = async () => {
        const currentUser = await window.yt.getCurrentUser();

        const startTime = getStartTime();
        // this will break on Wed May 18 2033 03:33:20 ... 🤷‍♂️
        const YTTStr = window.yt.constructYTT(currentUser.id, { active: ((startTime.getTime() / 1e4) - 1e8).toFixed() });

        const summary = summaryField.current.value;

        try {
            const newTimer = await window.yt.createTimer(issue, YTTStr, summary);
            navigate(`/`);
        } catch (e) {
            console.log(e);
            alert(e.message);
        }

    }

    let time = Intl.NumberFormat('en-GB', { minimumIntegerDigits: 2 });

    return (
        <>
            <section className="p-4">
                <h3 className="text-2xl font-bold text-center mb-5  text-gray-600 dark:text-white">Start Timer</h3>

                {/* 
                time picker HH:MM AM/PM 
                flex row with 3 columns
                1st column: hours
                2nd column: minutes
                3rd column: AM/PM  
                
                each item has an up and down arrow to increment/decrement the value

                */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Time <span className="text-red-500 text-sm text-bold">*</span></label>



                    <div className="flex flex-row py-2 justify-center rounded text-gray-600 dark:text-white">
                        <div className="flex flex-col w-1/6 mx-3">
                            <button className="text-xl p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-900" onClick={() => { setHours(+1) }}>+</button>
                            <input ref={hoursRef} min={0} max={11} type="number" className="text-center text-3xl bg-transparent p-0" value={time.format(hours)} readOnly />
                            <button className="text-xl p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-900" onClick={() => { setHours(-1) }}>-</button>
                        </div>


                        <div className="flex flex-col w-1/6 mx-3">
                            <button className="text-xl p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-900" onClick={() => { setMinutes(+1) }}>+</button>
                            <input ref={minutesRef} min={0} max={59} type="number" className="text-center text-3xl bg-transparent p-0" value={time.format(minutes)} readOnly />
                            <button className="text-xl p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-900" onClick={() => { setMinutes(-1) }}>-</button>
                        </div>

                        <div className="flex flex-col w-2/6  mx-3 justify-center">
                            <input type="radio" id="AM" name="ampm" value="AM" className="hidden" onChange={e => setAmpm(e.target.value)} />
                            <input type="radio" id="PM" name="ampm" value="PM" className="hidden" onChange={e => setAmpm(e.target.value)} />
                            <label for="AM" className={"cursor-pointer text-xl p-1 rounded text-center my-1 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" + (ampm === 'AM' ? ' bg-gray-300 dark:bg-gray-900 ' : '')}>AM</label>
                            <label for="PM" className={"cursor-pointer text-xl p-1 rounded text-center my-1 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" + (ampm === 'PM' ? ' bg-gray-300 dark:bg-gray-900 ' : '')}>PM</label>
                        </div>
                    </div>

                    {warning && <div className="text-red-500 rounded relative py-2 text-center" role="alert">
                        <small>{warning}</small>
                    </div>}
                </div>



                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes / Reason</label>
                    <input ref={summaryField} onChange={(e) => { setCreateEnabled(e.target.value.length > 3) }} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <button onClick={doCreateTimer} className="p-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"> Create </button>
            </section>
        </>
    );
}

export default CreateTimer;
