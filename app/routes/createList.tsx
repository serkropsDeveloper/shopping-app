import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { createList } from "services/listService";

interface Item {
  complete: boolean;
  title: string;
}

interface ActionData {
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const itemsString = formData.get("items");

  if (typeof itemsString !== "string") {
    return json<ActionData>(
      { error: "Invalid form submission" },
      { status: 400 }
    );
  }

  const items: Item[] = JSON.parse(itemsString);

  try {
    await createList(items);
    return redirect("/list");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return json<ActionData>({ error: error.message }, { status: 500 });
    }
    return json<ActionData>(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
};

export default function CreateList() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Create List</h1>
      <Form method="post">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify([{ complete: false, title: "Example" }])}
        />
        <button type="submit">Create</button>
      </Form>
      {actionData?.error && <p>Error: {actionData.error}</p>}
    </div>
  );
}
