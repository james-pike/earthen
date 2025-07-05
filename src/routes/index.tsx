import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, routeAction$, type RequestEventBase } from "@builder.io/qwik-city";
import { tursoClient } from "~/utils/turso";

// Load frameworks data
export const useFrameworks = routeLoader$(
  async (requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent);
    const { rows } = await db.execute("SELECT * FROM frameworks ORDER BY created_at DESC");
    return { frameworks: rows };
  }
);

// Create framework action
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
      console.error('Create framework error:', error);
      return { success: false, error: 'Failed to create framework' };
    }
  }
);

// Update framework action
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
      console.error('Update framework error:', error);
      return { success: false, error: 'Failed to update framework' };
    }
  }
);

// Delete framework action
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
      console.error('Delete framework error:', error);
      return { success: false, error: 'Failed to delete framework' };
    }
  }
);

export default component$(() => {
  const frameworks = useFrameworks();
  const createFramework = useCreateFramework();
  const updateFramework = useUpdateFramework();
  const deleteFramework = useDeleteFramework();
  
  // Form signals
  const newName = useSignal('');
  const newDescription = useSignal('');
  const editingId = useSignal<number | null>(null);
  const editName = useSignal('');
  const editDescription = useSignal('');
  
  // Create new framework
  const handleCreate = $(async () => {
    if (!newName.value.trim()) return;
    
    const result = await createFramework.submit({
      name: newName.value,
      description: newDescription.value
    });
    
    if (result.value?.success) {
      newName.value = '';
      newDescription.value = '';
      // Refresh the page to show new data
      window.location.reload();
    }
  });
  
  // Start editing
  const startEdit = $((framework: any) => {
    editingId.value = framework.id;
    editName.value = framework.name;
    editDescription.value = framework.description || '';
  });
  
  // Save edit
  const handleUpdate = $(async () => {
    if (!editingId.value || !editName.value.trim()) return;
    
    const result = await updateFramework.submit({
      id: editingId.value,
      name: editName.value,
      description: editDescription.value
    });
    
    if (result.value?.success) {
      editingId.value = null;
      // Refresh the page to show updated data
      window.location.reload();
    }
  });
  
  // Cancel edit
  const cancelEdit = $(() => {
    editingId.value = null;
  });
  
  // Delete framework
  const handleDelete = $(async (id: number) => {
    if (confirm('Are you sure you want to delete this framework?')) {
      const result = await deleteFramework.submit({ id });
      if (result.value?.success) {
        // Refresh the page to show updated data
        window.location.reload();
      }
    }
  });
  
  return (
    <div class="container mx-auto p-6 max-w-4xl">
      <h1 class="text-3xl font-bold mb-6">Frameworks CRUD</h1>
      
      {/* Create Form */}
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">Add New Framework</h2>
        <div class="flex gap-4">
          <input
            type="text"
            placeholder="Framework name"
            value={newName.value}
            onInput$={(ev) => newName.value = (ev.target as HTMLInputElement).value}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDescription.value}
            onInput$={(ev) => newDescription.value = (ev.target as HTMLInputElement).value}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick$={handleCreate}
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Frameworks List */}
      <div class="space-y-4">
        {frameworks.value.frameworks.length > 0 ? (
          frameworks.value.frameworks.map((framework: any) => (
            <div key={framework.id} class="border border-gray-200 rounded-lg p-4">
              {editingId.value === framework.id ? (
                // Edit Mode
                <div class="space-y-3">
                  <div class="flex gap-4">
                    <input
                      type="text"
                      value={editName.value}
                      onInput$={(ev) => editName.value = (ev.target as HTMLInputElement).value}
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editDescription.value}
                      onInput$={(ev) => editDescription.value = (ev.target as HTMLInputElement).value}
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex gap-2">
                    <button
                      onClick$={handleUpdate}
                      class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Save
                    </button>
                    <button
                      onClick$={cancelEdit}
                      class="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold">{framework.name}</h3>
                    <p class="text-gray-600">{framework.description || 'No description'}</p>
                    <p class="text-sm text-gray-400 mt-1">Created: {new Date(framework.created_at).toLocaleDateString()}</p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      onClick$={() => startEdit(framework)}
                      class="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick$={() => handleDelete(framework.id)}
                      class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p class="text-gray-500 text-center py-8">No frameworks found.</p>
        )}
      </div>
      
      {/* Error Messages */}
      {createFramework.value?.error && (
        <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {createFramework.value.error}
        </div>
      )}
      {updateFramework.value?.error && (
        <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {updateFramework.value.error}
        </div>
      )}
      {deleteFramework.value?.error && (
        <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {deleteFramework.value.error}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
