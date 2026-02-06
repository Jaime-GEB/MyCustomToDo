import {
    Box
} from "@mui/material";
import { SideContent } from "../mainToDo/components/customComponents";
import SideForm from './sideForm/SideForm';

const SideInfo = ({itemId, value}:{itemId:string, value:string}) => {

    return(
        <SideContent open={itemId!==''}>
            <Box className='flex w-full h-screen p-10'>
                <SideForm itemId={itemId} value={value}/>
            </Box>
        </SideContent>
    );

}
export default SideInfo;