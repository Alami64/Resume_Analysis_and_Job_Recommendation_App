import React, { useState } from 'react';
import { FileProvider } from './components/FileContext';
import { ChatProvider } from './components/ChatContext';
import { JobProvider } from './components/JobContext';
import "./App.css";
import Menu from './components/Menu';
import UploadResume from './components/UploadResume';
import ResumeAnalysisContent from './components/ResumeAnalysisContent';
import JobRecommendationContent from './components/JobRecommendationContent';

function App() {

  const [menuVisible, setMenuVisible] = useState(false);  
  const [activeMenu, setActiveMenu] = useState('upload');
  const [jobDescription, setJobDescription] = useState("");

  // Function to handle menu option selection and activation
  const handleMenuSelect = (menu) => {
      setActiveMenu(menu);
  };

  const handleUploadClick = () => {
    setMenuVisible(true);
    setActiveMenu('upload');
  };

  const activateResumeAnalysis = (description) => {
    setJobDescription(description);
    setActiveMenu('resume-analysis');
  };


  return (
  <JobProvider>
    <ChatProvider>
      <FileProvider>
        <div className='App'>
          <aside className={`menu-section ${menuVisible ? 'visible' : 'hidden'}`}>
            <div className="logo-section">
              <svg className="logo-icon" width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g stroke="null" id="svg_18">
                    <path stroke="#000" id="svg_15" d="m118.91422,110.9998l-12.4141,17.00159l12.41525,16.99843l4.51571,-6.18212l-7.90174,-10.81631l7.9001,-10.81632l-4.51522,-6.18527l0,0zm18.16899,0l-4.51244,6.1837l7.90012,10.81631l-7.90012,10.81499l4.51244,6.18209l12.41691,-16.99998l-12.41691,-16.9971z" fill="currentColor"/>
                    <g stroke="null" id="svg_16">
                      <path stroke="#000" id="svg_6" d="m54.32507,128.71984l0,0c0,-41.14522 33.13093,-74.50001 74,-74.50001l0,0c19.62601,0 38.44821,7.84908 52.32589,21.82054c13.8777,13.97147 21.67411,32.92083 21.67411,52.67947l0,0c0,41.14521 -33.13093,74.50001 -74,74.50001l0,0c-40.86906,0 -74,-33.3548 -74,-74.50001zm37,0l0,0c0,20.5726 16.56548,37.25001 37,37.25001c20.43454,0 37,-16.6774 37,-37.25001c0,-20.5726 -16.56547,-37.25001 -37,-37.25001l0,0c-20.43452,0 -37,16.67741 -37,37.25001z" fill="currentColor"/>
                      <path stroke="#000" id="svg_8" d="m196.08587,128.2298l-43.41067,-74.50003l28.58935,0l43.41067,74.50003l-43.41067,74.49997l-28.58935,0l43.41067,-74.49997z" fill="currentColor"/>
                      <path transform="rotate(180 67.325 128)" stroke="#000" id="svg_9" d="m74.73576,127.99983l-43.41068,-74.50003l28.58936,0l43.41067,74.50003l-43.41067,74.49998l-28.58936,0l43.41068,-74.49998z" fill="currentColor"/>
                      <path transform="rotate(-90 127.325 68)" stroke="#000" id="svg_11" d="m134.73577,67.99983l-43.41068,-74.50003l28.58936,0l43.41067,74.50003l-43.41067,74.49998l-28.58936,0l43.41068,-74.49998z" fill="currentColor"/>
                      <path transform="rotate(90 127.325 188)" stroke="#000" id="svg_12" d="m134.73577,187.99983l-43.41068,-74.50003l28.58936,0l43.41067,74.50003l-43.41067,74.49998l-28.58936,0l43.41068,-74.49998z" fill="currentColor"/>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div className='logo-text'>RESUME ANALYSIS AND JOB RECOMMENDATION</div>
            {menuVisible && <Menu activeMenu={activeMenu} onSelect={handleMenuSelect} />}
          </aside>
          <main className="main-section">
            {activeMenu === 'upload' && <UploadResume onUploadClick={handleUploadClick} />}
            {activeMenu === 'resume-analysis' && <ResumeAnalysisContent 
              jobDescription={jobDescription} 
              setJobDescription={setJobDescription} />}
            {activeMenu === 'job-recommendation' && <JobRecommendationContent onActivateResumeAnalysis={activateResumeAnalysis} />}
          </main>
        </div>
      </FileProvider>
    </ChatProvider>
  </JobProvider>
);
}


export default App
