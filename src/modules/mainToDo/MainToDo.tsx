import {
    List,
    Typography,
    Box,
    Drawer
} from "@mui/material";
import { useState } from "react";
import useToDoStore from "../../store/todoStore/ToDoStore";
import { useShallow } from "zustand/shallow";
import type { ItemParent } from "../../types/StoreTypes";
import CompletedList from './items/CompletedList';
import MainItem from "./items/MainItem";
import CreateItemForm from "./forms/CreateItemForm";
import SideInfo from "../sideInfo/SideInfo";
import { MainBody } from "./components/customComponents";

/**
 * Componente principal que renderiza la lista de tareas.
 * Gestiona el estado local de la creación de subtareas y coordina la renderización de items principales y secundarios.
 */
const MainToDo = ({ value }: { value: string }) => {
    const list = useToDoStore((state) => state.lists[value]);
    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const toggleItem = useToDoStore((state) => state.toggleItem);
    const removeItem = useToDoStore((state) => state.removeItem);
    const reorderItems = useToDoStore((state) => state.reorderItems);

    const [createChild, setCreateChild] = useState<ItemParent>('');
    const [childBtnClicked, setChildBtnClicked] = useState(false);
    const [openDrawer, setOpenDrawer] = useState('');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    if (!list) return null;

    const handleOpenDrawer = (item: string) => {
        setOpenDrawer(item)
    }
    const handleCloseDrawer = () => {
        setOpenDrawer('')
    }

    /**
     * Alterna la visibilidad del formulario para crear una subtarea.
     */
    const handleChildBtn = (itemParent: ItemParent) => {
        setChildBtnClicked(!childBtnClicked);
        if(childBtnClicked) setCreateChild(itemParent); 
        else setCreateChild('');
    };

    /**
     * Maneja el reordenamiento manual de los ítems en la lista.
     * Ahora busca el hermano anterior/siguiente para asegurar que el orden visual cambie.
     */
    const handleReOrder = (currentIndex: number, direction: 'up' | 'down') => {
        const item = items[currentIndex];
        if (!item) return;

        // Escogemos solo los hermanos (mismo padre o ambos sin padre)
        const siblings = items.filter(i => i.itemParent === item.itemParent);
        const siblingIndex = siblings.findIndex(i => i.itemId === item.itemId);

        let targetSiblingId: string | null = null;
        if (direction === 'up' && siblingIndex > 0) {
            targetSiblingId = siblings[siblingIndex - 1].itemId;
        } else if (direction === 'down' && siblingIndex < siblings.length - 1) {
            targetSiblingId = siblings[siblingIndex + 1].itemId;
        }

        if (targetSiblingId) {
            const targetIndex = items.findIndex(i => i.itemId === targetSiblingId);
            reorderItems(list.listId, currentIndex, targetIndex);
        }
    };

    const toggleExpand = (itemId: string) => {
        setExpandedItems(prev => {
            // MUY IMPORTANTE: Crear una copia del Set anterior
            const newSet = new Set(prev);

            if (newSet.has(itemId)) {
                newSet.delete(itemId); // Si ya estaba, lo cerramos
            } else {
                newSet.add(itemId);    // Si no estaba, lo abrimos
            }

            return newSet; // Devolvemos la nueva instancia para disparar el re-render
        });
    };

    return (

        <Box>
            <MainBody sx={{ pb: 8 }} open={openDrawer !== ''} onClick={handleCloseDrawer}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ mb: 1, letterSpacing: '-0.02em', color: 'text.primary' }}>
                        {list.listName}
                    </Typography>
                    {list.listDescription && (
                        <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                            {list.listDescription}
                        </Typography>
                    )}
                </Box>

                <CreateItemForm listId={value} />

                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Renderizado unicamente de items padres */}
                    {items.filter(item => !item.itemParent).map((item) => {
                        const absoluteIndex = items.findIndex(i => i.itemId === item.itemId);
                        return item.itemCompleted === false ? (
                            <Box key={item.itemId}>
                                <MainItem
                                    item={item}
                                    index={absoluteIndex}
                                    listId={value}
                                    onToggle={toggleItem}
                                    onRemove={removeItem}
                                    onReOrder={handleReOrder}
                                    onAddChildBtn={handleChildBtn}
                                    onOpenDrawer={handleOpenDrawer}
                                    createChild={createChild} // Pasamos el ID del item siendo editado
                                    onCloseChildForm={() => setCreateChild('')}
                                    onDeployChildren={toggleExpand}
                                    deployChildren={expandedItems}
                                    allItems={items} // Pasamos la lista completa para buscar hijos
                                />
                            </Box>
                        ) : null
                    })}
                </List>
                <CompletedList value={value} />
            </MainBody>

            {
                openDrawer === '' ?
                    null
                    :
                    <Drawer variant="persistent" open={openDrawer !== ''} onClose={handleCloseDrawer} anchor="right">
                        <SideInfo itemId={openDrawer} value={value} />
                    </Drawer>

            }
        </Box >

    );
};

export default MainToDo;