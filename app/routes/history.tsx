import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getAllLists } from "services/listService";
import {
  IoChevronDown,
  IoChevronUp,
  IoCheckmarkSharp,
  IoCloseSharp,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
} from "react-icons/io5";

interface Item {
  complete: boolean;
  title: string;
}

interface List {
  id: number;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

interface LoaderData {
  lists: List[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "History Page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const lists = await getAllLists();
  return json<LoaderData>({ lists });
};

export default function History() {
  const { lists } = useLoaderData<LoaderData>();
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Группировка списков по датам
  const groupedLists = lists.reduce<Record<string, List[]>>((acc, list) => {
    const date = new Date(list.createdAt).toLocaleDateString("en-CA"); // "en-CA" to get yyyy-mm-dd format
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(list);
    return acc;
  }, {});

  // Сортировка групп по датам
  const sortedDates = Object.keys(groupedLists).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Функция для обработки кликов по датам
  const toggleDate = (date: string) => {
    setExpandedDates((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  // Функция для изменения порядка сортировки
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full h-fullflex flex-col justify-center items-start">
      <div className="w-full xl:w-[50%] lg:w-[60%] md:w-[70%] m-auto bg-slate-200 rounded-xl p-3 h-full flex flex-col justify-center items-center gap-3">
        <h1 className="p-3 text-cyan-500 text-3xl font-bold rounded-md">
          История покупок
        </h1>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 bg-cyan-500 text-white py-2 px-4 rounded-md font-bold text-lg hover:bg-cyan-600 border-2 border-cyan-600"
        >
          {sortOrder === "asc" ? (
            <>
              <IoArrowUpOutline size={24} />
              Сортировать по датам
            </>
          ) : (
            <>
              <IoArrowDownOutline size={24} />
              Сортировать по датам
            </>
          )}
        </button>
        <div className="w-full flex flex-col gap-4">
          {sortedDates.length === 0 ? (
            <p>История пуста</p>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="w-full">
                <div
                  className="flex justify-between items-center cursor-pointer bg-cyan-500 pt-2 py-2 px-5 rounded-md mb-2 ease-in-out duration-500 border-2 border-cyan-800"
                  onClick={() => toggleDate(date)}
                >
                  <h1 className="font-bold text-2xl text-white">
                    {"Дата: " + new Date(date).toLocaleDateString("ru-RU")}{" "}
                  </h1>
                  {/* Format date to dd.mm.yy */}
                  {expandedDates[date] ? (
                    <IoChevronUp size={30} color="white" />
                  ) : (
                    <IoChevronDown size={30} color="white" />
                  )}
                </div>
                {expandedDates[date] && (
                  <div className="h-[500px] flex flex-col gap-4 overflow-y-scroll">
                    {groupedLists[date]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((list) => (
                        <div
                          key={list.id}
                          className="p-4 rounded-xl shadow-md hover:bg-cyan-800/10 hover:border-cyan-400 hover:cursor-pointer ease-in-out duration-500 border-2 border-cyan-600"
                        >
                          <h2 className="text-2xl font-bold text-black-500 px-5">
                            Дата покупки:{" "}
                            {new Date(list.createdAt).toLocaleString("ru-RU")}
                          </h2>
                          <ul className="flex flex-col gap-3 p-3">
                            {list.items.map((item, index) => (
                              <li
                                key={`${list.id}-${index}`}
                                className="flex justify-between items-center px-3 py-2 border-2 border-cyan-600 rounded-xl"
                              >
                                <h3 className="font-bold text-xl">
                                  {item.title}
                                </h3>
                                {item.complete ? (
                                  <div className="flex justify-center items-center rounded-full bg-lime-600 p-1">
                                    <IoCheckmarkSharp size={30} color="white" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center rounded-full bg-red-600 p-1">
                                    <IoCloseSharp size={30} color="white" />
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
