# Composta+ V2 — Plataforma Interativa

## Funcionalidades

### Perfil
- criação/edição de perfil
- XP
- níveis
- progresso
- persistência no navegador via localStorage

### Ranking e desafios
- ranking semanal demonstrativo
- desafio semanal
- progresso do desafio
- XP por participação

### Minha composteira
- materiais secos, resíduos e composto
- passagem de dias
- temperatura/umidade/decomposição estimadas
- peso de resíduos
- diário com foto
- observações
- persistência local

### Clima
- busca de cidade
- geocodificação
- previsão atual
- probabilidade de chuva
- recomendação para a composteira
- usa Open-Meteo sem chave de API

### Tutoriais
- etapas interativas
- checkboxes
- progresso
- XP
- tutoriais personalizados pelo painel administrativo

### Vídeos
- categorias por dificuldade
- filtros
- URLs personalizáveis no painel administrativo

### Laboratório
- simulador de umidade
- quiz
- experimentos que dão XP

### Administração
- cadastrar tutorial
- cadastrar vídeo
- cadastrar desafio

## Importante sobre "online"

Esta versão é totalmente funcional como protótipo/plataforma local. Perfil, progresso, diário, conteúdo personalizado e desafios são salvos no navegador com localStorage.

Para múltiplos usuários reais compartilharem contas, ranking e conteúdo na internet, é necessário um backend/banco de dados. A estrutura JS já está separada para essa evolução.

## Rodar

Abra `index.html` ou use Live Server no VS Code.

## Próximo passo para produção

Trocar localStorage por Supabase/Firebase/PostgreSQL + autenticação. Isso permitirá login real, contas, ranking global, fotos em armazenamento online e painel administrativo protegido.
