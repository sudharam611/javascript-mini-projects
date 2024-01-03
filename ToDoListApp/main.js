const container = document.querySelector(".container");
// const menuBtn = document.querySelector(".menu-btn");
const backBtn = document.querySelector(".back-btn");
const addTaskBtn = document.querySelector(".add-task-btn");
const addTaskBox = document.querySelector(".add-task");
const blackBackDrop = document.querySelector(".black-backdrop");
const categoriesContainer = document.querySelector(".categories");
const categoryTitle = document.querySelector(".category-title");
const categoryTasks = document.querySelector(".category-tasks");
const categoryImg = document.querySelector("#category-img");
const totalTasks = document.querySelector(".totalTasks");

const toggleScreen = () => {
  container.classList.toggle("show-category");
};
const toggleAddTaskForm = () => {
  addTaskBox.classList.toggle("active");
  blackBackDrop.classList.toggle("active");
  addTaskBtn.classList.toggle("active");
};

const categories = [
  {
    title: "Personal",
    img: "personal.png",
  },
  {
    title: "Work",
    img: "work.png",
  },
  {
    title: "Shopping",
    img: "shopping.png",
  },
  {
    title: "Fitness",
    img: "fitness.png",
  },
  {
    title: "Education",
    img: "education.png",
  },
  {
    title: "Finance",
    img: "finance.png",
  },
];
let tasks = [
  {
    id: 1,
    task: "Go for a run",
    category: "Fitness",
    completed: false,
  },
  {
    id: 2,
    task: "Complete the course",
    category: "Education",
    completed: false,
  },
  {
    id: 3,
    task: "Buy 2 litres of milk",
    category: "Shopping",
    completed: false,
  },
  {
    id: 4,
    task: "Complete resume",
    category: "Work",
    completed: false,
  },
  {
    id: 5,
    task: "Do exercise",
    category: "Fitness",
    completed: false,
  },
  {
    id: 6,
    task: "Get chocolates",
    category: "Shopping",
    completed: false,
  },
  {
    id: 7,
    task: "Check updates",
    category: "Finance",
    completed: false,
  },
];

let selectedCategory = categories[0];
const calculateTotal = () => {
  const categoryTask = tasks.filter(
    (task) =>
      task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  categoryTasks.innerHTML = `${categoryTask.length} tasks`;
  totalTasks.innerHTML = tasks.length;
};

const renderCategories = () => {
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryTask = tasks.filter(
      (task) => task.category.toLowerCase() === category.title.toLowerCase()
    );
    const div = document.createElement("div");
    div.classList.add("category");

    div.addEventListener("click", () => {
      container.classList.toggle("show-category");
      selectedCategory = category;
      console.log(selectedCategory);
      categoryTitle.innerHTML = category.title;
      categoryImg.src = `images/${category.img}`;
      calculateTotal();
      renderTasks();
    });

    div.innerHTML = `
    <div class="left">
    <img src="images/${category.img}" alt="${category.title} Image" />
    <div class="content">
      <h1>${category.title}</h1>
      <p>${categoryTask.length} Tasks</p>
    </div>
  </div>
  <div class="right">
    <div class="options">
      <div class="toggle-btn">
        <i class="ri-more-2-fill"></i>
      </div>
    </div>
  </div>
    `;
    categoriesContainer.appendChild(div);
  });
};

const taskContainer = document.querySelector(".tasks");
const renderTasks = () => {
  console.log("Render Task", selectedCategory);
  taskContainer.innerHTML = "";
  const categoryTask = tasks.filter(
    (task) =>
      task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  console.log(selectedCategory);
  if (categoryTask.length === 0) {
    taskContainer.innerHTML = `
      <p class="no-task">No tasks found for this category</p>
      `;
  } else {
    categoryTask.forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task-wrapper");
      const label = document.createElement("label");
      label.classList.add("task");
      label.setAttribute("for", task.id);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = task.id;
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        const index = tasks.findIndex((t) => t.id === task.id);
        console.log(index);
        tasks[index].completed = !tasks[index].completed;
        console.log(tasks);
        saveLocal();
      });
      div.innerHTML = `
      <div class="delete">
                <i class="ri-delete-bin-6-line"></i>
              </div>`;
      label.innerHTML = `
      <span class="checkmark">
      <i class="ri-check-line"></i>
    </span>
    <p>${task.task}</p>
    `;

      label.prepend(checkbox);
      div.prepend(label);
      taskContainer.appendChild(div);
      // console.log(category);

      const deleteBtn = div.querySelector(".delete");
      deleteBtn.addEventListener("click", () => {
        const index = tasks.findIndex((t) => t.id === task.id);
        tasks.splice(index, 1);
        saveLocal();
        renderTasks();
        calculateTotal();
      });
    });
    renderCategories();
    calculateTotal();
  }
};

// menuBtn.addEventListener("click", toggleScreen);
backBtn.addEventListener("click", toggleScreen);
addTaskBtn.addEventListener("click", toggleAddTaskForm);

const saveLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
const getLocal = () => {
  const localTasks = JSON.parse(localStorage.getItem("tasks"));
  if (localTasks) {
    tasks = localTasks;
  }
};

const categorySelect = document.querySelector("#category-select");
const cancelBtn = document.querySelector(".cancel-btn");
const addBtn = document.querySelector(".add-btn");
cancelBtn.addEventListener("click", toggleAddTaskForm);
const taskInput = document.querySelector("#task-input");
addBtn.addEventListener("click", () => {
  const task = taskInput.value;
  const category = categorySelect.value;
  console.log(task, categorySelect);
  if (task === "") {
    alert("Please write something in task");
  } else {
    const newTask = {
      id: tasks.length + 1,
      task,
      category,
      completed: false,
    };
    tasks.push(newTask);
    taskInput.value = "";
    saveLocal();
    toggleAddTaskForm();
    renderTasks();
    location.reload();
  }
});
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category.title.toLowerCase();
  option.textContent = category.title;
  categorySelect.appendChild(option);
});

getLocal();
calculateTotal();
renderCategories();
// renderTasks();
