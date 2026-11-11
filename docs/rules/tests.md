## Quando
Ao escrever, alterar ou remover qualquer teste.

## Procedimento
1. Testes rodam contra o banco local. Nunca contra o remoto.
2. O nome do teste cita o critério que ele prova: test_ca_03_...
3. Teste de endpoint verifica status E corpo.
4. Tabela com política de acesso tem um teste que prova o bloqueio:
   o mesmo dado, com outro usuário, não retorna.

## Verificação
`npm test`, `npm run build` e `npm run lint` passam no frontend. Os testes de banco pertencem à API e usam o PostgreSQL local descartável `emprestai_sdd`, com bootstrap e migrations aplicados antes de `npm test`.
