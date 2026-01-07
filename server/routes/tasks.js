import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Apply authentication to all task routes
router.use(authenticate);

/* ======================================================
   VALIDATIONS
====================================================== */

// Create task validation (title REQUIRED)
const validateCreateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('tags').optional().isArray(),
  body('estimatedTime').optional().isInt({ min: 0 }),
  body('isImportant').optional().isBoolean()
];

// Update task validation (ALL OPTIONAL ❗)
const validateUpdateTask = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('tags').optional().isArray(),
  body('estimatedTime').optional().isInt({ min: 0 }),
  body('isImportant').optional().isBoolean()
];

/* ======================================================
   STATS ROUTE (🔥 MUST BE BEFORE /:id)
====================================================== */

router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      total,
      completed,
      inProgress,
      todo,
      highPriority
    ] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({ userId, status: 'in-progress' }),
      Task.countDocuments({ userId, status: 'todo' }),
      Task.countDocuments({ userId, priority: 'high' })
    ]);

    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return successResponse(res, {
      summary: {
        total,
        completed,
        inProgress,
        todo,
        highPriority
      },
      rates: {
        completionRate
      },
      lastUpdated: new Date()
    }, 'Statistics fetched successfully');

  } catch (error) {
    console.error('Stats error:', error);
    return errorResponse(res, error);
  }
});

/* ======================================================
   GET ALL TASKS
====================================================== */

router.get('/', async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Task.countDocuments(filter);

    return successResponse(res, {
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Tasks fetched successfully');

  } catch (error) {
    console.error('Get tasks error:', error);
    return errorResponse(res, error);
  }
});

/* ======================================================
   GET SINGLE TASK
====================================================== */

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return successResponse(res, task, 'Task fetched successfully');

  } catch (error) {
    console.error('Get task error:', error);
    return errorResponse(res, error);
  }
});

/* ======================================================
   CREATE TASK
====================================================== */

router.post('/', validateCreateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const lastTask = await Task.findOne({ userId: req.user._id })
      .sort({ position: -1 })
      .select('position');

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      ...req.body,
      userId: req.user._id,
      position
    });

    return successResponse(res, task, 'Task created successfully', 201);

  } catch (error) {
    console.error('Create task error:', error);
    return errorResponse(res, error);
  }
});

/* ======================================================
   UPDATE TASK (🔥 FIXED)
====================================================== */

router.put('/:id', validateUpdateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return successResponse(res, task, 'Task updated successfully');

  } catch (error) {
    console.error('Update task error:', error);
    return errorResponse(res, error);
  }
});

/* ======================================================
   DELETE TASK
====================================================== */

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return successResponse(res, null, 'Task deleted successfully');

  } catch (error) {
    console.error('Delete task error:', error);
    return errorResponse(res, error);
  }
});

export default router;
