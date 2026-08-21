# 🌱 Composta+ V5 — Aprender, praticar e transformar

## Visão da V5

A V5 mantém a base funcional da V4 e muda o foco da experiência para **aprendizagem aplicada**:

**APRENDER → PRATICAR → DIAGNOSTICAR → ACOMPANHAR → IMPACTAR**

A proposta é reduzir o padrão “ler e ganhar XP” e aumentar o padrão:

**aprender → responder → fazer no mundo real → receber feedback → ajustar → evoluir.**

---

## O que esta versão já tinha e foi mantido

- Página inicial orientada por jornada.
- Trilha gamificada com 6 aulas/missões.
- XP por ações reais de aprendizagem.
- Níveis e títulos.
- Cadastro de resíduos em kg.
- Banco de resíduos com dicas.
- Diário da composteira.
- Diagnóstico educativo de úmido + seco.
- Sugestão de material seco.
- Painel de impacto automático.
- Estimativa de sacos poupados.
- Estimativa de composto produzido.
- Gráfico de evolução.
- Objetivos progressivos.
- 8 conquistas.
- Área “O que fazer com o composto?”.
- Perfil personalizável.
- Painel administrativo local.
- Cadastro/exclusão de resíduos.
- Configuração de estimativas.
- Persistência no localStorage.
- Layout responsivo.
- Modal educativo.
- Validação básica e prevenção de HTML inserido pelo usuário.

---

## O que foi melhorado na V5

### 1. Missões com microquiz

Cada uma das 6 missões possui uma pergunta de checagem de entendimento antes de ser concluída.

A sequência passa a ser:

**conteúdo → pergunta → feedback → conclusão → aplicação.**

### 2. Feedback imediato

Depois de registrar um resíduo, a interface mostra um pequeno **“Aprendizado aplicado”**, conectando a ação registrada ao conceito que o usuário deve observar em seguida.

### 3. Diagnóstico guiado

Nova seção com três observações:

- cheiro;
- umidade;
- aparência.

O sistema gera uma orientação simples e um próximo passo prático.

### 4. Desafios fora da tela

A V5 adiciona desafios para estimular hábitos reais:

- primeiro registro;
- diagnóstico completo;
- equilíbrio na prática;
- ensinar outra pessoa;
- rotina em dias diferentes;
- atingir metas de impacto.

A gamificação passa a premiar comportamento e prática, e não apenas navegação.

### 5. Mapa de habilidades

A progressão mostra seis competências:

- Fundamentos
- Umidade
- Equilíbrio
- Cuidados
- Maturação
- Aplicação

As competências são liberadas pela conclusão da trilha.

### 6. Jornada visual

A página de jornada mostra a sequência das seis missões e destaca visualmente o estágio atual.

### 7. Progressão conectada

O progresso alimenta:

- nível;
- título;
- missões;
- desafios;
- habilidades;
- conquistas;
- impacto;
- próximo objetivo.

### 8. Aplicação do conhecimento

A seção de uso do composto reforça:

**aprendi → experimentei → observei → ajustei.**

---

## Identidade visual V5

### Conceito

A identidade visual escolhida é **eco-natural, limpa e educativa**, inspirada em:

- folhas;
- solo;
- matéria orgânica;
- compostagem;
- educação ambiental.

A V5 usa principalmente **verde + marrom + bege + off-white**, evitando a estética azul/tecnológica da versão anterior.

### Direção estética

- limpa;
- orgânica;
- acolhedora;
- natural;
- didática;
- com aparência de material educativo.

### Paleta

- Verde profundo: `#315D38`
- Verde principal: `#5B934A`
- Verde suave: `#E6EFDC`
- Verde claro: `#EEF4E7`
- Marrom terra de apoio: `#6D5B46`
- Bege: `#F4F0E8`
- Off-white: `#FFFDF8`
- Texto: `#243D2A`

### Componentes

Cartões com cantos arredondados, bordas discretas e sombras suaves.

Botões principais usam verde para representar ação, crescimento e natureza.

O marrom é usado como cor de apoio para referências ao solo, matéria orgânica e elementos terrosos.

### Tipografia

- **Lexend** para títulos e destaques.
- **Inter** para textos, formulários e informações auxiliares.

---

## Como a aprendizagem funciona

### 1. Aprender
Microaula curta e contextual.

### 2. Responder
Pergunta rápida para verificar compreensão.

### 3. Praticar
Ação ou observação na própria composteira.

### 4. Receber feedback
Explicação do significado da ação e próximo passo.

### 5. Diagnosticar
Cheiro, umidade e aparência.

### 6. Evoluir
XP, níveis, habilidades, conquistas e desafios.

### 7. Impactar
Kg registrados, sacos estimados, composto estimado e dias ativos.

---

## Gamificação

### XP
Recompensa aprendizagem e prática.

### Níveis
- Semente
- Aprendiz Verde
- Cuidador
- Compostador
- Guardião dos Resíduos
- Mestre da Compostagem

### Conquistas
- Primeiros 500 g
- 1 kg transformado
- 5 kg compostados
- 10 kg
- Primeira lição
- Trilha completa
- 3 dias
- 100 sacos

### Desafios
Ações curtas com foco no mundo real e na construção de hábito.

### Habilidades
Mapa de competências mostrando quais partes da jornada já foram praticadas.

---

## Fórmulas

**Sacos estimados = kg registrados ÷ kg configurado por saco.**

Padrão: 0,4 kg/saco.

**Composto estimado = kg registrados × percentual configurado.**

Padrão: 45%.

Esses números são **estimativas educativas**, não medições científicas.

---

## Administração

Login de demonstração:

- usuário: `adm`
- senha: `adm`

O administrador pode:

- cadastrar resíduos;
- excluir resíduos;
- alterar o peso de saco estimado;
- alterar o percentual estimado de composto.

---

## Dados

Os dados ficam somente no navegador usando `localStorage`.

Não há backend ou sincronização online nesta edição.

---

## Robustez

A V5 mantém:

- estado centralizado;
- recuperação para dados inválidos;
- validação de quantidade;
- limite de 50 kg por registro;
- sanitização de textos antes de renderizar;
- IDs únicos;
- persistência local;
- atualização das métricas após exclusões;
- recálculo ao alterar configurações;
- eventos para conteúdo dinâmico;
- gráfico redesenhado no resize;
- layout adaptado a celular;
- valores estimados identificados como estimativas.

---

## Limitações

Ainda não há:

- Supabase;
- contas reais;
- ranking online;
- notificações push;
- sensores IoT;
- upload de fotos;
- API de clima;
- sincronização entre dispositivos;
- armazenamento online dos desafios.

---

## Execução

Extraia o ZIP e abra:

`index.html`

Para desenvolvimento, use Live Server no VS Code.

---

## Próximas evoluções possíveis

- fotos antes/depois;
- sequência diária;
- feedback por foto;
- ranking entre turmas;
- missões por idade/perfil;
- modo professor;
- trilhas para escolas;
- certificados;
- sincronização online;
- notificações de rotina;
- histórico de diagnósticos.

---

## Observação para TCC

As recomendações do protótipo são educativas.

Para uma versão científica/agrônoma, valide proporções, recomendações e formas de uso com fontes técnicas e apresente estimativas como estimativas.
