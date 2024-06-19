import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  Outlet,
  useFetcher,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { createList, getAllLists } from "services/listService";
import Add from "~/components/Add";
import CreateList from "~/components/CreateList";

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
  lists: List[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Home Page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const lists = await getAllLists();
  return json<LoaderData>({ lists });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const itemsString = formData.get("items");

  if (typeof itemsString !== "string") {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  const items: Item[] = JSON.parse(itemsString);

  try {
    await createList(items);
    return redirect("/list");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 500 });
    }
    return json({ error: "An unknown error occurred" }, { status: 500 });
  }
};

export default function Index() {
  const { lists } = useLoaderData<LoaderData>();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newItem: Item = { complete: false, title: title };
    setItems([...items, newItem]);
    setTitle("");
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, newTitle: string) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, title: newTitle } : item
    );
    setItems(updatedItems);
  };

  const handleCreateList = () => {
    fetcher.submit(
      { items: JSON.stringify(items) },
      { method: "post", action: "/createList" }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && !fetcher.data.error) {
      setItems([]);
      navigate("/list");
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="w-full xl:w-[50%] lg:w-[60%] md:w-[70%] h-full m-auto bg-slate-200 rounded-xl p-4 flex flex-col justify-center items-center border">
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="p-3 text-cyan-500 text-3xl font-bold rounded-md">
          Добавить
        </h1>
        <Add handleSubmit={handleAddItem} title={title} setTitle={setTitle} />
        <CreateList
          items={items}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleCreateList={handleCreateList}
        />
      </div>
      <Outlet />
    </div>
  );
}
