import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import { contactApi } from './api/contactApi';
import type { Contact } from './types/contact';
import './App.css';
import RegisterForm from './components/RegisterForm';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const userId = user?.id;

  // I keep this function for manual refreshes (like after adding a contact)
  const fetchContacts = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await contactApi.getAll(Number(userId));
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [userId]);

  // I use a "Void" approach here. By not returning anything and 
  // ensuring the function is called inside a promise-like structure,
  // I satisfy the cascading render rule.
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (userId && isMounted) {
        // I use the API directly here instead of calling fetchContacts()
        // to avoid the "synchronous setState" warning.
        try {
          const data = await contactApi.getAll(Number(userId));
          if (isMounted) setContacts(data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]); // I only watch userId to prevent loops.

  const deleteContact = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await contactApi.delete(id);
      fetchContacts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container">
      {user ? (
        <div className="dashboard-layout">
          <div className="glass-card">
            <h1>Hello, {user.name}!</h1>
            <button onClick={() => dispatch(logout())} className="btn-secondary">Logout</button>
            <hr />
            <ContactForm 
              key={editingContact?.id || 'new'} 
              editData={editingContact}
              onContactAdded={() => { fetchContacts(); setEditingContact(null); }}
              onCancelEdit={() => setEditingContact(null)}
            />
          </div>
          <div className="glass-card list-section">
            <h3>Your Emergency Contacts</h3>
            <ContactList 
              contacts={contacts} 
              onEdit={setEditingContact} 
              onDelete={deleteContact} 
            />
          </div>
        </div>
      ) : (
        <div className="glass-card">
          <RegisterForm />
        </div>
      )}
    </div>
  );
}

export default App;