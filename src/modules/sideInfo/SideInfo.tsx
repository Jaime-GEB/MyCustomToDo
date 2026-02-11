import {
    Box,
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SideContent } from "../mainToDo/components/customComponents";
import SideForm from './sideForm/SideForm';
import Timer from "./clockComponents/Timer";
import ClockAlarm from "./clockComponents/clockAlarm";
import Calendar from "./calendar/Calendar";

const SideInfo = ({ itemId, value }: { itemId: string, value: string }) => {

    return (
        <SideContent open={itemId !== ''}>
            <section className="flex flex-col w-full h-screen">
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Editar Item
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className='flex items-center px-5 justify-center mb-5'>
                            <SideForm itemId={itemId} value={value} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Alarma
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className='flex flex-col gap-5 w-full items-center justify-center mb-5'>
                            <ClockAlarm itemId={itemId} value={value} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Timer
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className='flex flex-col gap-5 w-full items-center justify-center mb-5'>
                            <Timer />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Calendario
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className='flex flex-col gap-5 w-full items-center justify-center mb-5'>
                            <Calendar itemId={itemId} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </section>
        </SideContent>

    );

}
export default SideInfo;