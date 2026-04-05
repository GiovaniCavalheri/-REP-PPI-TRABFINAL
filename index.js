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
      maxAge: 11000 * 60 * 30,
    },
  }),
);

let leitores = [];
let livros = [];
let emprestimos = [];

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
              <li><a class="dropdown-item" href="/????">?????</a></li>
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

        <form method="POST" action="/CadastroProdutos" class="card shadow-sm border-0 p-4">

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

// ==> rota para cadastro de autor
server.get("/CadastroLeitor", autenticado, (req, res) => {
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

        <form method="POST" action="/CadastroLeitor" class="card shadow-sm border-0 p-4">

          <legend class="mb-3 text-center">
            <h3 class="text-primary">Cadastro de Leitor</h3>
          </legend>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome do Leitor..">
            <label for="titulo">Leitor</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="autor" name="autor" placeholder="Email do Leitor...">
            <label for="autor">E-mail do Leitor</label>
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
