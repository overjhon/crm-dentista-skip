CREATE TABLE IF NOT EXISTS public.transacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
    procedimento_id UUID REFERENCES public.procedimentos(id),
    valor NUMERIC NOT NULL,
    data_transacao DATE NOT NULL,
    forma_pagamento TEXT,
    status_pagamento TEXT NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
