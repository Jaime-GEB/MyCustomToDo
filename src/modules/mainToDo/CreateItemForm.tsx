import { useState } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Add } from '@mui/icons-material';
import useToDoStore from "../../store/todoStore/ToDoStore";
import type { PriorityLevel } from "../../types/StoreTypes";

interface CreateItemFormProps {
    listId: string;
}

const CreateItemForm = ({ listId }: CreateItemFormProps) => {
    const addItem = useToDoStore((state) => state.addItem);
    const [newItemName, setNewItemName] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            addItem(listId, newItemName, '', 0 as PriorityLevel, null);
            setNewItemName('');
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleAddItem}
            elevation={0}
            sx={{
                p: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                bgcolor: 'background.paper',
                '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
                }
            }}
        >
            <InputBase
                sx={{
                    ml: 1,
                    flex: 1,
                    fontSize: '1rem',
                    '& input::placeholder': { opacity: 0.6 }
                }}
                placeholder="Añadir nueva tarea..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
            />
            <IconButton
                type="submit"
                sx={{
                    p: '8px',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
                disabled={!newItemName.trim()}
            >
                <Add />
            </IconButton>
        </Paper>
    );
};

export default CreateItemForm;
