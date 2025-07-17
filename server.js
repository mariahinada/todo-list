const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

// middlewares
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// conecta com o mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// rota de teste
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
