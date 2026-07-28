# 🐺 LYKOS Torneios — Official Web Platform & Admin Management

<p align="center">
  <img src="assets/logo.png" alt="LYKOS Torneios Logo" width="140">
</p>

<p align="center">
  <b>Plataforma web de alta performance para a organização de E-Sports LYKOS.</b><br>
  Single Page Application (SPA) moderna, responsiva e integrada com Backend Serverless & Banco de Dados em Nuvem.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Ativo%20%26%20Produ%C3%A7%C3%A3o-brightgreen?style=for-the-badge&logo=netlify" alt="Status">
  <img src="https://img.shields.io/badge/Hosting-Netlify%20Functions-00C7B7?style=for-the-badge&logo=netlify" alt="Hosting">
  <img src="https://img.shields.io/badge/Database-Azure%20PostgreSQL-0089D6?style=for-the-badge&logo=microsoftazure" alt="Database">
  <img src="https://img.shields.io/badge/Architecture-SPA%20Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript" alt="Architecture">
</p>

---

## 📌 Visão Geral

A **LYKOS Torneios** é uma plataforma completa desenvolvida para gerenciar elencos, comissão técnica, partidas ao vivo, conquistas, notícias e torneios abertos para a comunidade. 

O projeto utiliza uma arquitetura **Single Page Application (SPA)** leve e extremamente rápida no front-end, combinada com **Netlify Functions (Serverless)** e **Microsoft Azure PostgreSQL Flexible Server** no back-end.

---

## ⚡ Principais Funcionalidades

### 🌐 Portal Público (Usermode)
- 🏠 **Home Destaque**:
  - Banner dos 5 Jogadores Principais (Starters) em visual cyberpunk 9:16.
  - Placar ao vivo / Próxima partida em destaque com link direto para transmissão (Twitch/YouTube).
  - Chamada oficial para a Torcida LYKOS.
- 👥 **Elenco (Roster)**:
  - Filtro interativo por modalidade (*Valorant*, *CS2*, etc.).
  - Card detalhado dos Pro-Players com foto em alta definição, biografia, redes sociais e setup/periféricos (*Mouse, Teclado, Headset, Monitor, etc.*).
- 👔 **Comissão Técnica (Staff)**:
  - Apresentação de coaches, analistas e managers da equipe.
- 🎮 **Partidas & Súmulas**:
  - Histórico de partidas finalizadas, agendadas e jogos em andamento (🔴 **AO VIVO**).
  - Súmula detalhada por partida com placar mapa a mapa, imagens de capa de cada mapa e KDA dos atletas.
- 🏆 **Conquistas & Galeria de Troféus**:
  - Exibição de títulos, premiações, ano e MVP da campanha.
  - Tabela interativa de campeonatos recentes e colocações.
- 📢 **Torneios da Comunidade**:
  - Divulgação oficial de campeonatos internos e parceiros com status de inscrições abertas, premiações e link direto para formulário.
- 📰 **Mídias & News**:
  - Portal de notícias oficiais, destaques, matérias e feeds incorporados de redes sociais (*Instagram, X/Twitter, TikTok, YouTube*).

---

### 🛡️ Painel Administrativo (`/admin`)
- 🔒 **Autenticação Segura & Níveis de Permissão**:
  - Sistema de Login administrativo integrado ao PostgreSQL.
  - Gestão de Usuários e Níveis de Permissão granular (*somente administradores Master podem gerenciar permissões*).
- 🔄 **Sincronização em Tempo Real (Cloud-First)**:
  - Todas as alterações são salvas diretamente no PostgreSQL da Azure.
  - Atualização instantânea para todos os visitantes sem necessidade de recarregar a página.
- 📤 **Upload de Imagens Integrado**:
  - Suporte a upload direto de arquivos de imagem via **ImgBB API** com preview em tempo real.
- ⚙️ **Customização da Marca (Branding)**:
  - Alteração dinâmica de Logos, Favicon, Logo padrão de adversários e Cores primárias sem mexer no código.

---

## 🛠️ Tecnologias Utilizadas

### Front-End
- **HTML5 & CSS3**: Design System proprietário com modo escuro cyberpunk, glassmorphism, gradientes e animações fluidas a 60 FPS.
- **Vanilla JavaScript (ES6+)**: Roteador SPA customizado, manipulador de estado e renderização por componentes modulares.

### Back-End & Infraestrutura
- **Netlify Functions / Node.js**: Serverless endpoints (`/api/data`, `/api/save`, `/api/delete`, `/api/login`).
- **Microsoft Azure PostgreSQL**: Banco de dados relacional em nuvem para persistência de dados.
- **ImgBB API**: Serviço de hospedagem e upload direto de imagens.

---

## 📁 Estrutura do Projeto

```text
LYKOS/
├── api/                   # Serverless Endpoints (Vercel Legacy / Standalone)
├── assets/                # Imagens estáticas, logos e ícones
├── css/
│   └── style.css          # Design System e estilos globais
├── js/
│   ├── components/        # Componentes das telas (home, elenco, partidas, admin, etc.)
│   ├── database.js        # Camada de banco de dados, cache e polling em tempo real
│   ├── router.js          # Roteador SPA
│   └── app.js             # Inicialização do sistema
├── netlify/
│   └── functions/         # Netlify Functions (data, save, delete, login)
├── index.html             # Arquivo principal da SPA
├── netlify.toml           # Configurações de redirecionamento e headers Anti-Cache
├── schema.sql             # Estrutura completa das tabelas PostgreSQL
└── README.md              # Documentação oficial
```

---

## ⚙️ Variáveis de Ambiente

Para o funcionamento correto das Netlify Functions com o banco de dados Azure, configure as seguintes variáveis no painel da **Netlify** (*Site Settings > Environment Variables*):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `AZURE_POSTGRES_URL` | String de conexão PostgreSQL da Azure | `postgres://user:pass@host.postgres.database.azure.com:5432/dbname?sslmode=require` |
| `IMGBB_API_KEY` *(Opcional)* | Chave da API do ImgBB para upload | `3a1b...` |

---

## 🚀 Como Executar Localmente

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/SeuUsuario/LYKOS.git
   cd LYKOS
   ```

2. **Testar com Servidor Local**:
   Você pode usar qualquer servidor HTTP estático simples, como o Live Server do VS Code ou via `npx`:
   ```bash
   npx serve .
   ```

3. **Subir para Produção (Netlify)**:
   - Conecte o repositório do GitHub ao **Netlify**.
   - O arquivo `netlify.toml` cuidará das rotas `/api/*` e das regras de cache automaticamente!

---

<p align="center">
  Desenvolvido com dedicação e foco em performance para a <b>LYKOS Torneios</b>.
</p>
