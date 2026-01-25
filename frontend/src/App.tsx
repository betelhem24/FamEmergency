import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import axios from 'axios';
import './App.css';
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm';

// 1. THE BLUEPRINT: Defines the shape of a contact object
interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  // 2. THE MEMORY: Stores the array of contacts from the DB
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 3. THE ACTION: A stable function to pull data from the API
  const fetchContacts = useCallback(async () => {
    // Word-by-Word: We only proceed if we have a valid logged-in user ID
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/contacts/${user.id}`);
      // Word: We update the state with the array of contacts
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user]); // Word: The compiler wants to watch the 'user' object

  // 4. THE AUTOMATION: This is the section the Compiler was flagging
  useEffect(() => {
    // Word: We create a 'flag' to prevent cascading renders
    let active = true;

    // Word: We define a sub-function to handle the async work
    const load = async () => {
      if (user?.id && active) {
        await fetchContacts();
      }
    };

    // Word: We trigger the load
    load();

    // Word: Cleanup function runs when the component unmounts or user changes
    return () => {
      active = false;
    };
  }, [user, fetchContacts]); // Word: Providing full dependencies for the Compiler

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="container">
      {user ? (
        /* --- LOGGED IN VIEW --- */
        <div className="dashboard-layout">
          <div className="glass-card">
            <h1>Welcome, {user.name}! 👋</h1>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
            <hr />
            {/* Word: We pass the fetch function so the form can trigger a refresh */}
            <ContactForm onContactAdded={fetchContacts} />
          </div>

          <div className="glass-card list-section">
            <h3>Your Emergency Contacts</h3>
            {contacts.length === 0 ? (
              <p>No contacts added yet.</p>
            ) : (
              <ul className="contact-list">
                {/* Word-by-Word: .map transforms our data into a visual list */}
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
        /* --- LOGGED OUT VIEW --- */
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