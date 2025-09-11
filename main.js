//GET: domain:port/posts
//GET: domain:port/posts/id
async function LoadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();
  let body = document.getElementById("body");
  body.innerHTML = ""; // clear table trước khi load
  for (const post of posts) {
    body.innerHTML += convertDataToHTML(post);
  }
}

function convertDataToHTML(post) {
  let result = "<tr>";
  result += "<td>" + post.id + "</td>";
  result += "<td>" + post.title + "</td>";
  result += "<td>" + post.views + "</td>";
  result +=
    "<td><input type='submit' value='Delete' onclick='Delete(" +
    post.id +
    ")'></input></td>";
  result += "</tr>";
  return result;
}

//POST: domain:port//posts + body
async function SaveData() {
  let id = document.getElementById("id").value;
  let title = document.getElementById("title").value;
  let view = document.getElementById("view").value;

  let check = await fetch("http://localhost:3000/posts/" + id);

  if (check.ok) {
    let dataObj = { title: title, views: view };
    let response = await fetch("http://localhost:3000/posts/" + id, {
      method: "PUT",
      body: JSON.stringify(dataObj),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Update:", await response.json());
  } else {
    let dataObj = { id: id, title: title, views: view };
    let response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      body: JSON.stringify(dataObj),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Create:", await response.json());
  }

  await LoadData();
}

//DELETE: domain:port/posts/id
async function Delete(id) {
  await fetch("http://localhost:3000/posts/" + id, {
    method: "DELETE",
  });
  console.log("Xóa thành công:", id);

  await LoadData();
}

LoadData();
