import { routeLoader$, routeAction$, type RequestEventBase } from "@builder.io/qwik-city";
import { tursoClient } from "~/utils/turso";

// GET - Read all frameworks
export const useGetFrameworks = routeLoader$(
  async (requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent);
    const { rows } = await db.execute("SELECT * FROM frameworks ORDER BY created_at DESC");
    return { frameworks: rows };
  }
);

// POST - Create new framework
export const useCreateFramework = routeAction$(
  async (data, requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent);
    const { name, description } = data;
    
    if (!name || typeof name !== 'string') {
      return { success: false, error: 'Name is required' };
    }

    try {
      await db.execute("INSERT INTO frameworks (name, description) VALUES (?, ?)", [name as string, (description || '') as string]);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create framework' };
    }
  }
);

// PUT - Update framework
export const useUpdateFramework = routeAction$(
  async (data, requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent);
    const { id, name, description } = data;
    
    if (!id || !name || typeof name !== 'string') {
      return { success: false, error: 'ID and name are required' };
    }

    try {
      await db.execute("UPDATE frameworks SET name = ?, description = ? WHERE id = ?", [name as string, (description || '') as string, id as number]);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update framework' };
    }
  }
);

// DELETE - Delete framework
export const useDeleteFramework = routeAction$(
  async (data, requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent);
    const { id } = data;
    
    if (!id) {
      return { success: false, error: 'ID is required' };
    }

    try {
      await db.execute("DELETE FROM frameworks WHERE id = ?", [id as number]);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete framework' };
    }
  }
); 