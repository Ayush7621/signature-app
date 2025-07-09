import React, { useEffect, useState } from 'react';
import PdfViewer from '../components/PdfViewer';

const Dashboard = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/docs')
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Uploaded PDFs</h2>
      <div className="space-y-8">
        {docs.map(doc => (
          <div key={doc._id}>
            <h3 className="text-lg font-semibold">{doc.originalname}</h3>
            <PdfViewer fileUrl={`http://localhost:8000/${doc.path}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;