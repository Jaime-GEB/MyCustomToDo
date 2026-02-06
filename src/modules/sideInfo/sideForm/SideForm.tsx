import { useState, useEffect} from "react";
import { useShallow } from "zustand/shallow";
import { Paper, TextField } from "@mui/material";
import type { ToDoItem } from "../../../types/StoreTypes";
import useToDoStore from "../../../store/todoStore/ToDoStore";

const SideForm = ({itemId, value}:{itemId:string, value:string}) => {

    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const thisItem = items.find((item)=> item.itemId===itemId);

    const editItem = useToDoStore((state) => state.editItem);
    const [newItem, setNewItem]=useState<Partial<Pick<ToDoItem, "itemName" | "itemDescription" | "itemPriorityLevel" | "itemCompleted">>>({
        itemName: thisItem?.itemName,
        itemDescription:thisItem?.itemDescription,
        itemPriorityLevel:thisItem?.itemPriorityLevel,
        itemCompleted:thisItem?.itemCompleted
    });

    useEffect(()=>{

        editItem(itemId, newItem)

    },[editItem, itemId, newItem])

    return (
        <Paper
            component="form"
            elevation={0}
            sx={{
                display:"flex",
                flexDirection:"column",
                alignContent:'center',
                justifyContent:'center',
                width:'100%',
                height:'25%',
                gap:5,
                transition: 'all 0.2s',
            }}
        >
            <TextField
                label="Nombre"
                sx={{
                    fontSize: '1.3rem',
                    fontWeight:'bold',
                    '& input::placeholder': { opacity: 0.6 }
                }}
                value={thisItem?.itemName}
                multiline
                onChange={(e) => setNewItem({itemName:e.target.value})}
            />
            <TextField
                label="Descripcion"
                sx={{
                    fontSize: '1rem',
                    '& input::placeholder': { opacity: 0.6 }
                }}
                multiline
                rows={3}
                value={thisItem?.itemDescription}
                onChange={(e) => setNewItem({itemDescription:e.target.value})}
            />
            
            
        </Paper>
    );
};

export default SideForm;
