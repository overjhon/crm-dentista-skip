-- Migration to enforce unique constraint on nome_procedimento in procedimentos table
-- Handles potential duplicates by merging them before applying the constraint

DO $$
DECLARE
    r RECORD;
    master_id UUID;
BEGIN
    -- Loop through all procedure names that have duplicates
    FOR r IN 
        SELECT nome_procedimento 
        FROM public.procedimentos 
        GROUP BY nome_procedimento 
        HAVING COUNT(*) > 1
    LOOP
        -- Select the ID of the first occurrence (master)
        SELECT id INTO master_id 
        FROM public.procedimentos 
        WHERE nome_procedimento = r.nome_procedimento 
        ORDER BY criado_em ASC 
        LIMIT 1;

        -- Update references in agendamentos to point to the master ID
        UPDATE public.agendamentos 
        SET procedimento_id = master_id 
        WHERE procedimento_id IN (
            SELECT id 
            FROM public.procedimentos 
            WHERE nome_procedimento = r.nome_procedimento AND id != master_id
        );

        -- Update references in transacoes_financeiras to point to the master ID
        UPDATE public.transacoes_financeiras 
        SET procedimento_id = master_id 
        WHERE procedimento_id IN (
            SELECT id 
            FROM public.procedimentos 
            WHERE nome_procedimento = r.nome_procedimento AND id != master_id
        );

        -- Delete the duplicate entries
        DELETE FROM public.procedimentos 
        WHERE nome_procedimento = r.nome_procedimento AND id != master_id;
    END LOOP;
END $$;

-- Now that duplicates are removed, add the unique constraint
ALTER TABLE public.procedimentos ADD CONSTRAINT procedimentos_nome_procedimento_key UNIQUE (nome_procedimento);
