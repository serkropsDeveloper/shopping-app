// src/services/listService.ts
import prisma from "../prisma/client";
import { Prisma } from "@prisma/client";

interface Item {
  complete: boolean;
  title: string;
}

// Создание списка
export async function createList(items: Item[]) {
  try {
    const list = await prisma.list.create({
      data: {
        items: items as unknown as Prisma.JsonArray,
        history: {
          create: {
            action: "created",
          },
        },
      },
    });

    console.log("Created List:", list);
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}

// Получение последнего списка без флага done
export async function getLastList() {
  const lists = await prisma.list.findMany({
    where: {
      done: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      history: true,
    },
  });

  if (lists.length === 0) {
    return null;
  }

  return {
    ...lists[0],
    items: lists[0].items as unknown as Item[],
  };
}

// Обновление состояния элемента списка
// export async function updateItemCompleteStatus(
//   listId: number,
//   itemIndex: number,
//   complete: boolean
// ) {
//   const list = await prisma.list.findUnique({
//     where: { id: listId },
//   });

//   if (!list) {
//     throw new Error("List not found");
//   }

//   const updatedItems = list.items as unknown as Item[];
//   updatedItems[itemIndex].complete = complete;

//   await prisma.list.update({
//     where: { id: listId },
//     data: {
//       items: updatedItems as unknown as Prisma.JsonArray,
//       history: {
//         create: {
//           action: "updated",
//         },
//       },
//     },
//   });
// }

export async function getAllLists() {
  const lists = await prisma.list.findMany({
    include: {
      history: true,
    },
  });

  return lists.map((list) => ({
    ...list,
    items: list.items as unknown as Item[],
  }));
}

// Обновление состояния элемента списка
export async function updateItemCompleteStatus(
  listId: number,
  itemIndex: number,
  complete: boolean
) {
  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  if (!list) {
    throw new Error("List not found");
  }

  const updatedItems = list.items as unknown as Item[];
  updatedItems[itemIndex].complete = complete;

  await prisma.list.update({
    where: { id: listId },
    data: {
      items: updatedItems as unknown as Prisma.JsonArray,
      history: {
        create: {
          action: "updated",
        },
      },
    },
  });
}

// Установка флага done у списка
export async function markListAsDone(listId: number) {
  await prisma.list.update({
    where: { id: listId },
    data: {
      done: true,
      history: {
        create: {
          action: "marked as done",
        },
      },
    },
  });
}
