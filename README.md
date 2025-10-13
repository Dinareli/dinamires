# Dinamires ✨

![Hero](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Dinamires é uma plataforma moderna que conecta criadores de conteúdo com seus apoiadores, permitindo a monetização de projetos através de um sistema de apoio recorrente.

> **Apoie Criadores. Receba Conteúdo Exclusivo.**

## 📖 Sobre o Projeto

A plataforma foi criada para ser uma alternativa simples e poderosa para que artistas, podcasters, desenvolvedores e outros criadores possam construir uma comunidade engajada e garantir um crescimento sustentável para seus projetos. Os apoiadores, por sua vez, ganham acesso a conteúdos exclusivos e benefícios especiais.

## ✨ Funcionalidades Principais

- **Comunidade Engajada:** Conecte-se com seus apoiadores e crie um espaço exclusivo.
- **Crescimento Sustentável:** Receba apoio financeiro recorrente e previsível.
- **Pagamentos Seguros:** Sistema de pagamento confiável com suporte a Pix, cartão de crédito e boleto.
- **Fácil de Usar:** Crie e gerencie suas campanhas de forma rápida e intuitiva.
- **Autenticação Segura:** Sistema de login e cadastro utilizando Supabase.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- **Frontend:**
  - [**React**](https://react.dev/)
  - [**TypeScript**](https://www.typescriptlang.org/)
  - [**Vite**](https://vitejs.dev/) (Assumido como bundler)
  - [**Tailwind CSS**](https://tailwindcss.com/)
- **Componentes de UI:**
  - [**shadcn/ui**](https://ui.shadcn.com/)
  - [**Lucide React**](https://lucide.dev/) (Ícones)
- **Backend como Serviço (BaaS):**
  - [**Supabase**](https://supabase.io/) (Autenticação e Banco de Dados)
- **Roteamento:**
  - [**React Router DOM**](https://reactrouter.com/)
- **Notificações:**
  - [**Sonner**](https://sonner.emilkowal.ski/)

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/)

### Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/dinamires.git
    cd dinamires
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase. Você pode encontrá-las no painel do seu projeto em `Settings > API`.

    ```env
    VITE_SUPABASE_URL="SUA_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="SUA_SUPABASE_ANON_KEY"
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

5.  Abra http://localhost:5173 (ou a porta indicada no terminal) no seu navegador para ver a aplicação.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tem alguma ideia para melhorar o projeto, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

1.  Faça um *fork* do projeto.
2.  Crie uma nova *branch* (`git checkout -b feature/nova-funcionalidade`).
3.  Faça o *commit* de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4.  Envie para a *branch* original (`git push origin feature/nova-funcionalidade`).
5.  Abra um *Pull Request*.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.