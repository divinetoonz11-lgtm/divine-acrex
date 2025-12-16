import { useEffect, useState } from 'react';

export default function OverviewCards() {
  const [data, setData] = useState({ users: 0, dealers: 0, properties: 0, pending: 0 });

  useEffect(() => {
    async function fetchData() {
      const [usersRes, dealersRes, propsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/dealers'),
        fetch('/api/admin/properties')
      ]);

      const users = await usersRes.json();
      const dealers = await dealersRes.json();
      const properties = await propsRes.json();

      setData({
        users: users.length,
        dealers: dealers.length,
        properties: properties.length,
        pending: properties.filter(p => !p.approved).length
      });
    }

    fetchData();
  }, []);

  return (
    <div className='grid grid-cols-4 gap-4 p-4'>
      <div className='bg-white p-4 rounded shadow'>Users<br/>{data.users}</div>
      <div className='bg-white p-4 rounded shadow'>Dealers<br/>{data.dealers}</div>
      <div className='bg-white p-4 rounded shadow'>Properties<br/>{data.properties}</div>
      <div className='bg-white p-4 rounded shadow'>Pending<br/>{data.pending}</div>
    </div>
  );
}
