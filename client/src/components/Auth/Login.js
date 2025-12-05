import React, { useState } from "react";

const Login = ({ setAuth, toggleAuthForm }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;
    const API_URL = "http://localhost:3001/api/auth/login";

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
                console.log("Login bem-sucedido. Token recebido:", data.token);

                localStorage.setItem("token", data.token);

                setAuth(true);
            } else {
                console.error("Erro no login:", data.msg);
                alert(data.msg);
            }
        } catch (err) {
            console.error("Erro de conexão:", err);
            alert("Falha na conexão com o servidor.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="auth-form">
            <h2>Login</h2>
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
                placeholder="Senha"
                name="password"
                value={password}
                onChange={onChange}
                required
            />
            <button type="submit">
                Entrar
            </button>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Não tem conta? <a href="#!" onClick={toggleAuthForm}>Registre-se</a>
            </p>

        </form>
    );
};

export default Login;