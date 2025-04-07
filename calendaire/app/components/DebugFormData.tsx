"use client";

import { useState } from 'react';
import { InfoIcon } from 'lucide-react';

interface FormData {
  [key: string]: string | undefined;
}

export function DebugFormData() {
  const [showDebug, setShowDebug] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  
  // Function to capture form data before submission
  const captureFormData = () => {
    const forms = document.querySelectorAll('form');
    if (forms.length === 0) return;
    
    const form = forms[0];
    const formElements = form.elements;
    const data: FormData = {};
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLInputElement;
      if (element.name) {
        data[element.name] = element.value;
      }
    }
    
    setFormData(data);
    setShowDebug(true);
  };
  
  return (
    <div className="relative">
      {process.env.NODE_ENV !== 'production' && (
        <button
          type="button"
          onClick={captureFormData}
          className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 z-50"
          title="Debug Form Data"
        >
          <InfoIcon className="size-5" />
        </button>
      )}
      
      {showDebug && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">Form Data Debug</h3>
              <button
                onClick={() => setShowDebug(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 