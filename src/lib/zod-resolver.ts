import { ZodType, ZodError } from 'zod'
import { FieldValues, Resolver } from 'react-hook-form'

export const zodResolver =
  <T extends FieldValues>(schema: ZodType<T>): Resolver<T> =>
  async (values) => {
    try {
      const data = await schema.parseAsync(values)
      return {
        values: data,
        errors: {},
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          values: {},
          errors: error.errors.reduce((allErrors: any, currentError) => {
            const path = currentError.path.join('.')
            if (!allErrors[path]) {
              allErrors[path] = {
                type: currentError.code,
                message: currentError.message,
              }
            }
            return allErrors
          }, {}),
        }
      }
      return {
        values: {},
        errors: {},
      }
    }
  }
