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
import ChildItem from "./items/ChildItem";
import SideInfo from "../sideInfo/SideInfo";
import { MainBody } from "./components/customComponents";

/**
 * Componente principal que renderiza la lista de tareas.
 * Gestiona el estado local de la creación de subtareas y coordina la renderización de items principales y secundarios.
 */
const MainToDo = ({ value }: { value: string }) => {
    const list = useToDoStore((state) => state.lists[value]);
    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const allItems = useToDoStore((state) => state.items);
    const toggleItem = useToDoStore((state) => state.toggleItem);
    const removeItem = useToDoStore((state) => state.removeItem);
    const reorderItems = useToDoStore((state) => state.reorderItems);

    const [createChild, setCreateChild] = useState<ItemParent>('');
    const [childBtnClicked, setChildBtnClicked] = useState(false);
    const [openDrawer, setOpenDrawer] = useState('');

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
        !childBtnClicked ? setCreateChild(itemParent) : setCreateChild('');
    };

    /**
     * Maneja el reordenamiento manual de los ítems en la lista.
     */
    const handleReOrder = (currentIndex: number, direction: 'up' | 'down') => {
        const upIndex = currentIndex - 1;
        const downIndex = currentIndex + 1;
        if (direction === 'up' && currentIndex > 0) reorderItems(list.listId, currentIndex, upIndex);
        if (direction === 'down' && currentIndex < items.length - 1) reorderItems(list.listId, currentIndex, downIndex);
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
                    {items.map((item, index) => (
                        item.itemCompleted === false ? (
                            <Box key={item.itemId}>
                                <MainItem
                                    item={item}
                                    index={index}
                                    listId={value}
                                    onToggle={toggleItem}
                                    onRemove={removeItem}
                                    onReOrder={handleReOrder}
                                    onAddChildBtn={handleChildBtn}
                                    onOpenDrawer={handleOpenDrawer}
                                    showChildForm={createChild === item.itemId}
                                    onCloseChildForm={() => setCreateChild('')}
                                />
                                <ChildItem
                                    parentItem={item.itemParent ? allItems[item.itemParent] || item : item}
                                    childItem={item}
                                    parentIndex={item.itemParent ? items.findIndex(i => i.itemId === item.itemParent) : -1}
                                    parentIsCompleted={item.itemParent ? allItems[item.itemParent]?.itemCompleted ?? false : false}
                                    listId={value}
                                    onToggle={toggleItem}
                                    onRemove={removeItem}
                                    onReOrder={handleReOrder}
                                    onAddChildBtn={handleChildBtn}
                                    showChildForm={createChild === item.itemId}
                                    onCloseChildForm={() => setCreateChild('')}
                                />
                            </Box>
                        ) : null
                    ))}
                </List>
                <CompletedList value={value} />
            </MainBody>

            {
                openDrawer === '' ?
                    null
                    :
                    <Drawer variant="persistent" open={openDrawer !== ''} onClose={handleCloseDrawer} anchor="right">
                        <SideInfo itemId={openDrawer} value={value}/>
                    </Drawer>

            }
        </Box >

    );
};

export default MainToDo;