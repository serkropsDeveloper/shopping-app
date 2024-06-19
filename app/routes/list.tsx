import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import {
  getLastList,
  updateItemCompleteStatus,
  markListAsDone,
} from "services/listService";

interface Item {
  complete: boolean;
  title: string;
}

interface List {
  id: number;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  history: { id: number; action: string; listId: number; timestamp: string }[];
}

interface LoaderData {
  list: List | null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "List Page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const list = await getLastList();
  return json<LoaderData>({ list });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const listId = Number(formData.get("listId"));
  const itemIndex = Number(formData.get("itemIndex"));
  const complete = formData.get("complete") === "true";
  const actionType = formData.get("actionType");

  if (actionType === "updateItemStatus") {
    if (isNaN(listId) || isNaN(itemIndex)) {
      return json({ error: "Invalid form submission" }, { status: 400 });
    }

    try {
      await updateItemCompleteStatus(listId, itemIndex, complete);
      return json({ success: true });
    } catch (error) {
      console.error(error);
      return json({ error: error.message }, { status: 500 });
    }
  } else if (actionType === "markAsDone") {
    try {
      await markListAsDone(listId);
      return json({ success: true });
    } catch (error) {
      console.error(error);
      return json({ error: error.message }, { status: 500 });
    }
  }

  return json({ error: "Invalid action type" }, { status: 400 });
};

export default function List() {
  const { list } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [items, setItems] = useState(list ? list.items : []);

  if (!list) {
    return (
      <div className="w-full h-full bg-slate-100 p-4 flex flex-col justify-center items-center gap-3 border">
        <p className="p-3 text-cyan-500 text-3xl font-bold rounded-md">
          Список пуст
        </p>
      </div>
    );
  }

  const handleCheckboxChange = (index: number, complete: boolean) => {
    // Мгновенное обновление состояния на клиенте
    const newItems = items.map((item, i) =>
      i === index ? { ...item, complete } : item
    );
    setItems(newItems);

    // Отправка запроса на сервер
    fetcher.submit(
      {
        listId: list.id.toString(),
        itemIndex: index.toString(),
        complete: complete.toString(),
        actionType: "updateItemStatus",
      },
      { method: "post" }
    );
  };

  const handleItemClick = (index: number, currentComplete: boolean) => {
    handleCheckboxChange(index, !currentComplete);
  };

  const handleDoneClick = () => {
    fetcher.submit(
      {
        listId: list.id.toString(),
        actionType: "markAsDone",
      },
      { method: "post" }
    );
  };

  return (
    <div className="w-full xl:w-[50%] lg:w-[60%] md:w-[70%] h-full m-auto bg-slate-200 rounded-xl p-4 flex flex-col justify-center items-center gap-3 border">
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="p-3 text-cyan-500 text-3xl font-bold rounded-md">
          Список на день
        </h1>
        <ul className="w-full flex flex-col gap-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="w-full p-2 rounded-md flex justify-between items-center hover:bg-cyan-600/50 hover:border-cyan-800 hover:cursor-pointer ease-in-out duration-500 border-2 border-cyan-600"
              onClick={() => handleItemClick(index, item.complete)}
            >
              <span className="font-bold text-xl">{item.title}</span>
              <input
                type="checkbox"
                checked={item.complete}
                onChange={() => handleItemClick(index, item.complete)}
                className="form-checkbox w-8 h-8 text-cyan-600 border-gray-300 rounded-full focus:ring-cyan-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
        <button
          onClick={handleDoneClick}
          className="w-48 p-3 ease-in-out duration-500 rounded-md border-2 text-2xl text-white font-bold bg-cyan-400 hover:bg-cyan-500 border-cyan-700/60"
        >
          Куплено
        </button>
      </div>
    </div>
  );
}
