import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  IconCircleCheck,
  IconPlus,
  IconSquare,
  IconSquareCheckFilled,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface Todo {
  id: string;
  name: string;
  completed: boolean;
  created_at: Date;
}

const Todo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) console.log("Error fetching", error);
    else setTodos(data);
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") return;
    const todo = {
      name: newTodo.trim(),
      completed: false,
    };

    const { data, error } = await supabase
      .from("TodoList")
      .insert([todo])
      .select()
      .single();
    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Task added successfully");
      setTodos((prev) => [data, ...prev]);
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: string, isComplete: boolean) => {
    const { error } = await supabase
      .from("TodoList")
      .update({ completed: isComplete })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Task updated successfully`);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: isComplete } : todo
        )
      );
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("TodoList").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Task deleted successfully");
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className='max-w-[800px] mt-10 mx-auto'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-8 text-center'>
          <h2 className='text-4xl font-bold text-gray-800 mb-2'>Todo List</h2>
        </div>
      </div>

      <div className='mb-6 shadow-lg border-0 rounded-lg bg-white'>
        <div className='flex flex-col space-y-1.5 p-6 pb-4'>
          <h3 className='flex font-semibold items-center gap-2 text-xl'>
            <IconPlus className='w-5 h-5 text-blue-600' />
            Add New Task
          </h3>
        </div>
        <div className='p-6 pt-0'>
          <div className='flex gap-2'>
            <input
              type='text'
              className='flex h-10 w-full rounded-md border border-gray-500 bg-white px-3 py-2 text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 flex-1'
              placeholder='What needs to be done?'
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
            />
            <button
              onClick={addTodo}
              className='bg-blue-600 hover:bg-blue-700 text-white rounded size-10 grid place-items-center'
            >
              <IconPlus className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <div className='mb-6 shadow-lg border-0 rounded-lg bg-white'>
          <div className='p-6'>
            <div className='flex items-center justify-between text-sm text-gray-600'>
              <span className='flex items-center gap-2'>
                <IconCircleCheck className='w-4 h-4' />
                {completedCount} of {totalCount} completed
              </span>
              <div className='flex gap-4'>
                <span>{totalCount - completedCount} remaining</span>
              </div>
            </div>
            <div className='mt-3 w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${
                    totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className='shadow-lg border-0 rounded-lg bg-white text-[#09090b]'>
        <div className='flex flex-col space-y-1.5 p-6'>
          <h3 className='flex font-semibold items-center gap-2 text-xl'>
            Tasks
          </h3>
        </div>
        <div className='p-6 pt-0'>
          {todos.length === 0 ? (
            <div className='text-center py-12'>
              <IconCircleCheck className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500 text-lg'>No tasks yet</p>
              <p className='text-gray-400 text-sm'>
                Add a task above to get started
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                    todo.completed
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <button onClick={() => toggleTodo(todo.id, !todo.completed)}>
                    {!todo.completed ? (
                      <IconSquare size={18} />
                    ) : (
                      <IconSquareCheckFilled
                        size={18}
                        className='text-blue-600'
                      />
                    )}
                  </button>
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-1 cursor-pointer transition-all duration-200 ${
                      todo.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.name}
                  </label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className='text-gray-400 hover:text-red-500 hover:bg-red-50'
                    aria-label='Delete task'
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Todo;
