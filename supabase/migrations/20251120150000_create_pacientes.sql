CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    status TEXT,
    observacoes TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
