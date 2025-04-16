
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<Array<{ id: string; original_filename: string; file: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredFiles = files.filter(file => 
    file.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/');
      setFiles(response.data);
    } catch (err) {
      setError('Failed to fetch files');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setSelectedFile(null);
      fetchFiles();
    } catch (err: any) {
      if (err.response?.status === 409 || (err.response?.status === 400 && err.response?.data?.includes('file already exists'))) {
        setError('This file already exists.');
      } else {
        setError('Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Download failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`);
      fetchFiles();
    } catch (err) {
      setError('Delete failed');
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col items-center">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setSelectedFile(file);
                        setError(null);
                      }
                    }}
                    className="mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">Drag and drop a file here, or</p>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className={`w-full py-2 px-4 rounded flex items-center justify-center ${
                      !selectedFile || loading
                        ? 'bg-gray-300'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                  {error && (
                    <div className="mt-4 px-4 py-3 rounded-lg bg-red-500 text-white text-sm shadow-md transition-opacity">
                      {error}
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">Uploaded Files</h3>
                  <input
                    type="text"
                    placeholder="Search files…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:max-w-[400px] mt-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ul className="mt-4 space-y-2">
                    {filteredFiles.map((file) => (
                      <li
                        key={file.id}
                        className="p-2 bg-gray-50 rounded flex items-center justify-between"
                      >
                        <span className="flex-1 flex items-center">
                          <span className="mr-2">
                            {(() => {
                              const ext = file.original_filename.split('.').pop()?.toLowerCase() || '';
                              if (['.pdf', '.docx', '.txt'].includes('.' + ext)) return '📄';
                              if (['.png', '.jpg', '.jpeg', '.gif'].includes('.' + ext)) return '🖼️';
                              if (['.zip', '.rar', '.7z'].includes('.' + ext)) return '📦';
                              if (['.csv', '.xls', '.xlsx'].includes('.' + ext)) return '🧾';
                              if (['.json', '.xml', '.yaml'].includes('.' + ext)) return '🧮';
                              return '📁';
                            })()}
                          </span>
                          {file.original_filename}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(file.file, file.original_filename)}
                            className="text-blue-500 hover:text-blue-700 transition-colors px-2"
                            title="Download"
                          >
                            🡇
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="text-red-500 hover:text-red-700 transition-colors px-2"
                            title="Delete"
                          >
                            ❌
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
