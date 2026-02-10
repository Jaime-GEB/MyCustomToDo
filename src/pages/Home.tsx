import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import useToDoStore from "../store/todoStore/ToDoStore";
import CreateList from "../modules/createList/CreateList";
import MainToDo from "../modules/mainToDo/MainToDo";

const Home = () => {
    const updatedLists = useToDoStore(useShallow((state) => state.getAllLists()));
    const { currentListId } = useToDoStore()
    const [value, setValue] = useState<string>(currentListId);
    console.log(value);

    const handleSuccess = () => {
        if (updatedLists.length > 0) {
            setValue(updatedLists.at(-1)?.listId || value);
        }
    }

    return (
        <MainLayout value={value} setValue={setValue}>
            <section>
                {value === 'new' ?
                    <CreateList onSuccess={handleSuccess} />
                    :
                    <MainToDo value={value} />
                }
            </section>
        </MainLayout>

    );
}

export default Home;