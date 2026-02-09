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
import ChildItem from "./ChildItem";

interface MainItemProps {
    item: ToDoItem;
    index: number;
    listId: string;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    onReOrder: (index: number, direction: 'up' | 'down') => void;
    onAddChildBtn: (id: string) => void;
    onOpenDrawer: (item: string) => void;
    createChild: string | null;
    onCloseChildForm: () => void;
    onDeployChildren: (id: string) => void;
    deployChildren: Set<string>;
    allItems: ToDoItem[];
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
    onOpenDrawer,
    createChild,
    onCloseChildForm,
    onDeployChildren,
    deployChildren,
    allItems
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
                            sx={{ mr: 10, '&:hover': { color: 'text.disabled' } }}
                            onClick={((e) => { onDeployChildren(item.itemId); e.stopPropagation(); })}
                        >
                            {deployChildren.has(item.itemId) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="add-child"
                            onClick={() => { onAddChildBtn(item.itemId); onDeployChildren(item.itemId) }}
                            sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'info.main' } }}
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
                        onDoubleClick={((e) => { onOpenDrawer(item.itemId); e.stopPropagation(); })}
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

            {createChild === item.itemId && (
                <CreateChildForm
                    listId={listId}
                    parentId={item.itemId}
                    parentPriority={item.itemPriorityLevel}
                    onClose={onCloseChildForm}
                />
            )}

            {/* Renderizado de hijos */}
            {deployChildren.has(item.itemId) && (
                <div className="flex flex-col gap-1.5 mt-1.5">
                    {allItems.filter(child => child.itemParent === item.itemId).map((child) => {
                        const absoluteIndex = allItems.findIndex(i => i.itemId === child.itemId);
                        return (
                            <ChildItem
                                key={child.itemId}
                                parentItem={item}
                                childItem={child}
                                parentIndex={absoluteIndex}
                                parentIsCompleted={item.itemCompleted}
                                listId={listId}
                                onToggle={onToggle}
                                onRemove={onRemove}
                                onReOrder={onReOrder}
                                onAddChildBtn={onAddChildBtn}
                                //onOpenDrawer={onOpenDrawer}
                                createChild={createChild}
                                showChildForm={createChild === child.itemId}
                                onCloseChildForm={onCloseChildForm}
                                onDeployChildren={onDeployChildren}
                                deployChildren={deployChildren}
                                allItems={allItems}
                            />
                        )
                    })}
                </div>
            )}


        </>
    );
};

export default MainItem;
