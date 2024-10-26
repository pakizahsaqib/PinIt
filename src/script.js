const input = document.getElementById("taskInput");
const addbtn = document.getElementById("add");
const prioritySelector = document.getElementById("prioritySelector");
const urgent = document.getElementById("urgent");
const all = document.getElementById("all");
const pending = document.getElementById("pending");
const tasks =  JSON.parse(localStorage.getItem('notes'))||[];
const completed = document.getElementById("completed");
let editingIndex = -1; // Track the index of the task being edited
// Get the list items and target boxes
const lists = document.querySelectorAll('.list');
const rightBox = document.getElementById('right');
const leftBox = document.getElementById('left');
const middleBox = document.getElementById('middle');
const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const b3 = document.getElementById('b3');


document.addEventListener("DOMContentLoaded", () => {
    renderNotes(); // Call renderNotes to load saved tasks on page load
});
const createNotes = (task, index) => {
    const note = document.createElement("div");
    note.classList.add("drag","max-w-sm", "cursor-grab", "p-4", "rounded-bl-lg", "rotate-1", "relative", "mb-4", "flex", "flex-col", "justify-between","font-shantell", "text-sm", "md:text-md", "lg:text-lg", "shadow-3xl");
    note.draggable = true;
    // Set the background color based on priority
    if(task.priority === "high") {
        note.classList.add("bg-red-200");
    } else if (task.priority === "medium") {
        note.classList.add("bg-yellow-200");
    } else {
        note.classList.add("bg-blue-200");
    }

    const noteContent = document.createElement("p");
    noteContent.classList.add("p-4")
    noteContent.textContent = task.text;
  
    note.appendChild(noteContent);
    const pin = document.createElement("img");
    pin.src = "./icon.png";
    pin.classList.add("absolute","top-1","left-2","w-6","h-6","sm:w-8","sm:h-8", "rotate-2", "opacity-80", "hover:translate-x-[-1px]", "hover:translate-y-[-1px]" ,"hover:opacity-90")
    note.appendChild(pin);

    //note.appendChild(shadow);

    // Create controls div
    const controls = document.createElement("div");
    controls.classList.add("controls", "flex", "justify-end", "items-end", "gap-1", "md:gap-2", "mt-4");

    // Create icons and append to controls
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash cursor-pointer text-sm md:text-md lg:text-lg hover:text-red-500";
    trashIcon.addEventListener("click", () => deleteNote(index)); // Add delete functionality
    controls.appendChild(trashIcon);

    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen-to-square cursor-pointer text-sm md:text-md lg:text-lg hover:text-red-500";
    editIcon.addEventListener("click", () => editNote(index)); // Add edit functionality
    addbtn.innerText= "Add Task";
    controls.appendChild(editIcon);

    // Circle icon to mark task as completed or pending
    const circleIcon = document.createElement("i");
    circleIcon.className = `fa-circle text-sm md:text-md lg:text-lg hover:text-red-500 cursor-pointer ${task.status === "pending" ? "fa-regular" : "fa-solid"}`;
    circleIcon.addEventListener("click", () => {
        // Toggle task status
        task.status = (task.status === "pending" || (task.status === "pending" && task.priority === "urgent" ) ? "completed" : "pending");
        // Toggle circle icon class
        circleIcon.classList.toggle("fa-regular");
        circleIcon.classList.toggle("fa-solid");
        renderNotes();
    });
    controls.appendChild(circleIcon);
    note.appendChild(controls);
    if (task.priority === "high"  && task.status === "pending"){
        middleBox.appendChild(note)
    }
    else if (task.status === "completed"){
        rightBox.appendChild(note);
    }
    else {
        leftBox.appendChild(note);
    }
    
    note.addEventListener("dragstart", function(e) {
            selected = note; // Store the dragged item in the 'selected' variable
            console.log(selected);
    });
   
}
const clearNoteBody = ()=>{
    leftBox.innerHTML = "";
    middleBox.innerHTML = "";
    rightBox.innerHTML = "";
}
function highlightButton(button) {
    [all, pending, urgent, completed].forEach(btn => {
        btn.classList.remove("bg-red-500")
        btn.classList.add("bg-neutral-700")
        btn.classList.add("shadow-md");
        btn.classList.remove("translate-y-[2px]");
});
    button.classList.add("bg-red-500");
    button.classList.add("translate-y-[2px]");
    button.classList.remove("bg-neutral-700");
    button.classList.add("shadow-sm")
}
urgent.addEventListener("click", () => {
    highlightButton(urgent);
    clearNoteBody();
    urgentNotes();
    b2.classList.add("block")
    b2.classList.remove("hidden");
    b1.classList.add("hidden")
    b3.classList.add("hidden")
})
all.addEventListener('click', () => {
    highlightButton(all);
    renderNotes();
    console.log("All Clicked");
    b1.classList.add("block");
    b2.classList.add("block");
    b3.classList.add("block");
    b1.classList.remove("hidden");
    b2.classList.remove("hidden");
    b3.classList.remove("hidden");

});
pending.addEventListener('click', () => {
    highlightButton(pending);
    clearNoteBody();
    pendingNotes();
    console.log("Pending Clicked");
    b1.classList.add("block");
    b1.classList.remove("hidden");
    b2.classList.add("hidden");
    b3.classList.add("hidden");
});
completed.addEventListener('click', () => {
    b1.classList.add("hidden");
    b2.classList.add("hidden");
    b3.classList.remove("hidden");
    b3.classList.add("block");
    highlightButton(completed);
    clearNoteBody();
    completedNotes();
    console.log("Completed Clicked");
});

