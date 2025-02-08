import { openDB } from 'idb';
import dayjs from 'dayjs';

export interface BaseTodo {
  title: string;
  completed: boolean;
  dueDate: string | null;
}

export interface Todo extends BaseTodo {
  id?: number;
}

export type NewTodo = BaseTodo;
export type UpdateTodo = Required<Todo>;

const dbName = 'todo-db';
const storeName = 'todos';
const version = 1;

const openTodoDB = async () => {
  return openDB(dbName, version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('dueDate', 'dueDate');
      }
    },
  });
};

export const addTodo = async (todo: NewTodo): Promise<number> => {
  const db = await openTodoDB();
  const id = await db.add(storeName, {
    ...todo,
    dueDate: todo.dueDate ? dayjs(todo.dueDate).format() : null,
  });
  return typeof id === 'number' ? id : parseInt(id.toString(), 10);
};

export const updateTodo = async (todo: UpdateTodo): Promise<number> => {
  const db = await openTodoDB();
  const id = await db.put(storeName, {
    ...todo,
    dueDate: todo.dueDate ? dayjs(todo.dueDate).format() : null,
  });
  return typeof id === 'number' ? id : parseInt(id.toString(), 10);
};

export const deleteTodo = async (id: number): Promise<void> => {
  const db = await openTodoDB();
  await db.delete(storeName, id);
};

export const getAllTodos = async (): Promise<Todo[]> => {
  const db = await openTodoDB();
  const todos = await db.getAll(storeName);
  return todos.map(todo => ({
    ...todo,
    dueDate: todo.dueDate ? dayjs(todo.dueDate).format() : null,
  }));
};
