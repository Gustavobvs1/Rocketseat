import React, { useEffect, useState } from "react";
import "./styles.css";
import { Card } from "../../components/Card";

export function Home() {
  const [studentName, setStudentName] = useState();
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState([{ name: "", avatar: "" }]);

  function handleAddStudent() {
    const newStudent = {
      name: studentName,
      time: new Date().toLocaleTimeString("pt-br", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setStudents((prevState) => [...prevState, newStudent]);
  }

  useEffect(() => {
    fetch("https://api.github.com/users/Gustavobvs1")
      .then((response) =>
        response.json().then((data) => {
          setUser({
            name: data.name,
            avatar: data.avatar_url,
          });
        })
      )
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Lista de presença</h1>
        <div>
          <strong>{user.name}</strong>
          <img src={user.avatar} alt="Foto de perfil" />
        </div>
      </header>
      <input
        type="text"
        placeholder="Insira seu nome...."
        onChange={(e) => setStudentName(e.target.value)}
      />
      <button type="button" onClick={handleAddStudent}>
        Enviar
      </button>

      {students.map((student) => (
        <Card name={student.name} time={student.time} key={student.time} />
      ))}
    </div>
  );
}
