import { GithubUser } from "./github-user.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.onAdd();
    this.load();

    localStorage.setItem("githubUsers", []);
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@githubUsers")) || [];
    console.log(this.entries);
  }

  save() {
    localStorage.setItem("@githubUsers", JSON.stringify(this.entries));
  }

  async onAdd() {
    const addButton = this.root.querySelector(".search button");
    const addInput = this.root.querySelector(".search input");

    addButton.onclick = () => {
      this.add(addInput.value);
    };
  }
  async add(username) {
    if (this.entries.find((user) => user.login === username)) {
      alert("Esse usuário já existe!");
      return;
    }
    const newUser = await GithubUser.search(username);

    if(newUser.login === undefined) {
        alert("Este usuário não existe.")
        return
    }

    const addInput = this.root.querySelector(".search input");
    addInput.value = ""

    this.entries = [newUser, ...this.entries];
    this.save();
    this.updateView();
    this.entries 
  }

  

  remove(userLogin) {
    this.entries = this.entries.filter((entry) => entry.login !== userLogin);
    this.updateView();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");
    this.updateView();
  }

  updateView() {
    this.removeAllTr();

    const emptyTable = this.root.querySelector("#empty-table")

    if(this.entries < 1) {
        emptyTable.classList.remove("hide")
        return
    }
    emptyTable.classList.add("hide")


    this.entries.forEach((entry) => {
      const newRow = this.createRow();
      newRow.querySelector(
        ".user img"
      ).src = `https://github.com/${entry.login}.png`;
      newRow.querySelector(
        ".user a"
      ).href = `https://github.com/${entry.login}`;
      newRow.querySelector(".user a p").textContent = `/${entry.login}`;
      newRow.querySelector(".user a span").textContent = entry.name;
      newRow.querySelector(".repositories").textContent = entry.public_repos;
      newRow.querySelector(".followers").textContent = entry.followers;
      newRow.querySelector(".remove").onclick = () => {
        const isOK = confirm("Deseja remover este perfil?");
        if (isOK) {
          this.remove(entry.login);
        }
      };

      this.tbody.append(newRow);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td colspan="3">
        <div class="user"> 
          <img src="https://github.com/desireecvp.png" alt="">
          <a href="https://github.com/desireecvp"> <span>Desiree</span>
          <p>/desireecvp</p>
          </a>
        </div>
      </td>
      <td class="repositories">2</td>
      <td class="followers">2</td>
      <td class="remove">Remover</td>                                               
         `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
