import { FC, useState } from "react";
import { IoCloseSharp, IoPencilSharp, IoCheckmarkSharp } from "react-icons/io5";

interface Item {
  complete: boolean;
  title: string;
}

interface CreateListProps {
  items: Item[];
  handleDelete: (index: number) => void;
  handleCreateList: () => void;
  handleEdit: (index: number, newTitle: string) => void;
}

const CreateList: FC<CreateListProps> = ({
  items,
  handleDelete,
  handleCreateList,
  handleEdit,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (index: number, currentTitle: string) => {
    setEditingIndex(index);
    setEditTitle(currentTitle);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditTitle("");
  };

  const confirmEditing = () => {
    if (editingIndex !== null) {
      handleEdit(editingIndex, editTitle);
      cancelEditing();
    }
  };

  return (
    <div className="w-full p-3 bg-cyan-600/50 rounded-md flex flex-col justify-center items-center gap-3 border-2 border-cyan-600 ease-in-out duration-500">
      <ul className="w-full flex flex-col gap-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li
              key={index}
              className={`w-full p-2 rounded-md flex justify-between items-center hover:border-cyan-800 hover:cursor-pointer ease-in-out duration-500 border-2 border-cyan-600 ${
                editingIndex === index ? `bg-cyan-600` : `bg-transparent`
              }`}
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-cyan-600 font-bold text-xl"
                  />
                  <button
                    onClick={confirmEditing}
                    className="p-2 font-bold ease-in-out duration-500 rounded-full bg-green-200 hover:bg-green-300 border-2 border-cyan-700/60"
                  >
                    <IoCheckmarkSharp size={30} color="green" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-2 font-bold ease-in-out duration-500 rounded-full bg-red-200 hover:bg-red-300 border-2 border-cyan-700/60"
                  >
                    <IoCloseSharp size={30} color="red" />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold text-xl">{item.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(index, item.title)}
                      className="p-2 font-bold ease-in-out duration-500 rounded-full bg-slate-200 hover:bg-slate-300 border-2 border-cyan-700/60"
                    >
                      <IoPencilSharp size={30} color="black" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 font-bold ease-in-out duration-500 rounded-full bg-slate-200 hover:bg-slate-300 border-2 border-cyan-700/60"
                    >
                      <IoCloseSharp size={30} color="black" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <h3 className="font-bold text-xl text-center">Список пуст</h3>
        )}
      </ul>
      <button
        onClick={handleCreateList}
        className={`p-3 ease-in-out duration-500 rounded-md border-2 ${
          items.length > 0
            ? "bg-cyan-400 hover:bg-cyan-500 border-cyan-700/60"
            : "bg-slate-200 cursor-not-allowed border-gray-400"
        } text-2xl text-black font-bold`}
        disabled={items.length === 0}
      >
        Отправить список
      </button>
    </div>
  );
};

export default CreateList;
