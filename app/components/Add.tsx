import { Form } from "@remix-run/react";
import { FC } from "react";
import { IoAddSharp, IoCloseSharp } from "react-icons/io5";

interface AddProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
}

const Add: FC<AddProps> = ({ handleSubmit, title, setTitle }) => {
  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full p-3 bg-cyan-600/50 rounded-md flex justify-center items-center gap-3 border-2 border-cyan-600"
    >
      <div className="relative w-full">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-md border-2 border-cyan-600 font-bold text-xl"
        />
        {title && (
          <span
            className="absolute right-2 top-3 cursor-pointer text-gray-500"
            onClick={() => setTitle("")}
          >
            <IoCloseSharp size={25} />
          </span>
        )}
      </div>
      <button
        type="submit"
        className={`${
          title.trim()
            ? "bg-cyan-400 hover:bg-cyan-500 border-2 border-cyan-700/60 rounded-full p-1 duration-300 ease-in-out"
            : "bg-slate-200 rounded-full p-1 cursor-not-allowed border-gray-400"
        } text-black`}
        disabled={!title.trim()}
      >
        <IoAddSharp size={35} />
      </button>
    </Form>
  );
};

export default Add;
