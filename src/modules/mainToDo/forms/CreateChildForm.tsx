import { useState, type KeyboardEvent } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import useToDoStore from "../../../store/todoStore/ToDoStore";
import type { PriorityLevel } from "../../../types/StoreTypes";

interface CreateChildFormProps {
    listId: string;
    parentId: string;
    parentPriority: PriorityLevel;
    onClose: () => void;
}

/**
 * Formulario para añadir nuevas subtareas.
 * Aparece indentado igual que la subtarea que se va a crear para mantener la coherencia visual.
 */
const CreateChildForm = ({ listId, parentId, parentPriority, onClose }: CreateChildFormProps) => {
    const childPriority = parentPriority + 1;
    // Store access for direct actions if needed in future
    const addItem = useToDoStore((state) => state.addItem);
    const [newItemChildName, setNewItemChildName] = useState('');

    const handleAddItemChild = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemChildName.trim()) {
            addItem(listId, newItemChildName, '', childPriority as PriorityLevel, parentId);

            setTimeout(() => {
                const currentItems = useToDoStore.getState().itemsOrderByList[listId];
                if (currentItems && currentItems.length > 0) {
                    const parentIdx = currentItems.indexOf(parentId);
                    const lastIdx = currentItems.length - 1;
                    if (parentIdx !== -1 && lastIdx > parentIdx) {
                        useToDoStore.getState().reorderItems(listId, lastIdx, parentIdx + 1);
                    }
                }
            }, 0);

            setNewItemChildName('');
            onClose();
        }
    };

    const handleCloseEditChild = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    // Coincide con la lógica de indentación de ChildItem: 40px * prioridad
    // Se usa la prioridad del padre porque el nuevo item será su hijo inmediato visualmente en este contexto
    const indentPx = 50 * parentPriority;

    return (
        <Paper
            component="form"
            onSubmit={handleAddItemChild}
            elevation={0}
            sx={{
                mt: 1,
                ml: `${indentPx}px`,
                width: `calc(100% - ${indentPx}px)`,
                p: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                mb: 1,
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
                placeholder="Añadir nueva subtarea..."
                autoFocus
                value={newItemChildName}
                onChange={(e) => setNewItemChildName(e.target.value)}
                onKeyDown={handleCloseEditChild}
            />
            <IconButton
                type="submit"
                sx={{
                    p: '8px',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
                disabled={!newItemChildName.trim()}
            >
                <AddIcon />
            </IconButton>
        </Paper>
    );
};

export default CreateChildForm;
