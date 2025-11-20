-- Function to sync patient status when an appointment is confirmed
CREATE OR REPLACE FUNCTION public.sync_patient_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If the appointment status is 'Confirmada', update the patient status to 'Confirmada'
    IF NEW."Status" = 'Confirmada' THEN
        UPDATE public.pacientes
        SET status = 'Confirmada'
        WHERE id = NEW.paciente_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS sync_patient_status_trigger ON public.agendamentos;

-- Create the trigger
CREATE TRIGGER sync_patient_status_trigger
AFTER INSERT OR UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.sync_patient_status();
