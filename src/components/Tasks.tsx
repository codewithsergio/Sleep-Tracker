import "../styles/Tasks.css";

function Tasks() {
  return (
    <div className="tasks-component">
      <h1># goals to do today!</h1>
      <div id="add-today-task-button">Add new daily task</div>
      <div id="add-task-button">Add new task</div>
      <div className="task-list">
        <div className="card">
          <div>icon</div>
          <h2>Make my bed</h2>
          <div>checkmark</div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
