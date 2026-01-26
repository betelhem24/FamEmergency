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

  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await contactApi.getAll(Number(user.id));
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [user]);

  const deleteContact = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await contactApi.delete(id);
      fetchContacts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchContacts();
  }, [user, fetchContacts]);

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