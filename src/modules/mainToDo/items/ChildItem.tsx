import {
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    ListItemIcon,
    ListItemButton,
} from "@mui/material";
import { DeleteOutline, ExpandMore, ExpandLess, LibraryAdd } from '@mui/icons-material';
import type { ToDoItem } from "../../../types/StoreTypes";
import CreateChildForm from "../forms/CreateChildForm";
import { useState } from "react";
import EditItem from "../components/EditChildren";

interface ChildItemProps {
    parentItem: ToDoItem;
    childItem: ToDoItem;
    parentIsCompleted: boolean,
    parentIndex: number;
    listId: string;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    onReOrder: (index: number, direction: 'up' | 'down') => void;
    onAddChildBtn: (id: string) => void;
    showChildForm: boolean;
    onCloseChildForm: () => void;
}

/**
 * Renderiza una subtarea.
 * Se encarga de manejar la indentación visual basada en el nivel de prioridad y hereda el estado de completado del padre.
 */
const ChildItem = ({
    parentItem,
    childItem,
    parentIndex,
    parentIsCompleted,
    listId,
    onToggle,
    onRemove,
    onReOrder,
    onAddChildBtn,
    showChildForm,
    onCloseChildForm
}: ChildItemProps) => {

    const [changeName, setChangeName]=useState(false)

    // Indentación en píxeles: 40px por nivel de prioridad para una jerarquía visual clara
    const indentPx = 40 * childItem.itemPriorityLevel;
    const index = parentIndex + 1;

    // Determina el estado efectivo de completado (si el padre está completo, el hijo también lo está visualmente)
    const isCompleted = childItem.itemCompleted || parentIsCompleted;

    if (childItem.itemParent === parentItem.itemId) return (
        <>
            <ListItem
                disablePadding
                sx={{
                    ml: `${indentPx}px`,
                    width: `calc(100% - ${indentPx}px)`, // Calcula el ancho restante para evitar overflow
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
                            onClick={() => onAddChildBtn(childItem.itemId)}
                            sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                        >
                            <LibraryAdd />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => onRemove(childItem.itemId)}
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
                    <ListItemIcon onClick={(e) => { e.stopPropagation(); onToggle(childItem.itemId); }}>
                        <Checkbox
                            edge="start"
                            checked={isCompleted}
                            tabIndex={-1}
                            disableRipple
                            sx={{
                                color: 'divider',
                                '&.Mui-checked': { color: 'secondary.main' }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={changeName?
                            <EditItem itemId={childItem.itemId} value={listId} setChangeName={setChangeName}/>
                            :
                            childItem.itemName
                        }
                        onDoubleClick={((e)=>{ setChangeName(true);e.stopPropagation(); })}
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? 'text.disabled' : 'text.primary',
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
                    parentId={childItem.itemId}
                    parentPriority={childItem.itemPriorityLevel}
                    onClose={onCloseChildForm}
                />
            )}
        </>
    );
    return null;
};

export default ChildItem;
