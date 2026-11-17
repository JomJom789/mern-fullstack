import { contactResponseSchema, type ContactInput } from '@jomel/shared';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../lib/api';

export function useSendContact() {
  return useMutation({
    mutationFn: (input: ContactInput) =>
      apiRequest('/api/contact', {
        method: 'POST',
        body: input,
        parse: (d) => contactResponseSchema.parse(d),
      }),
  });
}
