import React, { useState } from 'react';
import { Phone, Plus, Trash2 } from 'lucide-react';
import type { EmergencyContact } from '../../../types';

interface Props {
    contacts: EmergencyContact[];
    isEditing: boolean;
    onUpdate: (contacts: EmergencyContact[]) => void;
}

const EmergencyContacts: React.FC<Props> = ({ contacts = [], isEditing, onUpdate }) => {
    const [newContact, setNew] = useState({ name: '', relation: '', phone: '' });

    const add = () => {
        if (newContact.name && newContact.phone) {
            const contact = { ...newContact, id: Date.now().toString(), relationship: newContact.relation };
            onUpdate([...contacts, contact]);
            setNew({ name: '', relation: '', phone: '' });
        }
    };

    return (
        <div className="glass-card glass-card-sm p-5 mt-6 border-red-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Phone className="text-red-400" /> Emergency Contacts
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
                {contacts.map((contact) => (
                    <div key={contact.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg relative">
                        <p className="font-bold text-white">{contact.name}</p>
                        <p className="text-xs text-red-300">{contact.relationship}</p>
                        <p className="text-sm text-gray-300 mt-1">{contact.phone}</p>
                        {isEditing && (
                            <button onClick={() => onUpdate(contacts.filter(c => c.id !== contact.id))}
                                className="absolute top-3 right-3 text-red-400 hover:text-red-200">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="mt-4 space-y-2">
                    <input className="glass-input w-full text-sm" placeholder="Name"
                        value={newContact.name} onChange={e => setNew({ ...newContact, name: e.target.value })} />
                    <div className="flex gap-2">
                        <input className="glass-input flex-1 text-sm" placeholder="Relation"
                            value={newContact.relation} onChange={e => setNew({ ...newContact, relation: e.target.value })} />
                        <input className="glass-input flex-1 text-sm" placeholder="Phone"
                            value={newContact.phone} onChange={e => setNew({ ...newContact, phone: e.target.value })} />
                        <button onClick={add} className="p-2 bg-red-600 rounded-lg"><Plus size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyContacts;
