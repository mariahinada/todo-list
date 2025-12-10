const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.js'); 
const Task = require('../models/Task');

router.get("/", authMiddleware, async (req, res) => {
    try {
        // --- LÓGICA DE PAGINAÇÃO ---
        const limit = parseInt(req.query.limit) || 5; // Define 5 tarefas por página (padrão)
        const page = parseInt(req.query.page) || 1;   // Começa na página 1 (padrão)
        const skip = (page - 1) * limit;              // Calcula quantos documentos pular

        // 1. Contar o total de tarefas do usuário
        const totalTasks = await Task.countDocuments({ user: req.user.id });
        const totalPages = Math.ceil(totalTasks / limit);

        // 2. Buscar as tarefas limitadas
        const tasks = await Task.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 3. Retornar tarefas e dados de paginação
        res.json({
            tasks,
            totalPages,
            currentPage: page,
            totalTasks
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no Servidor.");
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            user: req.user.id,
        });

        const task = await newTask.save();
        res.status(201).json(task); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no Servidor.");
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        let task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: { completed: req.body.completed } },
            { new: true }
        );

        if (!task) {
            return res
                .status(404)
                .json({ msg: "Tarefa não encontrada ou não autorizada." });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no Servidor.");
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const result = await Task.deleteOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ msg: "Tarefa não encontrada ou não autorizada." });
        }

        res.json({ msg: "Tarefa removida." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no Servidor.");
    }
});

module.exports = router;