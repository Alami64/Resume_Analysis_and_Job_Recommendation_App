import React, { useState } from 'react';
import { useFile } from './FileContext';
import PDFViewer from './PDFViewer';
import KeywordExtract from './KeyWordsExtract';

function UploadResume({ onUploadClick }) {
    const { handleFileSelect, setIsPDF, isPDF } = useFile(); 
    const [fileForUpload, setFileForUpload] = useState(null);

    const localHandleFileSelect = (event) => {
        const file = event.target.files[0];
        setFileForUpload(file); 
    };

    const uploadResume = () => {
        if (!fileForUpload) {
            alert('Please select a PDF file to upload.');
            return;
        }

        if (fileForUpload.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        handleFileSelect(fileForUpload);
        setIsPDF(true);
        onUploadClick(); 
    };

    return (
        <div className="upload-content">
            <div className='resume-upload-title'>Upload Your Resume</div><br />
            <div className = "upload-resume-header">
                <label htmlFor="resume-upload" className="button">
                    Choose File
                    <input type="file" id="resume-upload" style={{ display: "none" }} onChange={localHandleFileSelect} />
                </label>
                <span id="file-name">{fileForUpload ? fileForUpload.name : 'No file chosen'}</span>
                <button  className="button" onClick={uploadResume}>Upload</button>
            </div>
            <div>
                
            </div>
            {isPDF && (
                <div className="pdf-keyword-container">
                    <PDFViewer file={fileForUpload} />
                    <KeywordExtract file={fileForUpload} />
                </div>
            )}
        </div>
  )};

export default UploadResume;