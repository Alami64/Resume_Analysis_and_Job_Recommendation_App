import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: 'California', 
    results: '5',
  });

  return (
    <JobContext.Provider value={{ jobs, setJobs, filters, setFilters }}>
      {children}
    </JobContext.Provider>
  );
};
