import React from 'react';

function Menu({ activeMenu, onSelect, isVisible }) {
  return (
    <div className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div>
        <a href="#" id="upload" onClick={() => onSelect('upload')} className={activeMenu === 'upload' ? 'active' : ''}>
          <b>UPLOAD</b>
        </a>
      </div>
      <div>
        <a href="#" id="job-recommendation" onClick={() => onSelect('job-recommendation')} className={activeMenu === 'job-recommendation' ? 'active' : ''}>
          <b>JOB RECOMMENDATION</b>
        </a>
      </div>
      <div>
        <a href="#" id="resume-analysis" onClick={() => onSelect('resume-analysis')} className={activeMenu === 'resume-analysis' ? 'active' : ''}>
          <b>RESUME ANALYSIS</b>
        </a>
      </div>
    </div>
  );
}

export default Menu;
