import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const PORT = 3000;
const server = express();

server.use(
  session({
    secret: "G0ku1SB33tter02",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  }),
);

let leitores = [];
let livros = [];

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

// ==> rota login - pag
server.get("/login", (req, res) => {
  const ultAcesso =
    req.cookies?.ultAcesso || "Nenhum acesso anterior identificado";

  res.write(`<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login - Biblioteca</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>

  <body class="bg-dark d-flex align-items-center justify-content-center vh-100">
`);
  res.write(`<div class="container">
      <div class="row justify-content-center">
        
        <div class="col-md-5 col-lg-4">
          
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">

              <form action="/login" method="POST">
                
                <h1 class="h4 mb-4 text-center text-primary">
                Biblioteca
                </h1>

                <div class="form-floating mb-3">
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    placeholder="nome@email.com"
                  />
                  <label for="email">Email</label>
                </div>

                <div class="form-floating mb-3">
                  <input
                    type="password"
                    class="form-control"
                    id="senha"
                    name="senha"
                    placeholder="Senha"
                  />
                  <label for="senha">Senha</label>
                </div>

                <button class="btn btn-primary w-100 py-2" type="submit">
                  Entrar
                </button>

                <p class="mt-4 text-center text-secondary small">
                  Último acesso: ${ultAcesso}
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
`);
  res.write(`    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>`);
  res.end();
});

// ==> login validacao

server.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  if (email === "admin@teste.com.br" && senha === "admin") {
    req.session.logado = true;
    req.session.nomeUsuario = "Administrador";

    const dataUltimoAcesso = new Date();
    res.cookie("ultAcesso", dataUltimoAcesso.toLocaleString());
    res.redirect("/");
  } else {
    const ultAcesso =
      req.cookies?.ultAcesso || "Nenhum acesso anterior identificado";

    res.write(`<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login - Biblioteca</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>

  <body class="bg-dark d-flex align-items-center justify-content-center vh-100">
`);
    res.write(`<div class="container">
      <div class="row justify-content-center">
        
        <div class="col-md-5 col-lg-4">
          
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">

              <form action="/login" method="POST">
                
                <h1 class="h4 mb-4 text-center text-primary">
                Biblioteca
                </h1>

                <div class="form-floating mb-3">
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    placeholder="nome@example.com"
                  />
                  <label for="email">Email</label>
                </div>

                <div class="form-floating mb-3">
                  <input
                    type="password"
                    class="form-control"
                    id="senha"
                    name="senha"
                    placeholder="Senha"
                  />
                  <label for="senha">Senha</label>
                </div>

                <button class="btn btn-primary w-100 py-2" type="submit">
                  Entrar
                </button>

                <p class="mt-4 text-center text-secondary small">
                  Último acesso: ${ultAcesso}
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
`);
    res.write(`    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>`);
    res.end();
  }
});

server.get("/", autenticado, (req, res) => {
  const ultAcesso =
    req.cookies?.ultAcesso || "Nenhum acesso anterior identificado";

  res.write(`
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Menu do sistema</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>

  <body class="bg-body-tertiary">

`);

  res.write(`
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
      
      <a class="navbar-brand fw-semibold" href="/"> Biblioteca</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Cadastro
            </a>

            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/CadastroLivros">Cadastrar Livro</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="/CadastroLeitor">Cadastro de Leitores</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="/listaLivros">Lista Livros</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="/listaLeitor">Lista Leitores</a></li>

            </ul>
          </li>

        </ul>

        <span class="navbar-text text-white me-3">
           ${req.session.nomeUsuario}
        </span>

        <a class="btn btn-outline-light btn-sm" href="/logout">
          Logout
        </a>

      </div>
    </div>
  </nav>

  <div class="container mt-5">

    <div class="card shadow-sm border-0">
      <div class="card-body p-4">

        <h4 class="mb-3">
          Bem-vindo, <span class="text-primary">${req.session.nomeUsuario}</span> 
        </h4>

        <p class="text-secondary">
          Utilize o menu acima para navegar pelo sistema de gerenciamento da biblioteca.
        </p>

        <p class="text-secondary small">
          Último acesso: <strong>${ultAcesso}</strong>
        </p>

      </div>
    </div>

  </div>
`);

  res.write(`
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`);

  res.end();
});

