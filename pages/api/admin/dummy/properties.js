export default function handler(req, res) {
  const dummyProperties = [
    { _id: 'p1', title: 'Flat 101', city: 'Delhi', bhk: 2 },
    { _id: 'p2', title: 'Villa 202', city: 'Mumbai', bhk: 3 }
  ];
  res.status(200).json(dummyProperties);
}
