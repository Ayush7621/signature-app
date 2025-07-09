import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SignatureBox from './SignatureBox';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const DroppablePage = ({ pageNumber, fileUrl, onDropSignature }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'signature',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      onDropSignature(pageNumber, offset);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={dropRef} className="relative border-2 border-dashed border-gray-300">
      <Page pageNumber={pageNumber} />
      {isOver && <div className="absolute inset-0 bg-blue-100 opacity-30" />}
    </div>
  );
};

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [signatures, setSignatures] = useState([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDropSignature = (pageNumber, offset) => {
    setSignatures(prev => [...prev, { page: pageNumber, x: offset.x, y: offset.y }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4 bg-white shadow space-y-4">
        <SignatureBox />
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <div key={index} className="relative">
              <DroppablePage
                pageNumber={index + 1}
                fileUrl={fileUrl}
                onDropSignature={handleDropSignature}
              />
              {signatures
                .filter(sig => sig.page === index + 1)
                .map((sig, i) => (
                  <div
                    key={i}
                    className="absolute bg-blue-600 text-white px-2 py-1 rounded"
                    style={{
                      left: sig.x,
                      top: sig.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                  >
                    ✍️ Signature
                  </div>
                ))}
            </div>
          ))}
        </Document>
      </div>
    </DndProvider>
  );
};

export default PdfViewer;