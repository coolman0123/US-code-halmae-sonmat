exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: '홍길동' },
    { id: 2, name: '김철수2' }
  ]);
};


//이건 이제 필요없는데 지우지 말아주세용~