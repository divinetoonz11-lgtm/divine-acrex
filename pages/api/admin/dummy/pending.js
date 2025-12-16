export default function handler(req, res) {
  const pendingProperties = [
    { _id: 'p3', title: 'Flat 303', city: 'Bangalore', bhk: 2 }
  ];
  const pendingDealers = [
    { _id: 'd3', name: 'Dealer 3', email: 'dealer3@test.com', city: 'Chennai' }
  ];
  res.status(200).json({ pendingProperties, pendingDealers });
}
