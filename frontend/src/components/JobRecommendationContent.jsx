import React, { useState, useEffect } from 'react';
import { useJobs } from './JobContext';
import axios from 'axios';
import Grid from './GridJobs';
import { useFile } from './FileContext';

const fetchJobRecommendations = async (setJobs, setIsLoading, setError, keywords, filters, resume_file) => {
  setIsLoading(true);
  setError(false);
  try {

    const formData = new FormData();
    formData.append('keywords', JSON.stringify(keywords));
    formData.append('location', filters.location);
    // formData.append('datePosted', filters.datePosted);
    formData.append('results', filters.results);
    formData.append('resume_file', resume_file);
    
    const response = await axios.post('http://localhost:8000/extract_jobs/', formData);
    const { company, job_url, title, description } = response.data.job_data;


    const jobDataTransformed = Object.keys(company).map(index => ({
      company: company[index],
      title: title[index],
      url: job_url[index],
      description: description[index]
    }));

   
    setJobs(jobDataTransformed);
    setIsLoading(false);

  } catch (error) {
    console.error('Failed to fetch job recommendations:', error);
    setError(true);
    setIsLoading(false);
  }
};

function JobRecommendation({ onActivateResumeAnalysis }) {
  const { selectedFile, extractedKeywords } = useFile();
  const { jobs, setJobs, filters, setFilters } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  const fetchCityName = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = 'http://localhost:8000/get-city/';
          try {
            const response = await axios.post(url, { latitude, longitude });
            setFilters({ ...filters, location: response.data.city });
          } catch (error) {
            console.error('Error fetching city name:', error);
          }
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const loadJobs = () => {
    if (!extractedKeywords.keywords) {
      alert('Please extract keywords from your resume first.');
      return;
    }

    fetchJobRecommendations(setJobs, setIsLoading, setError, extractedKeywords.keywords, filters, selectedFile);
  };
  const jobsPerPage = 7;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <div className="job-recommendations">
      <h2>Job Recommendations</h2>
      <p>Job Recommendations based on your resume.</p>
      <div className="filters">
        <div className="input-with-icon">
          <input
            id="location"
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
          <button onClick={fetchCityName} className="location-icon" aria-label="Fetch location">
          <span className="material-icons">place</span> 
          </button> 
        </div>

        {/* <select value={filters.datePosted} onChange={(e) => handleFilterChange('datePosted', e.target.value)}>
          <option value="24">Past 24h</option>
          <option value="48">Past 2 Days</option>
          <option value="168">Past Week</option>
        </select> */}

        <select value={filters.results} onChange={(e) => handleFilterChange('results', e.target.value)}>
          <option value="5">5 Results</option>
          <option value="10">10 Results</option>
          <option value="15">15 Results</option>
        </select>

        <button className="button" onClick={loadJobs}>
          {isLoading ? 'Loading...' : 'Load Jobs'}
        </button>
      </div>

      {error && <p>Error loading jobs. Please try again later.</p>}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        jobs.length > 0 && (          
          <div className="jobArea">
          <Grid data={currentJobs} onChatClick={onActivateResumeAnalysis} />
            <div className="pagination">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`page-item ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default JobRecommendation;
