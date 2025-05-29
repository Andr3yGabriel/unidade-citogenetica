# Sistema gerenciador de exames genéticos
## Documentação do projeto: 
https://docs.google.com/document/d/1jhGv8T7RT1KSDAppYe04J1N4ay7vOwcv75wYHDjd5Hk/edit?tab=t.0

## Descrição do projeto
O sistema gerenciador de exames genéticos é uma aplicação web desenvolvida com o objetivo de facilitar a gestão e o acompanhamento de exames genéticos e aumentar a privacidade e proteção dos dados sensíveis dos pacientes. A aplicação é composta por um backend em Node.js e um frontend em Vue.js, ambos integrados para proporcionar uma experiência fluida ao usuário.

## Tecnologias utilizadas
- **Backend**: Node.js, Express, Sequelize, PostgreSQL, JWT, bcrypt
- **Frontend**: Vue.js, Axios, Primevue, Typescript
- **Infraestrutura**: Docker, Docker Compose

## Instalação do projeto
1. Instancie os containers do docker-compose:
```bash
cd api-citogenetica
docker-compose up -d
```

2. Instale localmente as dependências do frontend:
```bash
cd front-citogenetica
npm install
```