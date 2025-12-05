import React, { useState } from "react";

const Register = ({ setAuth, toggleAuthForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const API_URL = "http://localhost:3001/api/auth/register";

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Registro bem-sucedido:", data.msg);
        alert("Registro bem-sucedido! Agora faça o login.");

        setFormData({ email: "", password: "" });
      } else {
        console.error("Erro no registro:", data.msg);
        alert(data.msg);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Falha na conexão com o servidor.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">

      <h2>Criar Conta</h2>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        placeholder="Senha (Mínimo 6 caracteres)"
        name="password"
        value={password}
        onChange={onChange}
        required
        minLength="6"
      />
      <button
        type="submit"
      >
        Registar
      </button>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Já tem conta?{" "}
        <a href="#!" onClick={toggleAuthForm}>
          Entrar
        </a>
      </p>
    </form>
  );
};

export default Register;
