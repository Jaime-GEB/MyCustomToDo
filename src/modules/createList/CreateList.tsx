import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack
} from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import useToDoStore from "../../store/todoStore/ToDoStore";

const CreateList = ({ onSuccess }: { onSuccess?: () => void }) => {
    const addList = useToDoStore((store) => store.addList);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleAddList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addList(name, description);
        setName("");
        setDescription("");
        if (onSuccess) onSuccess();
    };
    return(
        <Box sx={{ display: 'flex', justifyContent: 'center',alignContent:'center', mt: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Stack spacing={3} component="form" onSubmit={handleAddList}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PlaylistAddIcon color="primary" fontSize="large" />
                        <Typography variant="h5" fontWeight="bold">
                            Nueva Lista de Tareas
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Nombre de la lista"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Compras, Trabajo, Metas..."
                        required
                        autoFocus
                    />

                    <TextField
                        fullWidth
                        label="Descripción (opcional)"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="¿De qué trata esta lista?"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!name.trim()}
                        sx={{
                            py: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        Crear Lista
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
export default CreateList;