import { useState } from "react";
import { useAdminLogin } from "../../hooks/useAdminLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useAdminLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(username, password);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundImage:
          "linear-gradient(to left top, #62fdc8, #49f8ec, #64f0ff, #91e6ff, #b6dcff)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: "#dbf5ee",
            width: 450,
            height: 600,
          }}
        >
          <h2
            style={{
              color: "#a3a3a3",
              fontFamily: ["Quicksand", "sans-serif"].join(","),
              fontSize: 19,
            }}
          >
            Nice to see you again
          </h2>
          <h1
            style={{
              color: "#4cceac",
              fontFamily: ["Source Sans 3", "sans-serif"].join(","),
              fontSize: 43,
              marginTop: -8,
            }}
          >
            Welcome back
          </h1>
          <img
            src="assets/admin.png"
            alt="admin"
            style={{ width: 330, height: 330 }}
          />
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            width: 400,
            height: 600,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            padding: 30,
          }}
          className="login"
          onSubmit={handleSubmit}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: -10,
              marginBottom: -10,
            }}
          >
            <img
              src="assets/s.png"
              alt="logo"
              style={{ width: 50, height: 50, marginRight: 10, marginLeft: -5 }}
            />
            <h3
              style={{
                color: "#000000",
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 20,
              }}
            >
              SmartSeat
            </h3>
          </div>
          <h3
            style={{
              color: "#000000",
              fontFamily: ["Source Sans 3", "sans-serif"].join(","),
              fontSize: 30,
            }}
          >
            Log in.
          </h3>

          <label
            style={{
              color: "#000000",
              fontFamily: ["Poppins", "sans-serif"].join(","),
              fontSize: 15,
            }}
          >
            Username
          </label>
          <input
            style={{
              marginTop: 10,
              marginBottom: 20,
              border: error ? "1px solid #e7195a" : "1px solid #ddd",
              borderRadius: 4,
              padding: 10,
              width: "100%",
            }}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <label
            style={{
              color: "#000000",
              fontFamily: ["Poppins", "sans-serif"].join(","),
              fontSize: 15,
            }}
          >
            Password
          </label>
          <input
            style={{
              marginTop: 10,
              marginBottom: 20,
              border: error ? "1px solid #e7195a" : "1px solid #ddd",
              borderRadius: 4,
              padding: 10,
              width: "100%",
            }}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button
            style={{
              backgroundColor: "#4cceac",
              color: "#fff",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: ["Source Sans 3", "sans-serif"].join(","),
              fontSize: 15,
              fontWeight: "bold",
              padding: 10,
              border: 0,
            }}
            disabled={isLoading}
          >
            Log in
          </button>
          {error && (
            <div
              style={{
                padding: 10,
                backgroundColor: "#ffefef",
                border: "1px solid #e7195a",
                color: "#e7195a",
                borderRadius: 4,
                marginTop: 20,
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 15,
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
