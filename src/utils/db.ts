import { openDB, IDBPDatabase } from 'idb';
import dayjs from 'dayjs';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: 'high' | 'medium' | 'low';
}

const DB_NAME = 'todo-app-db';
const STORE_NAME = 'todos';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbInstance;
};

export const getAllTodos = async () => {
  try {
    const db = await getDB();
    const todos = await db.getAll(STORE_NAME);
    return todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
    }));
  } catch (error) {
    console.error('Failed to get todos:', error);
    throw new Error('タスクの取得に失敗しました');
  }
};

export const addTodo = async (todo: {
  id: number;
  text: string;
  completed: boolean;
  dueDate: dayjs.Dayjs | null;
  priority: 'high' | 'medium' | 'low';
}) => {
  try {
    const db = await getDB();
    const todoToSave: Todo = {
      ...todo,
      dueDate: todo.dueDate ? todo.dueDate.format() : null,
    };
    await db.put(STORE_NAME, todoToSave);
  } catch (error) {
    console.error('Failed to add todo:', error);
    throw new Error('タスクの追加に失敗しました');
  }
};

export const updateTodo = async (todo: {
  id: number;
  text: string;
  completed: boolean;
  dueDate: dayjs.Dayjs | null;
  priority: 'high' | 'medium' | 'low';
}) => {
  try {
    const db = await getDB();
    const todoToUpdate: Todo = {
      ...todo,
      dueDate: todo.dueDate ? todo.dueDate.format() : null,
    };
    await db.put(STORE_NAME, todoToUpdate);
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw new Error('タスクの更新に失敗しました');
  }
};

export const deleteTodo = async (id: number) => {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw new Error('タスクの削除に失敗しました');
  }
};

export const deleteAllTodos = async () => {
  try {
    const db = await getDB();
    const keys = await db.getAllKeys(STORE_NAME);
    await Promise.all(keys.map(key => db.delete(STORE_NAME, key)));
  } catch (error) {
    console.error('Failed to delete all todos:', error);
    throw new Error('全タスクの削除に失敗しました');
  }
};
