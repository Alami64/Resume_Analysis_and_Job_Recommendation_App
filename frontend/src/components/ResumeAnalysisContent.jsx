import React, { useState  } from 'react';
import ChatArea from './ChatArea';
import JobDescription from './JobDescription';

function ResumeAnalysisContent({ jobDescription, setJobDescription }) {
    const hasJobDescription = jobDescription !== null && jobDescription !== "";
    
    return (
        <div id="resume-analysis-content" className="tab-content">
            <h2>Resume Analysis</h2>
            <p>Analyzes and enhances resumes for general improvement or a specific job opening.</p>
            <div className="resume-analysis-container" style={{ flexDirection: 'row' }}>
                {hasJobDescription && <JobDescription content={jobDescription} setContent={setJobDescription} />}
                <ChatArea jobDescription={jobDescription} style={{ width: hasJobDescription ? '70%' : '100%' }} />              
            </div>
        </div>
    );
}

export default ResumeAnalysisContent;
