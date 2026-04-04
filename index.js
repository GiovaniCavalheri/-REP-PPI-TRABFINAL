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
});

server.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.senha.body;

  if (email === "admin@teste.com.br" && senha === "admin") {
    req.session.logado = true;
    requisicao.session.nomeUsuario = "Administrador";

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

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
