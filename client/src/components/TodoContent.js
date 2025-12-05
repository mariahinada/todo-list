import React, { useState, useEffect } from "react";

const TodoContent = ({ setAuth }) => {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const API_URL = "http://localhost:3001/api/tasks";

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(API_URL, {
                headers: {
                    "x-auth-token": token,
                },
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                setAuth(false);
                return;
            }

            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
                body: JSON.stringify({ title: newTitle }),
            });
            
            if (res.ok) {
                const createdTask = await res.json();
                setTasks([...tasks, createdTask]);
                setNewTitle("");
            } else {
                console.error("Falha ao adicionar tarefa:", res.status);
            }
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = getToken();
        if (!token) return;

        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: "DELETE",
                headers: {
                    "x-auth-token": token,
                },
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    };

    const handleToggleComplete = async (task) => {
        const token = getToken();
        if (!token) return;
        
        const updatedStatus = { completed: !task.completed };

        try {
            const res = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
                body: JSON.stringify(updatedStatus),
            });
            
            if (res.ok) {
                setTasks(tasks.map(t =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                ));
            } else {
                console.error("Falha ao atualizar status:", res.status);
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    return (
        <div className="content-wrapper">
            <h2>Lista de Tarefas</h2> 
            <form onSubmit={handleAddTask} className="add-task-form">
                <input 
                    type="text" 
                    placeholder="Adicionar nova tarefa..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task._id} className="task-item">
                        {/* Checkbox para completar */}
                        <input 
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task)} 
                        />
                        
                        {/* Título */}
                        <span 
                            className={`task-title ${task.completed ? 'completed' : ''}`}
                        >
                            {task.title}
                        </span>
                        
                        {/* Botão de Deletar */}
                        <button 
                            className="delete-button" 
                            onClick={() => handleDeleteTask(task._id)}
                        >
                            X
                        </button>
                    </li>
                ))}
                {tasks.length === 0 && <p style={{textAlign: 'center', color: '#999'}}>Nenhuma tarefa encontrada.</p>}
            </ul>
        </div>
    );
};

export default TodoContent;