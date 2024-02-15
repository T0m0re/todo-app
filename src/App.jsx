import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import moon from "./assets/images/icon-moon.svg";
import sun from "./assets/images/icon-sun.svg";
import crosss from "./assets/images/icon-cross.svg";
import check from "./assets/images/icon-check.svg";

const tod = [
  { message: "Buy Bread and fry akara", key: 1, active: true },
  { message: "reduce brigtness", key: 2, active: false },
  { message: "Go home", key: 3, active: true },
  { message: "Reduce global stupidity by 0.000001%", key: 4, active: false },
  { message: "Buy Bread and fry akara", key: 5, active: true },
  { message: "Buy Bread and fry akara", key: 6, active: true },
];

export default function App() {
  const [todos, setTodods] = useState(tod);
  const [mode, setMode] = useState("light"); // Default mode is light

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const deleteTodo = function (key) {
    setTodods((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const deleteCompleted = function () {
    setTodods((prevItems) => prevItems.filter((item) => item.active));
  };

  const [filter, setFilter] = useState("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") {
      return true;
    } else if (filter === "active") {
      return todo.active;
    } else if (filter === "completed") {
      return !todo.active;
    }
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const toggleTodoActive = (todoKey) => {
    setTodods((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.key === todoKey) {
          return { ...todo, active: !todo.active };
        }
        return todo;
      })
    );
  };
  return (
    <div className={`App ${mode}`}>
      <InputField
        setTodods={setTodods}
        todos={todos}
        mode={mode}
        setMode={setMode}
        toggleMode={toggleMode}
      />
      <TodoContainer
        filteredTodos={filteredTodos}
        deleteTodo={deleteTodo}
        handleFilterChange={handleFilterChange}
        todos={todos}
        toggleTodoActive={toggleTodoActive}
        deleteCompleted={deleteCompleted}
      />
    </div>
  );
}

function InputField({ setTodods, todos, mode, setMode, toggleMode }) {
  const [textInput, setTextInput] = useState("");
  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const getInput = function (e) {
    e.preventDefault();
    setTodods([
      { message: textInput, active: true, key: Date.now() },
      ...todos,
    ]);

    setTextInput("");
  };
  return (
    <div className="header">
      <div className="container p-header">
        <div className="logo__toggle">
          <h1>TODO</h1>
          <button onClick={toggleMode}>
            {mode === "light" ? (
              <img src={moon} alt="" />
            ) : (
              <img src={sun} alt="" />
            )}
          </button>
        </div>
        <div className="form-container mb-form-container br-form-container">
          <div className="circle"></div>
          <form action="" onSubmit={getInput}>
            <input
              type="text"
              name="todo"
              id="todo"
              value={textInput}
              onChange={handleInputChange}
              placeholder="Create a new todo"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

function TodoContainer({
  deleteTodo,
  handleFilterChange,
  filteredTodos,
  todos,
  toggleTodoActive,
  deleteCompleted,
}) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;
  };

  return (
    <div className="section-below">
      <div className="todo_container">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="container br-form-container flex-direction">
            <SortableContext
              items={filteredTodos}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <Todos
                  message={todo.message}
                  keyToDelete={todo.key}
                  deleteTodo={deleteTodo}
                  key={todo.key}
                  active={todo.active}
                  toggleTodoActive={toggleTodoActive}
                />
              ))}
            </SortableContext>
          </div>
          <FilterSection todos={todos} deleteCompleted={deleteCompleted} />
        </DndContext>
      </div>
      <FilterButtons handleFilterChange={handleFilterChange} />
      <div className="footer-section">
        <p>Drag and drop to reorder list</p>
      </div>
    </div>
  );
}

function Todos({ message, keyToDelete, deleteTodo, active, toggleTodoActive }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ keyToDelete });
  const style = { transition, transform: CSS.Transform.toString(transform) };
  return (
    <div
      className={`todo-box form-container border-form-container todo-padding ${
        !active ? "checked-active" : ""
      }`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="circle-container">
        <div className="circle" onClick={() => toggleTodoActive(keyToDelete)}>
          {!active && <img src={check} alt="" />}
        </div>
      </div>
      <div className="text">
        <p>{message}</p>
      </div>
      <img
        className="display__none"
        src={crosss}
        alt="close-icon"
        onClick={() => deleteTodo(keyToDelete)}
      />
    </div>
  );
}

function FilterSection({ todos, deleteCompleted }) {
  const [activeTodos, setActiveTodos] = useState([]);
  useEffect(
    function () {
      const getActivenumber = function () {
        return setActiveTodos(todos.filter((todo) => todo.active));
      };

      getActivenumber();
    },
    [todos]
  );
  return (
    <div className="container form-container todo-padding filter_section">
      <div className="filter">
        <p>{activeTodos.length} items left</p>
      </div>

      <div className="filter">
        <p onClick={deleteCompleted}>Clear completed</p>
      </div>
    </div>
  );
}

function FilterButtons({ handleFilterChange }) {
  const [activeButton, setActiveButton] = useState("all");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  return (
    <div className="buttons container form-container">
      <div className="button_container">
        <button
          className={`${activeButton === "all" ? "active__link" : ""}`}
          onClick={() => {
            handleFilterChange("all");
            handleButtonClick("all");
          }}
        >
          All
        </button>
        <button
          className={`${activeButton === "active" ? "active__link" : ""}`}
          onClick={() => {
            handleFilterChange("active");
            handleButtonClick("active");
          }}
        >
          Active
        </button>
        <button
          className={`${activeButton === "completed" ? "active__link" : ""}`}
          onClick={() => {
            handleFilterChange("completed");
            handleButtonClick("completed");
          }}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
