import { useEffect, useRef, useState } from "react";
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
    const [isSet, setIsSet] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(null)
    const [hours, setHours] = useState(new Date().getHours());
    const [mins, setMins] = useState(new Date().getMinutes());
    const setAlarm = useToDoStore((state) => state.setAlarm);
    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const thisItem = items.find((item) => item.itemId === itemId);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (thisItem?.alarmTime) {
            const [h, m] = thisItem.alarmTime.split(':').map(Number);
            setHours(h);
            setMins(m);
            setIsSet(true);

            const updateTime = () => setTimeLeft(timeToAlarm(h, m));
            updateTime();
            interval = setInterval(updateTime, 60000);
        } else {
            const now = new Date();
            setHours(now.getHours());
            setMins(now.getMinutes());
            setIsSet(false);
            setTimeLeft(null);
        }

        return () => clearInterval(interval);
    }, [itemId, thisItem?.alarmTime]);

    const handleSetAlarm = () => {
        const alarmTime = `${hours}:${mins}`;
        setIsSet(true);
        setAlarm(itemId, alarmTime);
    };

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
            <Button variant="contained" onClick={handleSetAlarm}>
                Establecer Alarma
            </Button>
        </section>

    );
}
export default ClockAlarm;