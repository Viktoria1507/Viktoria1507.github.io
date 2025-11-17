const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    let text = input.value.trim();
    if (text === "") return;

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    let span = document.createElement("span");
    span.textContent = text;

    checkbox.onclick = () => {
        if (checkbox.checked) {
            span.style.textDecoration = "line-through";
        } else {
            span.style.textDecoration = "none";
        }
    };

    let btn = document.createElement("button");
    btn.textContent = "✖";
    btn.className = "deleteBtn";
    btn.onclick = () => li.remove();

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btn);

    list.appendChild(li);

    input.value = "";
    input.focus();
}
