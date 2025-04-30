import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({
    id: '',
    profilePicture: '',
    bio: '',
    mailId: '',
  });

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    address: '',
    password: '',
    services: [],
  });

  const [bioEditable, setBioEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem('username');
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/profile?username=${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({
            id: data.id,
            profilePicture: data.profilePicture || '',
            bio: data.bio || '',
            mailId: data.mailId || '',
          });
          setUser({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            username: data.username || '',
            phone: data.phone || '',
            address: data.address || '',
            password: data.password || '',
            services: data.services || [],
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profilePicture: imageUrl }));
      updateProfilePictureOnServer(file);
    }
  };

  const updateProfilePictureOnServer = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('profileId', profile.id);

    try {
      await fetch('http://localhost:8080/api/profile/updateProfilePicture', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const saveBio = async () => {
    try {
      await fetch('http://localhost:8080/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setBioEditable(false);
    } catch (err) {
      console.error('Error saving bio:', err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
      <h1 className="profile-title">Profile</h1>

        <div className="profile-image-wrapper">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" className="profile-image" />
          ) : (
            <FaUser className="profile-image default-profile-icon" />
          )}
          <label htmlFor="fileInput" className="change-photo-btn">
            Change Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="fileInput"
            className="profile-file-input"
            style={{ display: 'none' }}
          />
        </div>

        <h2 className="centered-username">{user.firstName} {user.lastName}</h2>

        {/* Editable profile fields */}
        <div className="profile-section profile-input-container">
          <label>Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="profile-input"
          />
        </div>

        <div className="profile-section profile-input-container">
          <label>Phone</label>
          <input
            type="text"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="profile-input"
          />
        </div>

        <div className="profile-section profile-input-container">
          <label>Address</label>
          <input
            type="text"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="profile-input"
          />
        </div>

        <div className="profile-section profile-input-container">
          <label>Email</label>
          <input
            type="email"
            value={profile.mailId}
            onChange={(e) => setProfile({ ...profile, mailId: e.target.value })}
            className="profile-input"
          />
        </div>

        <div className="profile-section profile-input-container">
          <label>Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="profile-input"
          />
        </div>

        {/* Bio Section */}
        <div className="profile-section profile-input-container">
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            disabled={!bioEditable}
            className="profile-input"
          />
          {!bioEditable ? (
            <button onClick={() => setBioEditable(true)} className="profile-edit-btn">Edit Bio</button>
          ) : (
            <button onClick={saveBio} className="profile-save-btn">Save Bio</button>
          )}
        </div>

        {/* Services List */}
        <div className="profile-section profile-input-container">
          <label>Pooja Services</label>
          <ul className="services-list">
            {user.services.map((service, idx) => (
              <li key={idx}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
