import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here

    const { title, priority, tags = [], dueDate, completed = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: { message: "title is required" } });
    }

    const cleanTitle = title.trim();

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ error: { message: "Invalid priority" } });
    }

    const todo = await Todo.create({
      title: cleanTitle,
      priority,
      tags,
      dueDate,
      completed,
    });

    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here

    let { page = 1, limit = 10, completed, priority, search } = req.query;

    const filters = {};

    page = Math.max(parseInt(page), 1);
    limit = Math.max(parseInt(limit), 1);

    if (completed !== undefined) {
      filters.completed = completed === "true";
    }

    if (priority) {
      filters.priority = priority;
    }

    if (search) {
      filters.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Todo.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Todo.countDocuments(filters),
    ]);

    const pages = Math.ceil(total / limit);

    return res
      .status(200)
      .json({ data: data, meta: { total, page, limit, pages } });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here

    const todoId = req.params.id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code heref

    const { title, priority, tags, completed, dueDate } = req.body;

    const todoUpdates = { title, priority, tags, completed, dueDate };

    const todoId = req.params.id;

    const todo = await Todo.findByIdAndUpdate(
      todoId,
      { $set: todoUpdates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here

    const todoId = req.params.id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    todo.completed = !todo.completed;

    await todo.save();

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const todoId = req.params.id;

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
}
