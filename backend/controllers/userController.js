exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: '홍길동' },
    { id: 2, name: '김철수2' }
  ]);
};
