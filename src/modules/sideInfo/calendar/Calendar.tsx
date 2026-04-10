import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Badge, Box, Typography, Button, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import useToDoStore from '../../../store/todoStore/ToDoStore';
import { useShallow } from 'zustand/shallow';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';

/**
 * Componente de Calendario que permite gestionar fechas límite de forma manual
 */
const Calendar = ({ itemId }: { itemId: string }) => {
    const items = useToDoStore(useShallow((state) => state.items));
    const setDeadline = useToDoStore((state) => state.setDeadline);

    const thisItem = items[itemId];

    // Estado local para la fecha seleccionada en el calendario (sin guardar aún)
    const [tempDate, setTempDate] = useState<Dayjs | null>(
        thisItem?.itemDeadline ? dayjs(thisItem.itemDeadline) : null
    );


    const handleSaveDate = () => {
        if (itemId && tempDate) {
            setDeadline(itemId, tempDate.toISOString());
        }
    };

    const handleRemoveDate = () => {
        if (itemId) {
            setDeadline(itemId, null);
            setTempDate(null);
        }
    };

    const highlightedDays = Object.values(items)
        .map(item => item.itemDeadline)
        .filter((deadline): deadline is string => !!deadline)
        .map(deadline => dayjs(deadline).format('YYYY-MM-DD'));

    const ServerDay = (props: PickersDayProps) => {
        const { day, outsideCurrentMonth, ...other } = props;
        const isHighlighted = !props.outsideCurrentMonth && highlightedDays.indexOf(day.format('YYYY-MM-DD')) >= 0;

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                badgeContent={isHighlighted ? '•' : undefined}
                color="secondary"
            >
                <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
            </Badge>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="flex flex-col items-center w-full">
                {thisItem ? (
                    <>
                        <Typography variant="body2" className="mb-2 opacity-70">
                            Gestionar fecha para: <strong>{thisItem.itemName}</strong>
                        </Typography>

                        <DateCalendar
                            value={tempDate}
                            onChange={(newValue) => setTempDate(newValue)}
                            slots={{
                                day: ServerDay,
                            }}
                            sx={{
                                width: '100%',
                                '& .MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        />

                        <AnimatePresence mode="popLayout">
                            <Stack direction="row" spacing={2} className="mt-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EventAvailableIcon />}
                                        onClick={handleSaveDate}
                                        disabled={!tempDate || tempDate.toISOString() === thisItem.itemDeadline}
                                    >
                                        Añadir Fecha
                                    </Button>
                                </motion.div>

                                {thisItem.itemDeadline && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<EventBusyIcon />}
                                            onClick={handleRemoveDate}
                                        >
                                            Eliminar Fecha
                                        </Button>
                                    </motion.div>
                                )}
                            </Stack>
                        </AnimatePresence>
                    </>
                ) : (
                    <Typography variant="body2" color="error">
                        Selecciona un ítem para ver el calendario.
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default Calendar;