// ==> rota sair
server.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ==> rota p cadastros de livro
server.get("/CadastroLivros", autenticado, (req, res) => {
  res.write(`
<html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Cadastro de Livro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>

  <body class="bg-body-tertiary">

    <div class="container d-flex justify-content-center align-items-center vh-100">
      
      <div class="col-md-6 col-lg-5">

        <form method="POST" action="/CadastroLivros" class="card shadow-sm border-0 p-4">

          <legend class="mb-3 text-center">
            <h3 class="text-primary">Cadastro de Livro</h3>
          </legend>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Título do livro..">
            <label for="titulo">Título do Livro</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="autor" name="autor" placeholder="Nome do autor..">
            <label for="autor">Nome do Autor</label>
          </div>

          <div class="form-floating mb-4">
            <input type="text" class="form-control" id="isbn" name="isbn" placeholder="ISBN..">
            <label for="isbn">Código ISBN || Identificação do livro</label>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">
            Cadastrar Livro
          </button>

        </form>

      </div>

    </div>

  </body>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</html>
`);
  res.end();
});

server.post("/CadastroLivros", autenticado, (req, res) => {
  const titulo = req.body.titulo;
  const autor = req.body.autor;
  const isbn = req.body.isbn;

  if (!titulo || !autor || !isbn) {
    let html = `
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Formulário de cadastro de Produto</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">
                    <form method="POST" action="/CadastroLivros" class="row gy-2 gx-3 align-items-center border p-3">
                        <legend><h3>Cadastro de Produtos</h3></legend>

                        <div class="row">
                            <label class="colFormLabel" for="titulo">Título do Livro</label>
                            <input type="text" class="form-control" id="titulo" name="titulo" value="${titulo}">`;
    if (!titulo) {
      html += `<div class="alert alert-danger" role="alert">Por favor informe o Título do Lívro.</div>`;
    }
    html += `
                        </div>
                        <div class="row">
                            <label class="colFormLabel" for="autor">Autor do Livro</label>
                            <input type="text" class="form-control" id="autor" name="autor" value="${autor}">`;
    if (!autor) {
      html += `<div class="alert alert-danger" role="alert">Por favor, informe o autor do Livro.</div>`;
    }
    html += `
                        </div>
                        <div class="row">
                            <label class="colFormLabel" for="isbn">ISBN</label>
                            <input type="number" class="form-control" id="isbn" name="isbn" value="${isbn}">`;
    if (!isbn) {
      html += `<div class="alert alert-danger" role="alert">Por favor, informe o ISBN do Livro.</div>`;
    }

    

    html += `
              <button type="submit" class="btn btn-primary w-100 py-2">
            Cadastrar Leitor
          </button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `;

    res.write(html);
    res.end();
  } else {
    livros.push({
      titulo: titulo,
      autor: autor,
      isbn: isbn,
    });

    res.redirect("/listaLivros");
  }
});

