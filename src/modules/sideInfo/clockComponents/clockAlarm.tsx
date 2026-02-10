import { useEffect, useRef, useState, useCallback } from "react";
import AlarmScrubber from "../../mainToDo/components/AlarmScrubber";
import { Typography, Button } from "@mui/material";
import useToDoStore from "../../../store/todoStore/ToDoStore";
import { useShallow } from "zustand/shallow";

const timeToAlarm = (hours: number, mins: number) => {
    const currentTime = new Date();
    const targetTime = new Date();

    targetTime.setHours(hours, mins, 0, 0);
    if (targetTime.getTime() <= currentTime.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime.getTime() - currentTime.getTime();
}

const ClockAlarm = ({ itemId, value }: { itemId: string, value: string }) => {
    const setAlarm = useToDoStore((state) => state.setAlarm);
    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const thisItem = items.find((item) => item.itemId === itemId);

    const [isSet, setIsSet] = useState(() => !!thisItem?.alarmTime);
    const [hours, setHours] = useState(() => {
        if (thisItem?.alarmTime) {
            return Number(thisItem.alarmTime.split(':')[0]);
        }
        return new Date().getHours();
    });
    const [mins, setMins] = useState(() => {
        if (thisItem?.alarmTime) {
            return Number(thisItem.alarmTime.split(':')[1]);
        }
        return new Date().getMinutes();
    });
    const [timeLeft, setTimeLeft] = useState<number | null>(() => {
        if (thisItem?.alarmTime) {
            const [h, m] = thisItem.alarmTime.split(':').map(Number);
            return timeToAlarm(h, m);
        }
        return null;
    });

    const [prevAlarmTime, setPrevAlarmTime] = useState(thisItem?.alarmTime);
    const [prevItemId, setPrevItemId] = useState(itemId);

    if (thisItem?.alarmTime !== prevAlarmTime || itemId !== prevItemId) {
        setPrevAlarmTime(thisItem?.alarmTime);
        setPrevItemId(itemId);
        if (thisItem?.alarmTime) {
            const [h, m] = thisItem.alarmTime.split(':').map(Number);
            setHours(h);
            setMins(m);
            setIsSet(true);
            setTimeLeft(timeToAlarm(h, m));
        } else {
            const now = new Date();
            setHours(now.getHours());
            setMins(now.getMinutes());
            setIsSet(false);
            setTimeLeft(null);
        }
    }

    const hasFired = useRef(false);

    const playAlarm = useCallback(() => {
        const audio = new Audio('/alarma.mp3');
        audio.play().catch(e => console.error("Error playing audio:", e));

        const title = thisItem?.itemName || "Tarea";
        const message = `Se ha cumplido la alarma de la tarea "${title}"`;

        if ("Notification" in globalThis) {
            if (Notification.permission === "granted") {
                new Notification("Alarma", { body: message, icon: '/public/perrotontogilipollas.png' });
            } else {
                alert(message);
            }
        } else {
            alert(message);
        }
    }, [thisItem]);

    useEffect(() => {
        if (!isSet || !thisItem?.alarmTime) {
            hasFired.current = false;
            return;
        }

        const [h, m] = thisItem.alarmTime.split(':').map(Number);

        const checkAlarm = () => {
            const now = new Date();
            const currentH = now.getHours();
            const currentM = now.getMinutes();

            if (currentH === h && currentM === m) {
                if (!hasFired.current) {
                    playAlarm();
                    hasFired.current = true;
                }
            } else {
                hasFired.current = false;
            }

            setTimeLeft(timeToAlarm(h, m));
        };

        const interval = setInterval(checkAlarm, 1000);
        return () => clearInterval(interval);
    }, [isSet, thisItem?.alarmTime, playAlarm]);

    const handleSetAlarm = () => {
        if ("Notification" in globalThis && Notification.permission === "default") {
            Notification.requestPermission();
        }
        const alarmTime = `${hours}:${mins}`;
        setIsSet(true);
        setAlarm(itemId, alarmTime);
        hasFired.current = false;
    };

    const handleDeleteAlarm = () => {
        setAlarm(itemId, null);
        setTimeLeft(null)
    }

    const formatTimeLeft = (ms: number) => {
        if (ms === null) return "";
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        return `Faltan ${h}h ${m}m`;
    };

    return (
        <section className="flex flex-col items-center justify-center gap-5">
            <div className="flex flex-row border-3 p-2 border-gray-600 rounded-xl gap-0.5">
                <AlarmScrubber value={hours} unit="hours" isSet={isSet} onChange={setHours} />
                <Typography sx={{ fontSize: 45 }}>:</Typography>
                <AlarmScrubber value={mins} unit="mins" isSet={isSet} onChange={setMins} />
            </div>
            {timeLeft !== null && (
                <Typography variant="body2" color="textSecondary">
                    {formatTimeLeft(timeLeft)}
                </Typography>
            )}
            <div className="flex flex-row gap-5">
                <Button variant="contained" onClick={handleSetAlarm}>
                    Establecer Alarma
                </Button>
                <Button variant="contained" color="error" onClick={handleDeleteAlarm}>
                    Eliminar Alarma
                </Button>
            </div>
        </section>

    );
}
export default ClockAlarm;