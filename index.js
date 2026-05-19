const express = require('express');
const { execute, createObserveTellShareLoop } = require('./TOPH-Kernel-v1.0/isa256-kernel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'the.source',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});


app.get('/kernel/isa256/demo', (req, res) => {
  const iterations = Math.max(1, Number(req.query.iterations || 1));
  const program = createObserveTellShareLoop(iterations);
  const result = execute(program);

  res.json({
    status: 'ok',
    kernel: 'isa256',
    iterations,
    program,
    result,
  });
});

app.post('/kernel/isa256/execute', (req, res) => {
  try {
    const { program, seed } = req.body || {};
    const result = execute(program, seed);

    res.json({
      status: 'ok',
      kernel: 'isa256',
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`the.source API listening on port ${PORT}`);
});
