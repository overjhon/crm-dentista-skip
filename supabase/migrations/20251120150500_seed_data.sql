-- Seed Procedimentos
INSERT INTO public.procedimentos (nome_procedimento, valor_padrao, descricao) VALUES
('Limpeza', 250.00, 'Limpeza completa e profilaxia'),
('Canal', 800.00, 'Tratamento de canal (endodontia)'),
('Extração', 300.00, 'Extração simples'),
('Implante', 2500.00, 'Implante dentário completo'),
('Avaliação', 100.00, 'Consulta inicial de avaliação');

-- Seed Pacientes
INSERT INTO public.pacientes (nome_completo, cpf, telefone, email, endereco, status, observacoes) VALUES
('Ana Silva', '12345678900', '(11) 99999-1111', 'ana@example.com', 'Rua A, 123', 'Em Atendimento', 'Alergia a penicilina'),
('Bruno Souza', '23456789011', '(11) 98888-2222', 'bruno@example.com', 'Av B, 456', 'Novo', NULL),
('Carla Dias', '34567890122', '(11) 97777-3333', 'carla@example.com', 'Travessa C, 789', 'Aguardando Pagamento', 'Tratamento de canal em andamento'),
('Daniel Oliveira', '45678901233', '(11) 96666-4444', 'daniel@example.com', 'Rua D, 101', 'Aguardando Pagamento', NULL);

-- Seed Agendamentos
INSERT INTO public.agendamentos (data_procedimento, hora_inicio, hora_fim, "Status", paciente_id, procedimento_id, nome_profissional)
SELECT 
    CURRENT_DATE, '09:00', '10:00', 'Confirmada', p.id, proc.id, 'Dr. Everson'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Ana Silva' AND proc.nome_procedimento = 'Limpeza';

INSERT INTO public.agendamentos (data_procedimento, hora_inicio, hora_fim, "Status", paciente_id, procedimento_id, nome_profissional)
SELECT 
    CURRENT_DATE + INTERVAL '1 day', '14:00', '15:00', 'Confirmada', p.id, proc.id, 'Dr. Everson'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Bruno Souza' AND proc.nome_procedimento = 'Avaliação';

INSERT INTO public.agendamentos (data_procedimento, hora_inicio, hora_fim, "Status", paciente_id, procedimento_id, nome_profissional)
SELECT 
    CURRENT_DATE - INTERVAL '2 days', '10:00', '11:30', 'Realizada', p.id, proc.id, 'Dr. Everson'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Carla Dias' AND proc.nome_procedimento = 'Canal';

-- Seed Transacoes Financeiras
INSERT INTO public.transacoes_financeiras (paciente_id, procedimento_id, valor, data_transacao, forma_pagamento, status_pagamento)
SELECT 
    p.id, proc.id, 250.00, CURRENT_DATE - INTERVAL '5 days', 'PIX', 'Pago'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Ana Silva' AND proc.nome_procedimento = 'Limpeza';

INSERT INTO public.transacoes_financeiras (paciente_id, procedimento_id, valor, data_transacao, forma_pagamento, status_pagamento)
SELECT 
    p.id, proc.id, 800.00, CURRENT_DATE - INTERVAL '2 days', 'Cartão', 'Pendente'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Carla Dias' AND proc.nome_procedimento = 'Canal';

INSERT INTO public.transacoes_financeiras (paciente_id, procedimento_id, valor, data_transacao, forma_pagamento, status_pagamento)
SELECT 
    p.id, proc.id, 1500.00, CURRENT_DATE - INTERVAL '10 days', 'Boleto', 'Atrasado'
FROM public.pacientes p, public.procedimentos proc
WHERE p.nome_completo = 'Daniel Oliveira' AND proc.nome_procedimento = 'Implante';

-- Seed Despesas
INSERT INTO public.despesas (descricao, valor, data_despesa, tipo_despesa) VALUES
('Aluguel Consultório', 2500.00, CURRENT_DATE - INTERVAL '15 days', 'Fixa'),
('Material Descartável', 450.00, CURRENT_DATE - INTERVAL '10 days', 'Variável');
