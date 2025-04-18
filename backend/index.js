const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const lembretes = [
  { id: 1, texto: 'Pagar conta de luz' },
  { id: 2, texto: 'Enviar cobrança cliente X' }
];

app.get('/api/lembretes', (req, res) => {
  res.json(lembretes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
