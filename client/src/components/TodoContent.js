import React, { useState, useEffect } from "react";

const TodoContent = ({ setAuth }) => {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Estado da página atual
    const [totalPages, setTotalPages] = useState(1);   // Estado do total de páginas
    const tasksPerPage = 5; // Número de tarefas por página (deve ser igual ao limite do backend)
    const API_URL = "http://localhost:3001/api/tasks";

    const getToken = () => localStorage.getItem("token");

    // useEffect para buscar tarefas na montagem E sempre que a página mudar
    useEffect(() => {
        fetchTasks();
    }, [currentPage]); 

    const fetchTasks = async () => {
        const token = getToken();
        if (!token) return;

        // Constrói a URL com os parâmetros de paginação
        const url = `${API_URL}?page=${currentPage}&limit=${tasksPerPage}`; 

        try {
            const res = await fetch(url, {
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
            
            // Pega a lista de tarefas e o total de páginas da resposta do backend
            setTasks(data.tasks); 
            setTotalPages(data.totalPages); 
            
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
                
                // Força o recarregamento para mostrar a nova tarefa, 
                // garantindo que a paginação esteja correta.
                // Se a tarefa adicionada estiver na página atual, atualiza a lista.
                // Aqui, forçamos a busca para atualizar a paginação corretamente:
                fetchTasks(); 
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
            
            // Após deletar, forçamos o recarregamento da página atualizada
            fetchTasks(); 
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
                // Atualiza o estado localmente (melhor performance)
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

    // Função para navegar entre as páginas
    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
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

            {/* CONTROLES DE PAGINAÇÃO */}
            {totalPages > 1 && ( 
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={() => goToPage(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Página Anterior
                    </button>
                    
                    <span style={{alignSelf: 'center'}}>Página {currentPage} de {totalPages}</span>

                    <button 
                        onClick={() => goToPage(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        Próxima Página
                    </button>
                </div>
            )}
        </div>
    );
};

export default TodoContent;