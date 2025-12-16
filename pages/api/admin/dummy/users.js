export default function handler(req, res) {
  const dummyUsers = [
    { _id: 'u1', name: 'Test User 1', email: 'user1@test.com', phone: '9999999991', role: 'user', active: true },
    { _id: 'u2', name: 'Test User 2', email: 'user2@test.com', phone: '9999999992', role: 'user', active: false }
  ];
  res.status(200).json(dummyUsers);
}
