import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//  Check if your file is in 'src/store/authSlice.ts'
// If 'store' is a folder, we must include it in the path.
import { logout } from './store/authSlice'; 

//  Check if your file is 'src/store.ts' or 'src/store/index.ts'
import type { RootState } from './store'; 

import axios from 'axios';
import './App.css';

// Check if your components are in 'src/components/'
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm';
// BLUEPRINT: Defines what a Contact looks like


interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  // MEMORY: Stores the list of contacts
  const [contacts, setContacts] = useState<Contact[]>([]);

  // EDIT STATE: Stores the contact being edited. If null, we are adding new.
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // FETCH LOGIC: Pulls data from the Backend
  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`http://localhost:5000/contacts/${user.id}`);
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user]);

  // DELETE LOGIC: Removes a contact
  const deleteContact = async (contactId: number) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axios.delete(`http://localhost:5000/contacts/${contactId}`);
      fetchContacts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete contact.");
    }
  };

  // START EDITING: Fills the 'editingContact' memory and scrolls up
  const startEditing = (contact: Contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AUTOMATION: Syncs with DB on login
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (user?.id && active) {
        await fetchContacts();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user, fetchContacts]);

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
            
            {/* UPDATED: We now pass the editingContact and a way to clear it to the form */}
            <ContactForm 
              onContactAdded={() => {
                fetchContacts();
                setEditingContact(null); // Word: Clear edit mode after saving
              }} 
              editData={editingContact}
              onCancelEdit={() => setEditingContact(null)} // Word: Way to cancel editing
            />
          </div>

          <div className="glass-card list-section">
            <h3>Your Emergency Contacts</h3>
            {contacts.length === 0 ? (
              <p>No contacts added yet.</p>
            ) : (
              <ul className="contact-list">
                {contacts.map((c) => (
                  <li key={c.id} className="contact-item">
                    <div className="contact-info">
                      <strong>{c.name}</strong> ({c.relation}) - {c.phone}
                    </div>
                    
                    <div className="contact-actions">
                      {/* EDIT BUTTON: Sends this specific contact info to the state */}
                      <button 
                        onClick={() => startEditing(c)} 
                        className="btn-edit"
                      >
                        Edit
                      </button>

                      <button 
                        onClick={() => deleteContact(c.id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
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