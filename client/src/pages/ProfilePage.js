import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import '../components/dashboards/Dashboard.css'; // Reuse dashboard styles

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!profile) {
        return <div>Could not load profile.</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>My Profile</h1>
            <div className="dashboard-section">
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
                    <strong>Name:</strong>
                    <span>{profile.name}</span>

                    <strong>Email:</strong>
                    <span>{profile.email}</span>

                    <strong>Role:</strong>
                    <span>{profile.role}</span>

                    <strong>Company:</strong>
                    <span>{profile.company.name}</span>

                    {profile.role === 'Employee' && profile.manager && (
                        <>
                            <strong>Manager:</strong>
                            <span>{profile.manager.name}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;