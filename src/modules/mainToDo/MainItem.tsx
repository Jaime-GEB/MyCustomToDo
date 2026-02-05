import {
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    ListItemIcon,
    ListItemButton,
} from "@mui/material";
import { DeleteOutline, ExpandMore, ExpandLess, LibraryAdd } from '@mui/icons-material';
import type { ToDoItem } from "../../types/StoreTypes";
import CreateChildForm from "./CreateChildForm";

interface MainItemProps {
    item: ToDoItem;
    index: number;
    listId: string;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    onReOrder: (index: number, direction: 'up' | 'down') => void;
    onAddChildBtn: (id: string) => void;
    showChildForm: boolean;
    onCloseChildForm: () => void;
}

/**
 * Renderiza un ítem principal de la lista (aquellos que no tienen padre).
 * Incluye controles para marcar como completado, eliminar y añadir subtareas.
 */
const MainItem = ({
    item,
    index,
    listId,
    onToggle,
    onRemove,
    onReOrder,
    onAddChildBtn,
    showChildForm,
    onCloseChildForm
}: MainItemProps) => {

    if (item.itemParent === undefined || item.itemParent === null) return (
        <>
            <ListItem
                disablePadding
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 1000ms ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    '&:hover': {
                        borderColor: 'primary.light',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    }
                }}
                secondaryAction={
                    <div className="flex flex-row">
                        <IconButton
                            edge="end"
                            aria-label="add-child"
                            onClick={() => onAddChildBtn(item.itemId)}
                            sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                        >
                            <LibraryAdd />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => onRemove(item.itemId)}
                            sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </div>
                }
            >
                <ListItemButton
                    disableRipple
                    sx={{ p: 1.5, pl: 3 }}
                >
                    <div className="flex flex-col -my-5 mr-5">
                        <IconButton sx={{ m: -1 }} onClick={() => onReOrder(index, 'up')}>
                            <ExpandLess />
                        </IconButton>
                        <IconButton sx={{ m: -1 }} onClick={() => onReOrder(index, 'down')}>
                            <ExpandMore />
                        </IconButton>
                    </div>
                    <ListItemIcon onClick={(e) => { e.stopPropagation(); onToggle(item.itemId); }}>
                        <Checkbox
                            edge="start"
                            checked={item.itemCompleted}
                            tabIndex={-1}
                            disableRipple
                            sx={{
                                color: 'divider',
                                '&.Mui-checked': { color: 'secondary.main' }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={item.itemName}
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            textDecoration: item.itemCompleted ? 'line-through' : 'none',
                            color: item.itemCompleted ? 'text.disabled' : 'text.primary',
                            transition: 'all 0.2s',
                            wordBreak: 'break-word',
                            display: 'block'
                        }}
                    />
                </ListItemButton>
            </ListItem>

            {showChildForm && (
                <CreateChildForm
                    listId={listId}
                    parentId={item.itemId}
                    parentPriority={item.itemPriorityLevel}
                    onClose={onCloseChildForm}
                />
            )}


        </>
    );
};

export default MainItem;
