import { GitFavUsers } from "./githubUsers.js";

export class Git {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("Git-Fav:")) || [];
  }

  save() {
    localStorage.setItem("Git-Fav:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExist = this.entries.find((entry) => entry.login === username);
      if (userExist) {
        throw new Error("Usuário já está cadastrado!");
      }

      const user = await GitFavUsers.search(username);

      if (user.login !== username) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
      
    } catch (error) {
      alert(error.message);
    }
  }

  delete(users) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== users.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class GitView extends Git {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.onadd();
    this.update();
    
  }

  onadd() {
    const addButton = this.root.querySelector(".favorit");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
    this.createEntriesData();
  }


  createEntriesData() {
    this.entries.forEach((users) => {
      const row = this.createRow();

      row.querySelector(
        ".users img"
      ).src = `https://github.com/${users.login}.png`;
      row.querySelector(".users img").alt = `Imagem de ${users.username}`;
      row.querySelector(".users a").href = `https://github.com/${users.login}`;
      row.querySelector(".users p").textContent = users.name;
      row.querySelector(".users span").textContent = `/${users.login}`;
      row.querySelector(".repositories").textContent = users.public_repos;
      row.querySelector(".followers").textContent = users.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar este usuário?");
        if (isOk) {
          this.delete(users);
        }
      };
     
      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
        <td class="users">
        <img src="https://github.com/JeffS1lva.png" alt="Imagem de Perfil Jefferson">
          <a href="https://github.com/maykbrito" target="_blank">
             <p>Jeff Silva</p>
             <span>/jeffS1lva</span>
          </a>
        </td>
        <td class="repositories">
         20
        </td>
        <td class="followers">
         10
        </td>
        <td>
         <button class="remove">Remover</button>
        </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
