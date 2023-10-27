let title = '', complete = '', strdeadline = '', enddeadline = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = null, deadline = null, todoId = null

function setExecutor(userId) {
    executor = userId
    readData()
}

async function find() {
    try {
        let getTitle = $("#title").val();
        title = getTitle.toString()
        strdeadline = $("#strDate").val();
        enddeadline = $("#endDate").val();
        complete = $("#complete").val();
        readData()
    } catch (error) {
        console.log('ini errornya =>', error)
    }
}

async function findReset() {
    try {
        let getSearch = $("#title").val("")
        title = getSearch.toString()
        strdeadline = $("#strDate").val("")
        enddeadline = $("#endDate").val("")
        complete = $("#complete").val("")
        readData()
    } catch (error) {
        console.log('ini errornya =>', error)
    }
}

const readData = async(page = 1) => {
    try {
        console.log(executor)
        const response = await fetch(
            `http://localhost:3000/api/todos/?executor=${executor}&page=${page}&title=${title}&strdeadline=${strdeadline}&enddeadline=${enddeadline}&complete=${complete}`
        );
        console.log(response)
        const todos = await response.json();
        let html = "";
        const offset = todos.offset
            console.log(todos)
        todos.data.forEach((item, index) => {
            html += `
            <div>
            <div class="data-show ${item.complete ? ' bg-success-subtle' : ' --bs-body-bg'}">
                <span class="form-control border-0 bg-transparent ps-0">${item.deadline} ${item.title}</span>
                <button type="button" class="btn p-1" ><i class="fa-sharp fa-solid fa-pencil"></i></button>&nbsp;
                <button type="button" class="btn p-1" ><i class="fa-solid fa-trash"></i></button>
            </div>
            </div>
          `
        })

        $("#todo-list").html(html);

    } catch (err) { console.log(err) }
}

const addData = async () => {
    try {
        const title = $("#add-title").val();
        const response = await fetch("http://localhost:3000/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, executor }),
        })
        const todos = await response.json();

        readData()
        $("#add-title").val('');

    } catch (err) { console.log(err) }
}
