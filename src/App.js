import React, { useState, useEffect } from "react";
import { List, AddList, Tasks } from "./components";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("http://localhost:3001/colors")
      .then(({ data }) => {
        setColors(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const listId = location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, location.pathname]);

  function onAddList(obj) {
    const newList = [...lists, obj];
    setLists(newList);
  }

  function onAddTask(listId, taskObj) {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  }

  function onCompleteTask(listId, taskId, completed){

    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskId, {
        completed
      })
      .catch(() => {
        alert("Не удалось обновить задачу");
      });
  }

  function onEditTask(listId, taskObj) {
    const newTaskText = window.prompt("Текст задачи", taskObj.text);
    
    if(!newTaskText){
      return;
    }
    
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, {
        text: newTaskText
      })
      .catch(() => {
        alert("Не удалось обновить задачу");
      });
  }

  function onRemoveTask(listId, taskId) {
    if (window.confirm("Вы действительно хотите удалить задачу?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
        alert("Не удалось удалить задачу");
      });
    }
  }

  function onEditListTitle(id, title) {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  }

  return (
    <>
      <div className="todo">
        <div className="todo__sidebar">
          <List
            onClickItem={(item) => {
              navigate("/");
            }}
            items={[
              {
                active: location.pathname === '/',
                icon: (
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1" cy="1" r="1" fill="#7C7C7C" />
                    <circle cx="1" cy="5" r="1" fill="#7C7C7C" />
                    <circle cx="1" cy="9" r="1" fill="#7C7C7C" />
                    <rect
                      x="4"
                      width="11.4286"
                      height="2"
                      rx="1"
                      fill="#7C7C7C"
                    />
                    <rect
                      x="4"
                      y="4"
                      width="10"
                      height="2"
                      rx="1"
                      fill="#7C7C7C"
                    />
                    <rect
                      x="4"
                      y="8"
                      width="12"
                      height="2"
                      rx="1"
                      fill="#7C7C7C"
                    />
                  </svg>
                ),
                name: "Все задачи",
              },
            ]}
          />
          {lists ? (
            <List
              items={lists}
              onRemove={(id) => {
                const newLists = lists.filter((item) => item.id !== id);
                setLists(newLists);
              }}
              onClickItem={(item) => {
                navigate(`/lists/${item.id}`);
              }}
              activeItem={activeItem}
              isRemovable
            />
          ) : (
            "Загрузка..."
          )}
          <AddList onAdd={onAddList} colors={colors} />
        </div>
        <div className="todo__tasks">
          <Routes>
            <Route
              exact
              path="/"
              element={
                lists &&
                lists.map((list) => (
                  <Tasks
                    key={list.id}
                    list={list}
                    onEditTitle={onEditListTitle}
                    onAddTask={onAddTask}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                    withoutEmpty
                  />
                ))
              }
            />
            <Route
              path="/lists/:id"
              element={
                lists &&
                activeItem && (
                  <Tasks
                    list={activeItem}
                    onEditTitle={onEditListTitle}
                    onAddTask={onAddTask}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                  />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
