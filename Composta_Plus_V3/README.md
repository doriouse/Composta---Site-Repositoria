# Composta+ V3

Versão revisada do protótipo local da plataforma Composta+.

## Principais correções e melhorias

- Estado único e normalizado no `localStorage`.
- Proteção contra dados corrompidos no armazenamento.
- Validação de pesos, XP e campos administrativos.
- Escape de conteúdo inserido pelo usuário para evitar HTML indevido.
- URLs de vídeos validadas antes de abrir.
- Login administrativo de demonstração `adm / adm`.
- Sessão administrativa persistida separadamente.
- Desafio semanal reiniciado automaticamente por semana.
- XP do experimento não pode ser ganho repetidamente.
- Ranking ordenado por impacto real (kg) e, em empate, XP.
- Gráfico de evolução baseado no histórico de registros.
- Impacto calculado automaticamente:
  - sacos poupados = kg / 0,4
  - composto estimado = kg × 0,45 L
- Diário com redução de imagens para diminuir risco de estourar a cota do `localStorage`.
- Simulador de umidade/proporção usando kg.
- Banco de resíduos administrável.
- Clima usando Open-Meteo, sem chave de API, com timeout.
- Navegação mobile corrigida.
- Eventos com delegação/checagem de elementos para evitar erros de `null`.
- Conteúdo padrão + conteúdo cadastrado pelo administrador.

## Como executar

Abra `index.html` diretamente ou use o Live Server do VS Code.

## Limitação

Esta V3 continua sendo um protótipo local. Os dados não são compartilhados entre usuários.

Para produção, substitua `localStorage` por autenticação + banco de dados/backend (por exemplo, Supabase/Firebase/PostgreSQL).
