CREATE TABLE IF NOT EXISTS public.procedimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_procedimento TEXT NOT NULL,
    valor_padrao NUMERIC NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
