import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Toast } from '../components/Toast';

const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useLocalStorage('applications', []);
  const [savedJobs, setSavedJobs] = useLocalStorage('savedJobs', []);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
  };

  const addApplication = (internship, profile) => {
    const application = {
      id: `APP${Date.now()}`,
      internship_id: internship.intern_id,
      candidate_id: profile.candidate_id,
      internship_title: internship.title,
      organization: internship.organization,
      applied_date: new Date().toISOString(),
      status: 'Applied'
    };
    
    setApplications(prev => [...prev, application]);
    showToast(`Applied to ${internship.title} successfully!`);
    return application;
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const saveJob = (internship) => {
    if (!savedJobs.find(job => job.intern_id === internship.intern_id)) {
      setSavedJobs(prev => [...prev, internship]);
      showToast(`Saved ${internship.title}`);
      return true;
    }
    showToast('Job already saved!');
    return false;
  };

  return (
    <ApplicationContext.Provider value={{
      applications,
      savedJobs,
      addApplication,
      updateApplicationStatus,
      saveJob
    }}>
      {children}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
}