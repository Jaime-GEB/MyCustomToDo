import { ItemParent } from './StoreTypes.d';
// ---------- IDs y enums ----------

export type ToDoListId = string;
export type ToDoItemId = string;

export type ItemParent = ToDoItemId | null;

export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type Filter = "all" | "active" | "completed";

// ---------- Entidades (normalizadas) ----------

export interface ToDoList {
  listId: ToDoListId;
  listName: string;
  listDescription: string;
}

export interface ToDoItem {
  itemId: ToDoItemId;
  itemName: string;
  itemCompleted: boolean;
  itemDescription: string;
  itemPriorityLevel: PriorityLevel;
  itemParent: ItemParent
  listId: ToDoListId;
  alarmTime: string | null
}

// ---------- Estado del store ----------

export interface ToDoState {
  // Entidades
  currentListId: ToDoListId | 'new';
  lists: Record<ToDoListId, ToDoList>;
  items: Record<ToDoItemId, ToDoItem>;

  // Orden
  listsOrder: ToDoListId[];                       // orden de listas
  itemsOrderByList: Record<ToDoListId, ToDoItemId[]>; // orden de items por lista

  //Filtros por lista
  itemsFilterByList?: Record<ToDoListId, Filter>;

  // ---------- Selectores ----------
  getAllLists: () => ToDoList[];                          // usa listsOrder
  getItemsInList: (listId: ToDoListId) => ToDoItem[];     // usa itemsOrderByList[listId]
  getVisibleItemsInList: (listId: ToDoListId) => ToDoItem[]; // aplica itemsFilterByList
  getStatsByList: (listId: ToDoListId) => {
    total: number;
    active: number;
    completed: number;
  };

  // ---------- Acciones sobre listas ----------
  setCurrentList: (listId: ToDoListId) => void;
  addList: (listName: string, listDescription: string) => void;
  editList: (listId: ToDoListId, fields: Partial<Pick<ToDoList, "listName" | "listDescription">>) => void;
  removeList: (listId: ToDoListId, options?: { cascadeItems?: boolean }) => void; // decide si borras sus items
  reorderLists: (fromIndex: number, toIndex: number) => void;

  // ---------- Acciones sobre items ----------
  addItem: (
    listId: ToDoListId,
    itemName: string,
    itemDescription: string,
    priority: PriorityLevel,
    itemParent: ItemParent
  ) => void;

  editItem: (
    itemId: ToDoItemId,
    fields: Partial<Pick<ToDoItem, "itemName" | "itemDescription" | "itemPriorityLevel" | "itemCompleted">>
  ) => void;

  toggleItem: (itemId: ToDoItemId) => void;
  removeItem: (itemId: ToDoItemId) => void;

  reorderItems: (listId: ToDoListId, fromIndex: number, toIndex: number) => void;

  // mover entre listas (cambia pertenencia + orden)
  moveItem: (itemId: ToDoItemId, toListId: ToDoListId, toIndex?: number) => void;

  setAlarm: (itemId: ToDoItemId, alarmTime: string|null) => void;

  // ---------- Hidrataciones ----------
  hydrate: (payload: {
    lists: ToDoList[];
    items: ToDoItem[];
    listsOrder?: ToDoListId[];
    itemsOrderByList?: Record<ToDoListId, ToDoItemId[]>;
  }) => void;
}