export default function handler(req, res) {
  const dummyDealers = [
    { _id: 'd1', name: 'Dealer 1', email: 'dealer1@test.com', city: 'Delhi' },
    { _id: 'd2', name: 'Dealer 2', email: 'dealer2@test.com', city: 'Mumbai' }
  ];
  res.status(200).json(dummyDealers);
}
