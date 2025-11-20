-- Normalize existing data to ensure it meets the constraints
UPDATE public.despesas 
SET tipo_despesa = 'Fixa' 
WHERE LOWER(tipo_despesa) = 'fixa';

UPDATE public.despesas 
SET tipo_despesa = 'Variável' 
WHERE LOWER(tipo_despesa) IN ('variável', 'variavel');

UPDATE public.transacoes_financeiras 
SET status_pagamento = 'Pago' 
WHERE LOWER(status_pagamento) = 'pago';

UPDATE public.transacoes_financeiras 
SET status_pagamento = 'Pendente' 
WHERE LOWER(status_pagamento) = 'pendente';

UPDATE public.transacoes_financeiras 
SET status_pagamento = 'Atrasado' 
WHERE LOWER(status_pagamento) = 'atrasado';

-- Add constraints to ensure data consistency
ALTER TABLE public.despesas DROP CONSTRAINT IF EXISTS despesas_tipo_check;
ALTER TABLE public.despesas ADD CONSTRAINT despesas_tipo_check 
    CHECK (tipo_despesa IN ('Fixa', 'Variável') OR tipo_despesa IS NULL);

ALTER TABLE public.transacoes_financeiras DROP CONSTRAINT IF EXISTS transacoes_status_check;
ALTER TABLE public.transacoes_financeiras ADD CONSTRAINT transacoes_status_check 
    CHECK (status_pagamento IN ('Pago', 'Pendente', 'Atrasado'));
