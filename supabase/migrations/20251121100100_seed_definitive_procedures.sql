-- Seed the definitive list of procedures
-- Uses ON CONFLICT DO NOTHING to avoid errors if they already exist

INSERT INTO public.procedimentos (nome_procedimento, valor_padrao, descricao) VALUES
('Limpeza com profilaxia ultrassônica', 250.00, 'Remoção de tártaro e placa bacteriana com ultrassom e jato de bicarbonato'),
('Clareamento dental (consultório e caseiro)', 800.00, 'Procedimento estético para clarear os dentes'),
('Restaurações em resina composta', 200.00, 'Restauração estética de dentes cariados ou fraturados'),
('Ortodontia (aparelho)', 150.00, 'Manutenção mensal de aparelho ortodôntico'),
('Extrações simples e retirada de dente siso', 350.00, 'Remoção cirúrgica de dentes'),
('Prótese dentária e prótese adesiva', 1500.00, 'Reposição de dentes perdidos'),
('Tratamento de canal', 900.00, 'Tratamento endodôntico'),
('Facetas em resina composta', 1200.00, 'Reconstrução estética da face frontal dos dentes'),
('Outros', 0.00, 'Procedimentos diversos não listados')
ON CONFLICT (nome_procedimento) DO NOTHING;
