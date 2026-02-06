import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    type ToDoListId,
    type ToDoItemId,
    type ToDoList,
    type ToDoItem,
    type ToDoState,
} from '../../types/StoreTypes';

/**
 * Genera un ID único para listas e ítems.
 */
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const useToDoStore = create<ToDoState>()(
    devtools(
        persist(
            (set, get) => ({

                /* --- ENTIDADES (Estado inicial) --- */
                lists: {},
                items: {},

                /* --- ORDEN --- */
                listsOrder: [],
                itemsOrderByList: {},

                /* --- FILTROS --- */
                itemsFilterByList: {},

                /* --- SELECTORES --- */

                /** Obtiene todas las listas en el orden definido. */
                getAllLists: () => {
                    const { lists, listsOrder } = get();
                    return listsOrder.map((listId) => lists[listId]).filter(Boolean);
                },

                /** Obtiene todos los ítems de una lista específica en su orden correspondiente. */
                getItemsInList: (listId) => {
                    const { items, itemsOrderByList } = get();
                    const itemIds = itemsOrderByList[listId] || [];
                    return itemIds.map((itemId) => items[itemId]).filter(Boolean);
                },

                /** Obtiene los ítems visibles de una lista aplicando el filtro activo ('all', 'active', 'completed'). */
                getVisibleItemsInList: (listId) => {
                    const { itemsFilterByList } = get();
                    const items = get().getItemsInList(listId);
                    const filter = itemsFilterByList ? itemsFilterByList[listId] : 'all';

                    if (filter === 'active') return items.filter(i => !i.itemCompleted);
                    if (filter === 'completed') return items.filter(i => i.itemCompleted);
                    return items;
                },

                /** Calcula estadísticas (total, activos, completados) de una lista. */
                getStatsByList: (listId) => {
                    const items = get().getItemsInList(listId);
                    return {
                        total: items.length,
                        active: items.filter(i => !i.itemCompleted).length,
                        completed: items.filter(i => i.itemCompleted).length
                    };
                },

                /* --- ACCIONES SOBRE LISTAS --- */

                /** Añade una nueva lista. */
                addList: (listName, listDescription) =>
                    set((state) => {
                        if (!listName.trim()) return state;

                        const listId = genId();
                        const newList: ToDoList = {
                            listId,
                            listName,
                            listDescription,
                        };

                        return {
                            lists: { ...state.lists, [listId]: newList },
                            listsOrder: [...state.listsOrder, listId],
                            itemsOrderByList: { ...state.itemsOrderByList, [listId]: [] }
                        };
                    }, false, 'lists/addList'),

                /** Edita campos específicos de una lista. */
                editList: (listId, fields) =>
                    set((state) => {
                        const list = state.lists[listId];
                        if (!list) return state;

                        return {
                            lists: {
                                ...state.lists,
                                [listId]: { ...list, ...fields }
                            }
                        };
                    }, false, 'lists/editList'),

                /** Elimina una lista y opcionalmente sus ítems asociados. */
                removeList: (listId, options) =>
                    set((state) => {
                        if (!state.lists[listId]) return state;

                        const { [listId]: _, ...remainingLists } = state.lists;
                        const newListsOrder = state.listsOrder.filter(id => id !== listId);

                        let newItems = state.items;
                        if (options?.cascadeItems) {
                            const itemIdsToRemove = state.itemsOrderByList[listId] || [];
                            newItems = { ...state.items };
                            itemIdsToRemove.forEach(id => delete newItems[id]);
                        }

                        const { [listId]: __, ...remainingOrders } = state.itemsOrderByList;
                        const { [listId]: ___, ...remainingFilters } = state.itemsFilterByList || {};

                        return {
                            lists: remainingLists,
                            listsOrder: newListsOrder,
                            items: newItems,
                            itemsOrderByList: remainingOrders,
                            itemsFilterByList: remainingFilters
                        };
                    }, false, 'lists/removeList'),

                /** Reordena las listas en el array de orden global. */
                reorderLists: (fromIndex, toIndex) =>
                    set((state) => {
                        const newOrder = [...state.listsOrder];
                        if (fromIndex < 0 || toIndex < 0 || fromIndex >= newOrder.length || toIndex >= newOrder.length) return state;

                        const [moved] = newOrder.splice(fromIndex, 1);
                        newOrder.splice(toIndex, 0, moved);
                        return { listsOrder: newOrder };
                    }, false, 'lists/reorderLists'),

                /* --- ACCIONES SOBRE ÍTEMS --- */

                /** Añade un ítem a una lista específica. */
                addItem: (listId, itemName, itemDescription, priority, itemParent) =>
                    set((state) => {
                        if (!state.lists[listId] || !itemName.trim()) return state;

                        const itemId = genId();
                        const newItem: ToDoItem = {
                            itemId,
                            listId,
                            itemName,
                            itemDescription,
                            itemPriorityLevel: priority,
                            itemParent,
                            itemCompleted: false,
                            alarmTime:null,
                        };

                        return {
                            items: { ...state.items, [itemId]: newItem },
                            itemsOrderByList: {
                                ...state.itemsOrderByList,
                                [listId]: [...(state.itemsOrderByList[listId] || []), itemId]
                            }
                        };
                    }, false, 'items/addItem'),

                /** Edita campos de un ítem. */
                editItem: (itemId, fields) =>
                    set((state) => {
                        const item = state.items[itemId];
                        if (!item) return state;

                        return {
                            items: {
                                ...state.items,
                                [itemId]: { ...item, ...fields }
                            }
                        };
                    }, false, 'items/editItem'),

                /** Alterna el estado de completado de un ítem. */
                toggleItem: (itemId) =>
                    set((state) => {
                        const item = state.items[itemId];
                        if (!item) return state;

                        const newCompletedStatus = !item.itemCompleted;

                        // Find all children of this item
                        const allItems = Object.values(state.items);
                        const childrenIds = allItems
                            .filter(i => i.itemParent === itemId)
                            .map(i => i.itemId);

                        const updatedItems = {
                            ...state.items,
                            [itemId]: { ...item, itemCompleted: newCompletedStatus }
                        };

                        // Update all children to match parent status
                        childrenIds.forEach(childId => {
                            if (updatedItems[childId]) {
                                updatedItems[childId] = {
                                    ...updatedItems[childId],
                                    itemCompleted: newCompletedStatus
                                };
                            }
                        });

                        return {
                            items: updatedItems
                        };
                    }, false, 'items/toggleItem'),

                /** Elimina un ítem. */
                removeItem: (itemId) =>
                    set((state) => {
                        const item = state.items[itemId];
                        if (!item) return state;

                        const { [itemId]: _, ...remainingItems } = state.items;
                        const listId = item.listId;
                        const newListOrder = (state.itemsOrderByList[listId] || []).filter(id => id !== itemId);

                        return {
                            items: remainingItems,
                            itemsOrderByList: {
                                ...state.itemsOrderByList,
                                [listId]: newListOrder
                            }
                        };
                    }, false, 'items/removeItem'),

                /** Reordena los ítems dentro de una lista. */
                reorderItems: (listId, fromIndex, toIndex) =>
                    set((state) => {
                        const itemIds = [...(state.itemsOrderByList[listId] || [])];
                        if (fromIndex < 0 || toIndex < 0 || fromIndex >= itemIds.length || toIndex >= itemIds.length) return state;

                        const [moved] = itemIds.splice(fromIndex, 1);
                        itemIds.splice(toIndex, 0, moved);

                        return {
                            itemsOrderByList: {
                                ...state.itemsOrderByList,
                                [listId]: itemIds
                            }
                        };
                    }, false, 'items/reorderItems'),

                /** Mueve un ítem de una lista a otra. */
                moveItem: (itemId, toListId, toIndex) =>
                    set((state) => {
                        const item = state.items[itemId];
                        if (!item || !state.lists[toListId]) return state;

                        const fromListId = item.listId;
                        if (fromListId === toListId) return state; // Podría usarse reorderItems aquí si se desea

                        // Eliminar de la lista origen
                        const fromOrder = (state.itemsOrderByList[fromListId] || []).filter(id => id !== itemId);

                        // Añadir a la lista destino
                        const toOrder = [...(state.itemsOrderByList[toListId] || [])];
                        if (typeof toIndex === 'number' && toIndex >= 0 && toIndex <= toOrder.length) {
                            toOrder.splice(toIndex, 0, itemId);
                        } else {
                            toOrder.push(itemId);
                        }

                        return {
                            items: {
                                ...state.items,
                                [itemId]: { ...item, listId: toListId }
                            },
                            itemsOrderByList: {
                                ...state.itemsOrderByList,
                                [fromListId]: fromOrder,
                                [toListId]: toOrder
                            }
                        };
                    }, false, 'items/moveItem'),

                // /** Elimina todos los ítems completados de una lista. */
                // clearCompletedInList: (listId) =>
                //     set((state) => {
                //         const itemIds = state.itemsOrderByList[listId] || [];
                //         const completedIds = itemIds.filter(id => state.items[id]?.itemCompleted);

                //         if (completedIds.length === 0) return state;

                //         const newItems = { ...state.items };
                //         completedIds.forEach(id => delete newItems[id]);

                //         const newOrder = itemIds.filter(id => !completedIds.includes(id));

                //         return {
                //             items: newItems,
                //             itemsOrderByList: {
                //                 ...state.itemsOrderByList,
                //                 [listId]: newOrder
                //             }
                //         };
                //     }, false, 'items/clearCompletedInList'),

                /** Establece una alarma para ese item */
                setAlarm: (itemId, alarmTime)=>
                    set((state)=>{
                        const item = state.items[itemId];
                        if (!item) return state;

                        return {
                            items: {
                                ...state.items,
                                [itemId]: { ...item, alarmTime:alarmTime }
                            }
                        };

                    }),


                /* --- HIDRATACIÓN --- */

                /** Hidrata el estado completo desde una carga útil externa. */
                hydrate: (payload) =>
                    set(() => {
                        const { lists = [], items = [], listsOrder, itemsOrderByList } = payload;

                        const listsMap: Record<ToDoListId, ToDoList> = {};
                        lists.forEach(l => {
                            if (l?.listId) listsMap[l.listId] = l;
                        });

                        const itemsMap: Record<ToDoItemId, ToDoItem> = {};
                        items.forEach(i => {
                            if (i?.itemId) itemsMap[i.itemId] = i;
                        });

                        return {
                            lists: listsMap,
                            items: itemsMap,
                            listsOrder: listsOrder || lists.filter(Boolean).map(l => l.listId),
                            itemsOrderByList: itemsOrderByList || {}
                        };
                    }, false, 'store/hydrate'),
            }),
            {
                name: 'todo-store',
                partialize: (state) => ({
                    lists: state.lists,
                    items: state.items,
                    listsOrder: state.listsOrder,
                    itemsOrderByList: state.itemsOrderByList,
                    itemsFilterByList: state.itemsFilterByList
                }),
            }
        ),
    )
);

export default useToDoStore;
