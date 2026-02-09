import { Tabs, Tab, Tooltip } from '@mui/material';
import { Close, Add } from "@mui/icons-material"
import { useShallow } from "zustand/shallow";
import useToDoStore from "../../store/todoStore/ToDoStore";
import { type Dispatch, type SetStateAction } from "react";

const TabBar = ({ value, setValue }: { value: string, setValue: Dispatch<SetStateAction<string>> }) => {
    const allLists = useToDoStore(useShallow((store) => store.getAllLists()));
    const removeList = useToDoStore((store) => store.removeList);
    const setCurrentList = useToDoStore((store)=>store.setCurrentList)

    return (
        <section className="flex border-x-2 border-slate-200 dark:border-slate-800 w-[92%] h-10 items-center px-4">
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    alignItems: 'center',
                    minHeight: 40,
                    '& .MuiTabs-indicator': { display: 'none' }
                }}
                value={value}
                onChange={(_, tabKey) => setValue(tabKey)}
            >
                {allLists.map((list) => (
                    <Tooltip key={list.listId} title={list.listDescription}>
                        <Tab
                            value={list.listId}
                            label={list.listName}
                            onClick={() => setCurrentList(list.listId)}
                            icon={
                                <Close
                                    sx={{
                                        fontSize: 16,
                                        borderRadius: '50%',
                                        ml: 1,
                                        p: 0.2,
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeList(list.listId);
                                        setValue('new')
                                    }}
                                />
                            }
                            iconPosition="end"
                            sx={{
                                textTransform: 'none',
                                minHeight: 40,
                                py: 0.5,
                                px: 3,
                                mx: 0.25,
                                borderRadius: '10px 10px 0 0',
                                bgcolor: value === list.listId ? 'background.paper' : 'transparent',
                                border: '1px solid',
                                borderColor: value === list.listId ? 'divider' : 'transparent',
                                borderBottom: value === list.listId ? '1px solid transparent' : '1px solid transparent',
                                color: value === list.listId ? 'primary.main' : 'text.secondary',
                                transition: 'all 0.2s',
                                fontWeight: value === list.listId ? 600 : 400,
                                '&.Mui-selected': {
                                    bgcolor: 'background.paper',
                                    borderColor: 'divider',
                                    borderBottomColor: 'background.paper',
                                    zIndex: 1,
                                    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
                                },
                                '&:hover': {
                                    bgcolor: value === list.listId ? 'background.paper' : 'action.hover',
                                    borderColor: value === list.listId ? 'divider' : 'transparent'
                                }
                            }}
                        />
                    </Tooltip>
                ))}
                <Tooltip title="Crear Lista">
                    <Tab
                        value="new"
                        icon={<Add sx={{ fontSize: 22, color: value === "new" ? 'primary.main' : 'text.disabled', borderRadius: '50%', p: 0.2, '&:hover': { bgcolor: 'action.hover' } }} />}
                        iconPosition="start"
                        sx={{ minWidth: 48, minHeight: 40 }}
                    />
                </Tooltip>
            </Tabs>
        </section>
    );
}
export default TabBar;