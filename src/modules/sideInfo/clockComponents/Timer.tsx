import useTimer from "../../../hooks/useTimer"; 
import { Typography, Button, Box } from "@mui/material";
import {RestartAlt, PlayCircleOutline, PauseCircleOutline} from '@mui/icons-material';

const Timer = () =>{
    const {isRunning, segundos, minutos, horas, reset, toggle} = useTimer()

    return(
        <Box>
            <div id="timer" className="flex flex-row justify-center items-baseline border-4 px-3 border-gray-600 rounded-2xl">
                <Typography fontSize={50}>
                    {horas.toString().padStart( 2,"0")}
                </Typography>
                <Typography fontSize={40} sx={{flex: 'row', justifySelf:'center', alignSelf:'center'}}>
                    : 
                </Typography>
                <Typography fontSize={30}>
                    {minutos.toString().padStart( 2,"0")}:
                </Typography>
                <Typography fontSize={20}>
                    {segundos.toString().padStart( 2,"0")}
                </Typography>
            </div>

            <div className="flex flex-row justify-center items-center gap-3 mt-5">
                <Button onClick={reset} variant="contained">
                    <RestartAlt/>
                </Button>
                <Button onClick={toggle} variant="contained">
                    {isRunning ? <PauseCircleOutline/> : <PlayCircleOutline/>}
                </Button>
            </div>
        </Box>
    );
}
export default Timer