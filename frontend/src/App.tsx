import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import axios from 'axios';
import './App.css';
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm';

// 1. THE BLUEPRINT: We tell TypeScript what a "Contact" looks like.
// This prevents errors when we try to display the name or phone.
interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  // 2. THE MEMORY: A place to store the list of family members.
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 3. THE ACTION: Optimized for the React Compiler
  // Word-by-Word: We change the dependency to [user] because the compiler prefers the whole object.
  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/contacts/${user.id}`);
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user]); // Changed from [user?.id] to [user] to satisfy the compiler

 // 4. THE AUTOMATION: Safe synchronization (Line 40-45)
  useEffect(() => {
    // Word: Create a variable to track if this specific 'run' is still valid
    let isMounted = true;

    if (user?.id && isMounted) {
      fetchContacts();
    }

    // Word: This 'cleanup' function runs if the component disappears
    return () => {
      isMounted = false;
    };
  }, [user?.id, fetchContacts]); // Word: We watch the specific ID and the function
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
            {/* We give the form the power to refresh the list */}
            <ContactForm onContactAdded={fetchContacts} />
          </div>

          <div className="glass-card list-section">
            <h3>Your Emergency Contacts</h3>
            {contacts.length === 0 ? (
              <p>No contacts added yet.</p>
            ) : (
              <ul className="contact-list">
                {/* We loop through every contact and draw it on the screen */}
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