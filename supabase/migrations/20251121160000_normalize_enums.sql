-- Function to normalize expense type before saving
CREATE OR REPLACE FUNCTION public.normalize_expense_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo_despesa IS NOT NULL THEN
        -- Normalize variations to standard values
        IF LOWER(NEW.tipo_despesa) IN ('fixa', 'fixo') THEN
            NEW.tipo_despesa := 'Fixa';
        ELSIF LOWER(NEW.tipo_despesa) IN ('variável', 'variavel', 'var', 'variable') THEN
            NEW.tipo_despesa := 'Variável';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for expenses
DROP TRIGGER IF EXISTS normalize_expense_data_trigger ON public.despesas;
CREATE TRIGGER normalize_expense_data_trigger
BEFORE INSERT OR UPDATE ON public.despesas
FOR EACH ROW
EXECUTE FUNCTION public.normalize_expense_data();

-- Function to normalize payment status before saving
CREATE OR REPLACE FUNCTION public.normalize_transaction_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_pagamento IS NOT NULL THEN
        -- Normalize variations to standard values
        IF LOWER(NEW.status_pagamento) IN ('pago', 'pagou', 'paid') THEN
            NEW.status_pagamento := 'Pago';
        ELSIF LOWER(NEW.status_pagamento) IN ('pendente', 'aberto', 'a receber', 'pending') THEN
            NEW.status_pagamento := 'Pendente';
        ELSIF LOWER(NEW.status_pagamento) IN ('atrasado', 'vencido', 'overdue') THEN
            NEW.status_pagamento := 'Atrasado';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for transactions
DROP TRIGGER IF EXISTS normalize_transaction_data_trigger ON public.transacoes_financeiras;
CREATE TRIGGER normalize_transaction_data_trigger
BEFORE INSERT OR UPDATE ON public.transacoes_financeiras
FOR EACH ROW
EXECUTE FUNCTION public.normalize_transaction_data();
