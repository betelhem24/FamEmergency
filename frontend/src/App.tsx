import { useEffect, useState, useCallback } from 'react'; // Added useEffect and useState
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import axios from 'axios';
import './App.css';
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm'; // Word: Import the form

// Word-by-Word: We define what a Contact looks like for TypeScript
interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
// 1. STATE: To store the list of contacts
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 2. LOGIC: The function to fetch contacts
  // Word-by-Word: useCallback "freezes" this function so it doesn't change every time the page refreshes
  const fetchContacts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5000/contacts/${user.id}`);
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user]); // Word: Only re-create if 'user' changes

  // 3. AUTOMATION: Run fetchContacts automatically
  useEffect(() => {
    fetchContacts(); 
  }, [fetchContacts]); // Word-by-Word: This is the "Watch List." When fetchContacts is ready, run it.

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

            {/* Word: We pass fetchContacts so the form can refresh the list */}
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