//GET: domain:port/posts
//GET: domain:port/posts/id
async function LoadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();

  let body = document.getElementById("body");
  body.innerHTML = ""; // clear table trước khi load

  // Chỉ hiển thị những post chưa bị xoá mềm
  for (const post of posts) {
    if (!post.isDelete) {
      body.innerHTML += convertDataToHTML(post);
    }
  }
}

function convertDataToHTML(post) {
  let result = "<tr>";
  result += "<td>" + post.id + "</td>";
  result += "<td>" + post.title + "</td>";
  result += "<td>" + post.views + "</td>";
  result +=
    "<td><input type='submit' value='Delete' onclick='SoftDelete(" +
    post.id +
    ")'></input></td>";
  result += "</tr>";
  return result;
}

//POST: domain:port/posts + body
//POST: domain:port/posts + body
async function SaveData() {
  let title = document.getElementById("title").value;
  let view = document.getElementById("view").value;

  // Lấy danh sách posts hiện tại
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();

  let maxId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) : 0;
  let newId = maxId + 1;

  let dataObj = { id: newId, title: title, views: view, isDelete: false };

  let response = await fetch("http://localhost:3000/posts", {
    method: "POST",
    body: JSON.stringify(dataObj),
    headers: { "Content-Type": "application/json" },
  });

  console.log("Create:", await response.json());
  await LoadData();
}

//PUT xoá mềm (isDelete: true)
async function SoftDelete(id) {
  let check = await fetch("http://localhost:3000/posts/" + id);
  if (check.ok) {
    let post = await check.json();
    post.isDelete = true; // Đánh dấu xoá mềm

    let response = await fetch("http://localhost:3000/posts/" + id, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: { "Content-Type": "application/json" },
    });

    console.log("Soft delete:", await response.json());
  }
  await LoadData();
}

LoadData();
