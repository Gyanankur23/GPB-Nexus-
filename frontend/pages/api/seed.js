export default function handler(req, res) {
  res.status(200).json({ message: 'Data is seeded client-side on first load.' });
}
