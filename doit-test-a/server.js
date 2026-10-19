const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = 3373; // 학번 뒷자리 4자리

// 메모리 저장소
let todos = [];
let nextId = 1;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// POST /todo/1?_method=PUT  →  PUT /todo/1 로 변환
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 기본 할일 목록
const DEFAULT_TODOS = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];


// 목록 조회
app.get('/todo', (req, res) => {
  res.json(todos);
});

// 추가
app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});

// 수정
app.put('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  const text = (req.body.text || '').trim();
  const todo = todos.find((t) => t.id === id);

  if (!todo) return res.status(404).send('할일을 찾을 수 없습니다');
  if (text) todo.text = text;
  res.redirect('/');
});

// 삭제
app.delete('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);

  if (todos.length === before) return res.status(404).send('할일을 찾을 수 없습니다');
  res.redirect('/');
});

// 로컬 실행 시에만 listen (Vercel은 app을 export해서 사용)
if (require.main === module) {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

module.exports = app;
