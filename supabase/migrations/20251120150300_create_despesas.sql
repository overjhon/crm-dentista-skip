CREATE TABLE IF NOT EXISTS public.despesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    data_despesa DATE NOT NULL,
    tipo_despesa TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
