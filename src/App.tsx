import { Toaster } from "sonner";
import Todo from "./Todo";

function App() {
  return (
    <>
      <Toaster position='top-right' />
      <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 '>
        <Todo />
      </main>
    </>
  );
}

export default App;
