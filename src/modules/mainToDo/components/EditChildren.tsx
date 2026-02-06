import { useState, useEffect, type KeyboardEvent } from "react";
import { useShallow } from "zustand/shallow";
import { Paper, TextField } from "@mui/material";
import type { ToDoItem } from "../../../types/StoreTypes";
import useToDoStore from "../../../store/todoStore/ToDoStore";

const EditItem = ({ itemId, value, setChangeName }: { itemId: string, value: string, setChangeName: (bool: boolean) => void }) => {

    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const thisItem = items.find((item) => item.itemId === itemId);

    const editItem = useToDoStore((state) => state.editItem);
    const [newItem, setNewItem] = useState<Partial<Pick<ToDoItem, "itemName" | "itemDescription" | "itemPriorityLevel" | "itemCompleted">>>({
        itemName: thisItem?.itemName,
        itemDescription: thisItem?.itemDescription,
        itemPriorityLevel: thisItem?.itemPriorityLevel,
        itemCompleted: thisItem?.itemCompleted
    });

    useEffect(() => {

        editItem(itemId, newItem)

    }, [editItem, itemId, newItem])

    const handleCloseEditChild = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            setChangeName(false)
        }
    }

    return (
        <Paper
            component="form"
            elevation={0}
            sx={{
                display: "flex",
                width: 'auto',
            }}
        >
            <TextField
                sx={{
                    size: 'auto',
                    fontSize: '1rem',
                    width: '80vw',
                    '& input::placeholder': { opacity: 0.6 }
                }}
                value={thisItem?.itemName}
                multiline
                onChange={(e) => setNewItem({ itemName: e.target.value })}
                onKeyDown={handleCloseEditChild}
            />
        </Paper>
    );
};

export default EditItem;
