// import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { Mail, Calendar, User } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const infoItems = [
        { label: "Name", value: user?.displayName || 'Not set', icon: User },
        { label: "Email", value: user?.email || 'Not set', icon: Mail },
        { label: "Member Since", value: user?.metadata?.creationTime 
            ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : 'Recently', icon: Calendar },
    ];

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-1">View and manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-center">
                        <div className="flex justify-center mb-4">
                            {user?.photoURL ? (
                                <img 
                                    src={user?.photoURL} 
                                    alt={user?.displayName || 'User'}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg text-white">
                                    {getInitials(user?.displayName)}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-white">{user?.displayName || 'User Name'}</h2>
                        <p className="text-indigo-100 text-sm mt-1">{user?.email}</p>
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 py-6 space-y-4">
                        {infoItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <item.icon className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="text-gray-500 text-sm">{item.label}</span>
                                </div>
                                <span className="text-gray-800 font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Actions
                <div className="mt-6 flex justify-end gap-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Change Password
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        Delete Account
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Profile;