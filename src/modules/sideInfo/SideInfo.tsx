import {
    Box, 
    Divider, 
    Typography
} from "@mui/material";
import { SideContent } from "../mainToDo/components/customComponents";
import Timer from "./clockComponents/Timer";
import SideForm from './sideForm/SideForm';

const SideInfo = ({ itemId, value }: { itemId: string, value: string }) => {

    return (
        <SideContent open={itemId !== ''}>
            <section className="flex flex-col w-full h-screen">
                <Box className='flex items-center p-5 justify-center mb-5 mt-5'>
                    <SideForm itemId={itemId} value={value} />
                </Box>
                <Divider sx={{border:1, opacity:0.2}} />
                <Box className='flex flex-col gap-5 w-full items-center justify-center mt-5'>
                    <Typography fontSize={30} sx={{alignSelf:'start', ml:4}}>Timer</Typography>
                    <Divider  sx={{alignSelf:'start', width:180, color:'green'}}/>
                    <Timer />
                </Box>
            </section>
        </SideContent>
        
    );

}
export default SideInfo;