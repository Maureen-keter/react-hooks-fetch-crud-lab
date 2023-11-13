import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleFormSubmit = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions((prevQuestions) => [...prevQuestions, data]);
        setPage("List");
      })
      .catch((error) => console.error("Error adding question:", error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleUpdateCorrectIndex = (id, newCorrectIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === id ? { ...q, correctIndex: newCorrectIndex } : q))
        );
      })
      .catch((error) => console.error("Error updating correctIndex:", error));
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onSubmit={handleFormSubmit} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onUpdateCorrectIndex={handleUpdateCorrectIndex}
        />
      )}
    </main>
  );
}

export default App;



