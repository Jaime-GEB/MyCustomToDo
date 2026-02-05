import { useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    ListItemButton,
    ListItemIcon,
    Button, 
    Typography
} from "@mui/material";
import { DeleteOutline, ExpandMore, ExpandLess } from '@mui/icons-material';
import useToDoStore from "../../store/todoStore/ToDoStore";
import { useShallow } from "zustand/shallow";

const CompletedList = ({ value }: { value: string }) => {
    const [open, setOpen] = useState(false)

    const list = useToDoStore((state) => state.lists[value]);
    const items = useToDoStore(useShallow((state) => state.getVisibleItemsInList(value)));
    const toggleItem = useToDoStore((state) => state.toggleItem);
    const removeItem = useToDoStore((state) => state.removeItem);

    const handleOpenCompleted = () =>{
        setOpen(!open);
    }

    if (!list) return null;

    return (
        <section className="mt-10">
            <div className="my-5">
                <Button sx={{px:5, borderRadius:1}} onClick={handleOpenCompleted}>
                    <Typography sx={{mr:2}}>Completadas</Typography>   
                    {open?<ExpandLess/>:<ExpandMore/>}
                </Button>
            </div>
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }} hidden={!open}>
                {items.map((item) => (item.itemCompleted?
                    <ListItem
                        key={item.itemId}
                        disablePadding
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            '&:hover': {
                                borderColor: 'primary.light',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                            }
                        }}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => removeItem(item.itemId)}
                                sx={{ mr: 1, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                            >
                                <DeleteOutline />
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            disableRipple
                            sx={{ p: 1.5, pl: 3 }}
                        >
                            <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleItem(item.itemId); }}>
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
                                secondary={item.itemDescription}
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
                    : null
                ))}
            </List>
        </section>
    );
}
export default CompletedList;