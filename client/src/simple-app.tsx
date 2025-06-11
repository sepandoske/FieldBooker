import React from "react";

function SimpleApp() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth_token", data.token);
        setIsLoggedIn(true);
        setError("");
      } else {
        setError("خطأ في تسجيل الدخول");
      }
    } catch (err) {
      setError("خطأ في الاتصال");
    }
  };

  if (!isLoggedIn) {
    return React.createElement(
      "div",
      { 
        className: "min-h-screen bg-blue-50 flex items-center justify-center p-4",
        dir: "rtl",
        style: { fontFamily: "Arial, sans-serif" }
      },
      React.createElement(
        "div",
        { className: "bg-white p-8 rounded-lg shadow-lg w-full max-w-md" },
        React.createElement("h1", { className: "text-2xl font-bold text-center mb-6" }, "حجز ملعب كرة القدم"),
        React.createElement("h2", { className: "text-xl mb-4 text-center" }, "تسجيل الدخول"),
        React.createElement(
          "form",
          { onSubmit: handleLogin, className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium mb-2" }, "اسم المستخدم"),
            React.createElement("input", {
              type: "text",
              value: username,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
              className: "w-full p-3 border border-gray-300 rounded-md",
              required: true
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium mb-2" }, "كلمة المرور"),
            React.createElement("input", {
              type: "password",
              value: password,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
              className: "w-full p-3 border border-gray-300 rounded-md",
              required: true
            })
          ),
          error && React.createElement("div", { className: "text-red-600 text-center" }, error),
          React.createElement(
            "button",
            {
              type: "submit",
              className: "w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
            },
            "دخول"
          )
        ),
        React.createElement(
          "div",
          { className: "mt-4 text-center text-sm text-gray-600" },
          React.createElement("p", null, "بيانات التجربة:"),
          React.createElement("p", null, "المستخدم: admin"),
          React.createElement("p", null, "كلمة المرور: 123456")
        )
      )
    );
  }

  return React.createElement(
    "div",
    { 
      className: "min-h-screen bg-gray-50",
      dir: "rtl",
      style: { fontFamily: "Arial, sans-serif" }
    },
    React.createElement(
      "div",
      { className: "container mx-auto p-4" },
      React.createElement("h1", { className: "text-3xl font-bold text-center mb-8" }, "نظام حجز ملعب كرة القدم"),
      React.createElement(
        "div",
        { className: "bg-white p-6 rounded-lg shadow-lg" },
        React.createElement("h2", { className: "text-xl font-bold mb-4" }, "مرحباً بك في النظام"),
        React.createElement("p", { className: "mb-4" }, "تم تسجيل الدخول بنجاح!"),
        React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          React.createElement(
            "div",
            { className: "bg-blue-50 p-4 rounded-lg" },
            React.createElement("h3", { className: "font-bold mb-2" }, "الحجز الجديد"),
            React.createElement("p", { className: "text-sm mb-4" }, "احجز موعدك المفضل"),
            React.createElement(
              "button",
              { className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" },
              "حجز جديد"
            )
          ),
          React.createElement(
            "div",
            { className: "bg-green-50 p-4 rounded-lg" },
            React.createElement("h3", { className: "font-bold mb-2" }, "لوحة الإدارة"),
            React.createElement("p", { className: "text-sm mb-4" }, "إدارة الحجوزات"),
            React.createElement(
              "button",
              { className: "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700" },
              "لوحة الإدارة"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "mt-6" },
          React.createElement(
            "button",
            {
              onClick: () => {
                localStorage.removeItem("auth_token");
                setIsLoggedIn(false);
              },
              className: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            },
            "تسجيل الخروج"
          )
        )
      )
    ),
    React.createElement(
      "footer",
      { className: "bg-gray-800 text-white text-center py-4 mt-8" },
      React.createElement("p", null, "تطوير: Sepan_b_ahmad")
    )
  );
}

export default SimpleApp;