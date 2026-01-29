import React from 'react';
import { User, QrCode, Download, Edit2 } from 'lucide-react';
import type { User as UserType } from '../../../types';

interface ProfileHeaderProps {
    user: UserType | null;
    isEditing: boolean;
    onEditToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isEditing, onEditToggle }) => {
    return (
        <div className="glass-card glass-card-md p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-400/30">
                    <User size={40} className="text-indigo-300" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors">
                    <Edit2 size={14} className="text-white" />
                </button>
            </div>

            <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Guest User'}</h2>
                <p className="text-indigo-300 text-sm mb-4">{user?.email}</p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                        onClick={onEditToggle}
                        className={`glass-button text-sm ${isEditing ? 'bg-green-500/20 text-green-300' : ''}`}
                    >
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                    </button>
                    <button className="glass-button text-sm flex items-center gap-2">
                        <QrCode size={16} />
                        Show QR
                    </button>
                    <button className="glass-button text-sm flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
