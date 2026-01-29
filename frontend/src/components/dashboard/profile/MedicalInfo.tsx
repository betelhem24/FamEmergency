import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, Plus, X } from 'lucide-react';

interface Props {
    title: string;
    items: string[];
    type: 'allergies' | 'conditions';
    isEditing: boolean;
    onAdd: (type: 'allergies' | 'conditions', item: string) => void;
    onRemove: (type: 'allergies' | 'conditions', item: string) => void;
}

const MedicalInfo: React.FC<Props> = ({ title, items = [], type, isEditing, onAdd, onRemove }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            onAdd(type, newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div className="glass-card glass-card-sm p-5 h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {type === 'allergies' ? <AlertCircle className="text-red-400" /> : <ShieldAlert className="text-yellow-400" />}
                {title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
                {items.map((item, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 
            ${type === 'allergies' ? 'bg-red-500/20 text-red-200' : 'bg-yellow-500/20 text-yellow-200'}`}>
                        {item}
                        {isEditing && (
                            <button onClick={() => onRemove(type, item)} className="hover:text-white"><X size={12} /></button>
                        )}
                    </span>
                ))}
                {items.length === 0 && <span className="text-gray-500 text-sm">None listed</span>}
            </div>

            {isEditing && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="glass-input flex-1 text-sm py-1"
                        placeholder="Add new..."
                    />
                    <button onClick={handleAdd} className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">
                        <Plus size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MedicalInfo;
