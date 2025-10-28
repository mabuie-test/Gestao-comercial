# Registo do Administrador

Para que a aplicação funcione correctamente é necessário criar o primeiro utilizador com perfil de administrador. Esta operação só pode ser feita **uma única vez**, visto que a API bloqueia novas tentativas depois de existir algum utilizador com o papel `admin`.

## Pré-requisitos

1. Ter o backend em execução (localmente ou em produção) com as variáveis de ambiente configuradas, especialmente `JWT_SECRET` e a ligação à base de dados MongoDB.
2. Conhecer o URL base da API. Exemplos:
   - Local: `http://localhost:3333`
   - Render: `https://<o-seu-servico>.onrender.com`

## Endpoint

```
POST /api/auth/register/admin
Content-Type: application/json
```

### Corpo da requisição

```json
{
  "name": "Nome do Administrador",
  "email": "admin@exemplo.com",
  "password": "palavra-passe-segura"
}
```

- `name`: nome completo do administrador.
- `email`: endereço de email válido. Tem de ser único na base de dados.
- `password`: palavra-passe com pelo menos 6 caracteres.

## Respostas esperadas

- `201 Created`: administrador criado com sucesso. O corpo da resposta inclui `id`, `name`, `email` e `role` do novo utilizador.
- `400 Bad Request`: falha de validação (por exemplo, campos em falta ou email inválido). O corpo apresenta a lista de erros.
- `409 Conflict`: já existe um administrador registado ou o email fornecido já está associado a outro utilizador.

## Passos rápidos

1. Faça um pedido `POST` para `/api/auth/register/admin` com o JSON acima.
2. Verifique a resposta `201` para confirmar a criação.
3. Guarde as credenciais para utilizar o endpoint de login (`POST /api/auth/login`).
4. Após o registo do administrador, utilize esse utilizador para criar novos vendedores através do endpoint protegido `POST /api/auth/register`.

Seguindo estes passos garante-se que o primeiro administrador é criado correctamente e que o restante processo de gestão de utilizadores pode continuar normalmente.
