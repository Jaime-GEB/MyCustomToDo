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
    //onOpenDrawer: (id: string) => void;
    createChild: string | null;
    showChildForm: boolean;
    onCloseChildForm: () => void;
    onDeployChildren: (id: string) => void;
    deployChildren: Set<string>;
    allItems: ToDoItem[];
}

import { motion, AnimatePresence } from "framer-motion";

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
    onCloseChildForm,
    onDeployChildren,
    deployChildren,
    //onOpenDrawer,
    createChild,
    allItems,
}: ChildItemProps) => {

    const [changeName, setChangeName] = useState(false)

    // Indentación en píxeles: 40px por nivel de prioridad para una jerarquía visual clara
    const indentPx = 40 * childItem.itemPriorityLevel;

    const index = parentIndex;

    // Determina el estado efectivo de completado (si el padre está completo, el hijo también lo está visualmente)
    const isCompleted = childItem.itemCompleted || parentIsCompleted;

    // Si el padre no está expandido, no renderizamos nada (no ocupa lugar en el DOM)
    if (!deployChildren.has(parentItem.itemId)) {
        return null;
    }

    // Solo renderizamos si este item es efectivamente hijo del padre proporcionado
    if (childItem.itemParent !== parentItem.itemId) {
        return null;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <ListItem
                disablePadding
                sx={{
                    ml: `${indentPx}px`,
                    width: `calc(100% - ${indentPx}px)`, // Calcula el ancho restante para evitar overflow
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
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
                            sx={{ mr: 10 - (childItem.itemPriorityLevel * 2), '&:hover': { color: 'text.disabled' } }}
                            onClick={((e) => { onDeployChildren(childItem.itemId); e.stopPropagation(); })}
                        >
                            {deployChildren.has(childItem.itemId) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="add-child"
                            onClick={() =>  onAddChildBtn(childItem.itemId)}
                            sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'info.main' } }}
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
                        primary={changeName ?
                            <EditItem itemId={childItem.itemId} value={listId} setChangeName={setChangeName} />
                            :
                            childItem.itemName
                        }
                        onDoubleClick={((e) => { setChangeName(true); e.stopPropagation(); })}
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? 'text.disabled' : 'text.primary',
                            transition: 'all 0.2s',
                            wordBreak: 'break-word',
                            display: 'block',
                            width: '50vw'
                        }}
                    />
                </ListItemButton>
            </ListItem>

            <AnimatePresence>
                {showChildForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <CreateChildForm
                            listId={listId}
                            parentId={childItem.itemId}
                            parentPriority={childItem.itemPriorityLevel}
                            onClose={onCloseChildForm}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Renderizado de hijos */}
            <AnimatePresence>
                {deployChildren.has(childItem.itemId) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-1.5 mt-1.5"
                    >
                        {allItems.filter(cf => cf.itemParent === childItem.itemId).map((cf) => {
                            const absoluteIndex = allItems.findIndex(i => i.itemId === cf.itemId);
                            return (
                                <ChildItem
                                    key={cf.itemId}
                                    parentItem={childItem}
                                    childItem={cf}
                                    parentIndex={absoluteIndex}
                                    parentIsCompleted={isCompleted}
                                    listId={listId}
                                    onToggle={onToggle}
                                    onRemove={onRemove}
                                    onReOrder={onReOrder}
                                    onAddChildBtn={onAddChildBtn}
                                    //onOpenDrawer={onOpenDrawer}
                                    createChild={createChild}
                                    showChildForm={createChild === cf.itemId}
                                    onCloseChildForm={onCloseChildForm}
                                    onDeployChildren={onDeployChildren}
                                    deployChildren={deployChildren}
                                    allItems={allItems}
                                />
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
    return null;
};

export default ChildItem;
