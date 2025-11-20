-- Truncate to avoid constraint violations on existing data
TRUNCATE TABLE public.agendamentos CASCADE;

ALTER TABLE public.agendamentos DROP COLUMN IF EXISTS nome_cliente;
ALTER TABLE public.agendamentos DROP COLUMN IF EXISTS procedimentos;

ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS paciente_id UUID NOT NULL REFERENCES public.pacientes(id);
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS procedimento_id UUID NOT NULL REFERENCES public.procedimentos(id);
