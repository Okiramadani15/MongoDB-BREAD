let title = "",
  page = 1,
  complete = "",
  startdateDeadline = "",
  enddateDeadline = "",
  sortBy = "_id",
  sortMode = "desc",
  limit = 5,
  executor = executorId,
  deadline = null,
  todoId = null,
  id = null;

function setExecutor(userId) {
  executor = userId;
  readData();
}

function setId(_id) {
  id = _id;
  console.log(`${"id"}`);
}

async function find() {
  page = 1;
  title = $("#title").val();
  startdateDeadline = $("#startDate").val();
  enddateDeadline = $("#endDate").val();
  if ($("#complete-choose").val()) {
    console.log(complete);
    complete = $("#complete-choose").val();
  }

  const response = await fetch(
    `http://localhost:3000/api/todos/?executor=${executor}&title=${title}&limit${limit}&startdateDeadline=${startdateDeadline}&enddateDeadline=${enddateDeadline}&complete=${complete}&sortBy=${sortBy}&sortMode=${sortMode}`
  );
  console.log(response);
  const todos = await response.json();
  let html = "";
  const offset = todos.offset;

  todos.data.forEach((item, index) => {
    html += `
        <div id="data-show${item._id}" class="data-show ${item.complete == false && new Date().getTime() > new Date(`${item.deadline}`).getTime() ? "bg-danger-subtle" : item.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"}">
            <span class="form-control border-0 bg-transparent ps-0">${moment(item.deadline).format("DD-MM-YYYY, HH:mm")} ${item.title}</span>
            <button type="button" class="btn p-1" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
            <button type="button" class="btn p-1" onclick="setId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
  });

  $("#todo-list").html(html);
}

async function findReset() {
  try {
    page = 1;
    title = "";
    $("#title").html("");
    startdateDeadline = "";
    $("#startDate").val("");
    enddateDeadline = "";
    $("#endDate").val("");
    complete = "";
    $("#complete-choose").prop('selectedIndex',0);
    const response = await fetch(
      `http://localhost:3000/api/todos/?executor=${executor}&title=${title}&limit${limit}&startdateDeadline=${startdateDeadline}&enddateDeadline=${enddateDeadline}&complete=${complete}&sortBy=${sortBy}&sortMode=${sortMode}`
    );
    const todos = await response.json();
    let html = "";
    const offset = todos.offset;

    todos.data.forEach((item, index) => {
      html += `
            <div id="data-show${item._id}" class="data-show ${
        item.complete == false && new Date().getTime() > new Date(`${item.deadline}`).getTime() ? "bg-danger-subtle" : item.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"
      }">
                <span class="form-control border-0 bg-transparent ps-0">${moment(item.deadline).format("DD-MM-YYYY, HH:mm")} ${item.title}</span>
                <button type="button" class="btn p-1" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
                <button type="button" class="btn p-1" onclick="setId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
    });

    $("#todo-list").html(html);
    readData();
  } catch (error) {
    html;
    console.log("ini errornya =>", error);
  }
}

const sortDeadlineAsc = async (deadline) => {
  try {
    console.log(startdateDeadline,enddateDeadline)
    page = 1;
    sortBy = deadline;
    sortMode = "asc";
    let sortasc = `
        <a id="sortDeadline" class="btn p-0" onclick="sortDeadlineDesc('deadline')">
        <div  class="d-inline-block position-relative" style="height: 10px;">
            <i class="fa-solid fa-caret-up position-absolute bottom-0 start-0 p-0"
                  style="color: #ffffff;"></i></div>
        <span class="ms-3 fw-bold">sort by deadline</span></a>
  `;
    $(`#btn-${deadline}`).html(sortasc);
    const response = await fetch(
      `http://localhost:3000/api/todos/?executor=${executor}&title=${title}&limit${limit}&startdateDeadline=${startdateDeadline}&enddateDeadline=${enddateDeadline}&complete=${complete}&sortBy=${sortBy}&sortMode=${sortMode}`
    );
    console.log(response);
    const todos = await response.json();
    let html = "";
    const offset = todos.offset;

    todos.data.forEach((item, index) => {
      html += `
        <div id="data-show${item._id}" class="data-show ${item.complete == false && new Date().getTime() > new Date(`${item.deadline}`).getTime() ? "bg-danger-subtle" : item.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"}">
            <span class="form-control border-0 bg-transparent ps-0">${moment(item.deadline).format("DD-MM-YYYY, HH:mm")} ${item.title}</span>
            <button type="button" class="btn p-1" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
            <button type="button" class="btn p-1" onclick="setId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      $("#todo-list").html(html);
    });
  } catch (err) {
    console.log(err);
  }
};

const sortDeadlineDesc = async (deadline) => {
    console.log('sort jalan')
  try {
    page = 1;
    sortBy = deadline;
    sortMode = "desc";
    let sortdesc = `
        <a  id="sortDeadline" class="btn btn p-0" onclick="sortDeadlineAsc('deadline')">
            <div  class="d-inline-block position-relative" style="height: 10px;">   
               <i class="fa-solid fa-sort-down" style="color: #ffffff;"></i>
            </div>
        <span class="ms-3 fw-bold">sort by deadline</span></a>
  `;
    $(`#btn-${deadline}`).html(sortdesc);
    const response = await fetch(
      `http://localhost:3000/api/todos/?executor=${executor}&title=${title}&limit${limit}&startdateDeadline=${startdateDeadline}&enddateDeadline=${enddateDeadline}&complete=${complete}&sortBy=${sortBy}&sortMode=${sortMode}`
    );
    const todos = await response.json();
    let html = "";
    const offset = todos.offset;

    todos.data.forEach((item, index) => {
      html += `
        <div id="data-show${item._id}" class="data-show ${item.complete == false && new Date().getTime() > new Date(`${item.deadline}`).getTime() ? "bg-danger-subtle" : item.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"}">
            <span class="form-control border-0 bg-transparent ps-0">${moment(item.deadline).format("DD-MM-YYYY, HH:mm")} ${item.title}</span>
            <button type="button" class="btn p-1" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
            <button type="button" class="btn p-1" onclick="setId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      $("#todo-list").html(html);
    });
  } catch (err) {
    console.log("ini errornya bro => ", err);
  }
};


//scroll pagination
$(window).scroll(function () {
  if ($(document).scrollTop() >= $(document).height() - ($(window).height() + 5)) {
    page += 1;
    readData();
  }
});
//scroll pagination done

const deleteForm = new bootstrap.Modal("#deleteData", {
  keyboard: false,
});

const updateForm = new bootstrap.Modal("#updateData", {
  keyboard: false,
});

const readData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/todos/?executor=${executor}&page=${page}&limit${limit}&title=${title}&startdateDeadline=${startdateDeadline}&enddateDeadline=${enddateDeadline}&complete=${complete}&sortBy=${sortBy}&sortMode=${sortMode}`
    );
    const todos = await response.json();
    let html = "";
    const offset = todos.offset;
    todos.data.forEach((item, index) => {
      return (html += `
            <div id="data-show${item._id}" class="data-show ${
        item.complete == false && new Date().getTime() > new Date(`${item.deadline}`).getTime() ? "bg-danger-subtle" : item.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"
      }">
                <span class="form-control border-0 bg-transparent ps-0">${moment(item.deadline).format("DD-MM-YYYY HH:mm ")} ${item.title}</span>
                <button type="button" class="btn p-1" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
                <button type="button" class="btn p-1" onclick="setId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
            </div>
          `);
    });
    $("#todo-list").append(html);
  } catch (err) {
    console.log(err);
  }
};

const addData = async (event) => {
  event.preventDefault();
  try {
    const title = $("#add-title").val();
    const response = await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, executor }),
    });
    const todos = await response.json();

    $("#todo-list").prepend(`
        <div id="data-show${todos._id}" class="data-show ${
      todos.complete == false && new Date().getTime() > new Date(`${todos.deadline}`).getTime() ? "bg-danger-subtle" : todos.complete == true ? "bg-success-subtle" : "bg-secondary-subtle"
    }">
        <span class="form-control border-0 bg-transparent ps-0"> ${moment(new Date(Date.now() + 24 * 60 * 60 * 1000)).format("DD-MM-YYYY, HH:mm")} ${title}</span>
        <button type="button" class="btn p-1" onclick="getData('${todos._id}')"  data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
        <button type="button" class="btn p-1" onclick="setId('${todos._id}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
        </div>
        `);
    $("#add-title").val("");

    console.log(response, todos);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const todos = await response.json();
    $(`#data-show${id}`).remove();
    deleteForm.hide();
  } catch (err) {
    console.log(err);
  }
};

const getData = async (_id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/todos/${_id}`);
    const todo = await response.json();
    const todoComplete = JSON.parse(todo.complete);
    todoId = _id;
    $("#utitle").val(todo.title);
    $("#udeadline").val(moment(todo.deadline).format("YYYY-MM-DDThh:mm"));
    $("#ucomplete").prop("checked", todoComplete);
    updateForm.show();
  } catch (error) {
    console.log("ini errornya => ", error);
  }
};

const updateData = async () => {
  const title = $("#utitle").val();
  const deadline = $("#udeadline").val();
  const complete = $("#ucomplete").prop("checked");
  const response = await fetch(`http://localhost:3000/api/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, deadline, complete: Boolean(complete) }),
  });
  const todos = await response.json();

  const rubah = `
        <span class="form-control border-0 bg-transparent ps-0">${moment(deadline).format("DD-MM-YYYY, HH:mm")} ${title}</span>
        <button type="button" class="btn p-1" onclick="getData('${todoId}')" data-bs-toggle="modal" data-bs-target="#updateData"><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
        <button type="button" class="btn p-1" onclick="setId('${todoId}')" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
  `;

  $(`#data-show${todoId}`)
    .attr("class", `${complete == false && new Date().getTime() > new Date(`${deadline}`).getTime() ? "data-show bg-danger-subtle" : complete == true ? "data-show bg-success-subtle" : " data-show bg-secondary-subtle"}`)
    .html(rubah);
  updateForm.hide();
};

readData();
