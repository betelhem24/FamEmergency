import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import axios from 'axios';
import './App.css';
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm';

interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  // 1. STATE: List memory
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 2. LOGIC: Define the fetcher
  // Word-by-Word: We use useCallback to make sure this function is "stable"
  const fetchContacts = useCallback(async () => {
    // Word: We only try to fetch if we have a valid user ID
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/contacts/${user.id}`);
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user?.id]); // Word: Only re-create if the specific user ID changes

  // 3. AUTOMATION: Run on start
  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, fetchContacts]); // Word: We include both in the watch-list to satisfy TS

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="container">
      {user ? (
        <div className="dashboard-layout">
          <div className="glass-card">
            <h1>Welcome, {user.name}! 👋</h1>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
            <hr />
            {/* Word: We pass the function to the child component */}
            <ContactForm onContactAdded={fetchContacts} />
          </div>

          <div className="glass-card list-section">
            <h3>Your Emergency Contacts</h3>
            {contacts.length === 0 ? (
              <p>No contacts added yet.</p>
            ) : (
              <ul className="contact-list">
                {contacts.map((c) => (
                  <li key={c.id} className="contact-item">
                    <strong>{c.name}</strong> ({c.relation}) - {c.phone}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card">
          <h2>Create Account</h2>
          <RegisterForm /> 
          <p className="auth-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;