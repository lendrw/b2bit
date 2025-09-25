import React from "react";
import { useAuthContext } from "../../shared/contexts";

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuthContext();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <div>
        <h3>Profile picture</h3>
        <img src={user.avatar.high } alt="Profile" />
        <div>
          <label>Your Name</label>
          <input type="text" value={user.name} readOnly />
        </div>
        <div>
          <label>Your E-mail</label>
          <input type="email" value={user.email} readOnly />
        </div>
      </div>
    </div>
  );
};
