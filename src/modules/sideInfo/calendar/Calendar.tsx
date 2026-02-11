import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Badge, Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import useToDoStore from '../../../store/todoStore/ToDoStore';
import { useShallow } from 'zustand/shallow';

/**
 * Componente de Calendario que permite asignar fechas límite a los ítems
 * y visualizar los ítems con fechas límite asignadas.
 */
const Calendar = ({ itemId }: { itemId: string }) => {
    // Obtenemos los ítems y la acción para establecer la fecha límite del store
    const items = useToDoStore(useShallow((state) => state.items));
    const setDeadline = useToDoStore((state) => state.setDeadline);

    // Ítem seleccionado actualmente
    const thisItem = items[itemId];

    // Función para manejar el cambio de fecha
    const handleDateChange = (date: Dayjs | null) => {
        if (itemId && date) {
            // Guardamos la fecha en formato ISO
            setDeadline(itemId, date.toISOString());
        }
    };

    // Obtenemos todas las fechas límite de todos los ítems para resaltarlas
    const highlightedDays = Object.values(items)
        .map(item => item.itemDeadline)
        .filter((deadline): deadline is string => !!deadline)
        .map(deadline => dayjs(deadline).format('YYYY-MM-DD'));

    /**
     * Componente personalizado para renderizar los días del calendario.
     * Añade un pequeño punto (Badge) si el día tiene una tarea con fecha límite.
     */
    const ServerDay = (props: PickersDayProps) => {
        const { day, outsideCurrentMonth, ...other } = props;

        const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(day.format('YYYY-MM-DD')) >= 0;

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                badgeContent={isSelected ? '•' : undefined}
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
                            Establecer fecha límite para: <strong>{thisItem.itemName}</strong>
                        </Typography>
                        <DateCalendar
                            value={thisItem.itemDeadline ? dayjs(thisItem.itemDeadline) : null}
                            onChange={handleDateChange}
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