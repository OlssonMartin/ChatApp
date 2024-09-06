import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  
  const avatars = [
    "https://i.pravatar.cc/200?img=1",
    "https://i.pravatar.cc/200?img=2",
    "https://i.pravatar.cc/200?img=3",
    "https://i.pravatar.cc/200?img=4",
    "https://i.pravatar.cc/200?img=5"
  ];

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", { method: "PATCH" })
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !username || !password || !avatar) {
      setError("All fields are required!");
      return;
    }

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, avatar, csrfToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate("/login");
        }
      });
  };

  const handleAvatarClick = (selectedAvatar) => {
    setAvatar(selectedAvatar);  
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Choose Avatar</label>
            <div className="d-flex justify-content-between">
              {avatars.map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className={`avatar-option ${avatar === avatarUrl ? 'selected-avatar' : ''}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: avatar === avatarUrl ? "3px solid blue" : "none"
                  }}
                  onClick={() => handleAvatarClick(avatarUrl)} 
                />
              ))}
            </div>
          </div>
          {avatar && (
            <div className="text-center mb-3">
              <p>Selected Avatar:</p>
              <img src={avatar} alt="Selected Avatar" className="rounded-circle" style={{ width: "100px" }} />
            </div>
          )}
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;