server.get("/listaLivros", autenticado, (req, res) => {
  const ultimoAcesso =
    req.cookies?.ultAcesso || "Nenhum acesso anterior identificado.";

  res.write(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Lista de Livros</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">

                    <p class="text-body-secondary">Último acesso ao sistema: <strong>${ultimoAcesso}</strong></p>

                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Título</th>
                                <th scope="col">Autor</th>
                                <th scope="col">ISBN</th>
                            </tr>
                        </thead>
                        <tbody>
    `);

  for (let i = 0; i < livros.length; i++) {
    const livro = livros[i];
    res.write(`
            <tr>
                <td>${i + 1}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.isbn}</td>
            </tr>
        `);
  }

  res.write(`
                        </tbody>
                    </table>
                    <a href="/CadastroLivros" class="btn btn-primary">Continuar cadastrando...</a>
                    <a href="/" class="btn btn-secondary ms-2">Voltar ao menu</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </html>
    `);
  res.end();
});

// ==> rota para cadastro de leitor
server.get("/CadastroLeitor", autenticado, (req, res) => {
  let opcoesLivros = `<option value="">Selecione um livro</option>`;
  for (let i = 0; i < livros.length; i++) {
    opcoesLivros += `<option value="${livros[i].titulo}">${livros[i].titulo}</option>`;
  }

  res.write(`
<html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Cadastro de Leitor</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>

  <body class="bg-body-tertiary">

    <div class="container d-flex justify-content-center align-items-center vh-100">
      
      <div class="col-md-6 col-lg-5">

        <form method="POST" action="/CadastroLeitor" class="card shadow-sm border-0 p-4">

          <legend class="mb-3 text-center">
            <h3 class="text-primary">Cadastro de Leitor</h3>
          </legend>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome do Leitor..">
            <label for="nome">Leitor</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="CPF" name="CPF" placeholder="Cpf ou Identificação...">
            <label for="CPF">CPF</label>
          </div>

          <div class="form-floating mb-3">
            <input type="tel" class="form-control" id="phone" name="phone" placeholder="(00) 00000-0000">
            <label for="phone">Telefone</label>
          </div>

          <div class="form-floating mb-3">
            <input type="date" class="form-control" id="dataEmp" name="dataEmp">
            <label for="dataEmp">Data de Empréstimo</label>
          </div>

          <div class="form-floating mb-3">
            <input type="date" class="form-control" id="dataDev" name="dataDev">
            <label for="dataDev">Data de Devolução</label>
          </div>

          <div class="mb-3">
            <label for="nomeLiv" class="form-label">Livro</label>
            <select class="form-select" id="nomeLiv" name="nomeLiv">
              ${opcoesLivros}
            </select>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">
            Cadastrar Leitor
          </button>

        </form>

      </div>

    </div>

  </body>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</html>
`);
  res.end();
});

server.post("/CadastroLeitor", autenticado, (req, res) => {
  const nome = req.body.nome;
  const CPF = req.body.CPF;
  const phone = req.body.phone;
  const dataEmp = req.body.dataEmp;
  const dataDev = req.body.dataDev;
  const nomeLiv = req.body.nomeLiv;

  if (!nome || !CPF || !phone || !dataEmp || !dataDev || !nomeLiv) {
    let opcoesLivros = `<option value="">Selecione um livro</option>`;
    for (let i = 0; i < livros.length; i++) {
      opcoesLivros += `<option value="${livros[i].titulo}">${livros[i].titulo}</option>`;
    }

    let html = `
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Leitor</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-5">
                    <form method="POST" action="/CadastroLeitor" class="row gy-2 gx-3 align-items-center border p-3">
                        <legend><h3>Cadastro de Leitor</h3></legend>

                        <div class="row">
                            <label for="nome">Nome</label>
                            <input type="text" class="form-control" name="nome" value="${nome}">`;
    if (!nome) {
      html += `<div class="alert alert-danger">Informe o nome.</div>`;
    }

    html += `</div>
                        <div class="row">
                            <label for="CPF">CPF</label>
                            <input type="text" class="form-control" name="CPF" value="${CPF}">`;
    if (!CPF) {
      html += `<div class="alert alert-danger">Informe o CPF.</div>`;
    }

    html += `</div>
                        <div class="row">
                            <label for="phone">Telefone</label>
                            <input type="text" class="form-control" name="phone" value="${phone}">`;
    if (!phone) {
      html += `<div class="alert alert-danger">Informe o telefone.</div>`;
    }

    html += `</div>
                        <div class="row">
                            <label for="dataEmp">Data de Empréstimo</label>
                            <input type="date" class="form-control" name="dataEmp" value="${dataEmp}">`;
    if (!dataEmp) {
      html += `<div class="alert alert-danger">Informe a data de empréstimo.</div>`;
    }

    html += `</div>
                        <div class="row">
                            <label for="dataDev">Data de Devolução</label>
                            <input type="date" class="form-control" name="dataDev" value="${dataDev}">`;
    if (!dataDev) {
      html += `<div class="alert alert-danger">Informe a data de devolução.</div>`;
    }

    html += `</div>
                        <div class="row">
                            <label for="nomeLiv">Livro</label>
                            <select class="form-select" name="nomeLiv">
                              ${opcoesLivros}
                            </select>`;
    if (!nomeLiv) {
      html += `<div class="alert alert-danger">Selecione um livro.</div>`;
    }

    html += `
                        </div>
                        <div class="row mt-3">
                          <button type="submit" class="btn btn-primary">Cadastrar Leitor</button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `;

    res.write(html);
    res.end();
  } else {
    leitores.push({
      nome: nome,
      CPF: CPF,
      phone: phone,
      dataEmp: dataEmp,
      dataDev: dataDev,
      nomeLiv: nomeLiv,
    });

    res.redirect("/listaLeitor");
  }
});

server.get("/listaLeitor", autenticado, (req, res) => {
  const ultimoAcesso =
    req.cookies?.ultAcesso || "Nenhum acesso anterior identificado.";

  res.write(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Lista de Leitores</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">

                    <p class="text-body-secondary">Último acesso ao sistema: <strong>${ultimoAcesso}</strong></p>

                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nome</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Data Empréstimo</th>
                                <th scope="col">Data Devolução</th>
                                <th scope="col">Livro</th>
                            </tr>
                        </thead>
                        <tbody>
    `);

  for (let i = 0; i < leitores.length; i++) {
    const leitor = leitores[i];
    res.write(`
            <tr>
                <td>${i + 1}</td>
                <td>${leitor.nome}</td>
                <td>${leitor.CPF}</td>
                <td>${leitor.phone}</td>
                <td>${leitor.dataEmp}</td>
                <td>${leitor.dataDev}</td>
                <td>${leitor.nomeLiv}</td>
            </tr>
        `);
  }

  res.write(`
                        </tbody>
                    </table>
                    <a href="/CadastroLeitor" class="btn btn-primary">Continuar cadastrando...</a>
                    <a href="/" class="btn btn-secondary ms-2">Voltar ao menu</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </html>
    `);
  res.end();
});

function autenticado(req, res, prox) {
  if (req.session?.logado) {
    prox();
  } else {
    res.redirect("/login");
  }
}

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