addbtn.addEventListener("click", () => {
    const taskValue = input.value.trim(); // Get input value and trim spaces
    if (taskValue !== "") {
        if (editingIndex === -1) { // If not editing, add new task
            const task = {
                text: taskValue,
                priority: prioritySelector.value, // Get the selected priority
                status: "pending"
            };
            tasks.push(task);
        } else { // If editing, update existing task
            tasks[editingIndex].text = taskValue; // Update task text
            tasks[editingIndex].priority = prioritySelector.value,
            console.log(`Task updated: ${tasks[editingIndex].text}`);
            editingIndex = -1; // Reset editing index after saving
        }
        input.value = ""; // Clear input field
        renderNotes(); // Re-render notes
    }
    console.log("Button Pressed, new task added/updated:", tasks);
});

const urgentNotes = () => {
    clearNoteBody();
    tasks.forEach((task, index) => { 
        if(task.priority === "high") {
            createNotes(task, index);
        }
    });
}


const completedNotes = () => {
    clearNoteBody();
    tasks.forEach((task, index) => { 
        if(task.status === "completed") {
            createNotes(task, index);
        }
    });
}
const pendingNotes = () => {
    clearNoteBody();
    tasks.forEach((task, index) => { 
        if(task.status === "pending") {
            createNotes(task, index);
        }
    });
}
// Function to delete a note
const deleteNote = (index) => {
    tasks.splice(index, 1);  // Remove the task from the tasks array
    renderNotes();           // Re-render the notes to reflect changes
}

const editNote = (index) => {
    input.value = tasks[index].text;  // Set the input field value to the task's text
    addbtn.innerText= "Update Task"
    editingIndex = index; // Set the editing index to the task being edited
}

function handleDragOver(e) {
    e.preventDefault(); // Allow drop by preventing default behavior
}

// Function to handle drop events for all boxes
function handleDrop(e) {
    e.preventDefault();
    const target = e.target.closest("#right, #left, #middle"); // Ensure the drop target is a valid box
    if (selected && target) {
        const taskIndex = tasks.findIndex((task) => task.text === selected.textContent.trim());

        if (taskIndex > -1) {
            if (target === leftBox) {
                tasks[taskIndex].status = "pending";
                tasks[taskIndex].priority = "low";
            } else if (target === middleBox) {
                tasks[taskIndex].status = "pending";
                tasks[taskIndex].priority = "high";
            } else if (target === rightBox) {
                tasks[taskIndex].status = "completed";
            }
        }

        target.appendChild(selected); // Append the dragged item to the valid box
        selected = null; // Clear the selected item after drop
        renderNotes(); // Re-render notes to reflect changes
    }
}

// Attach dragover and drop event listeners to each box
[rightBox, leftBox, middleBox].forEach((box) => {
    box.addEventListener("dragover", handleDragOver);
    box.addEventListener("drop", handleDrop);
});
const saveNotes = () => {
    localStorage.setItem('notes', JSON.stringify(tasks))  
}
const renderNotes = () => {
    // Clear the previous notes to avoid duplication
    clearNoteBody();
    tasks.forEach((task, index) => {
        createNotes(task, index);
    });
    saveNotes();
}

