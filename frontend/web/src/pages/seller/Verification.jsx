import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function VerifyAccount() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log(
        "VERIFY URL:",
        `${import.meta.env.VITE_API_URL}/merchant/verify/`
      );
      // const res = await fetch(
      //   "http://localhost:8000/api/merchant/verify/",
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/merchant/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ⭐ مهم جداً للـ session
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.message || "Verification failed");
        return;
      }

      // نجاح التحقق
      // هنا ننتقل لصفحة إضافة المنتج
      // window.location.href = "/add-product";
      if (data.redirect_url) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        navigate(data.redirect_url);

      } else {
        // 💡 تعديل الوجهة الافتراضية هنا لتكون لوحة التحكم الرئيسية مباشرة
        navigate("/seller/dashboard");
      };


    } catch (err) {
      console.error(err);
      setError(err.message);
      setError("Server error, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <div style={{ maxWidth: "350px", margin: "auto" }}>
        <h2>Verify Account</h2>
        <p>Please enter the verification code sent to you</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}