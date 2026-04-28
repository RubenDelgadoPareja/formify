import type { FieldProps } from './field.entity'

export interface FormTemplate {
  id: string
  name: string
  title: string
  fields: Omit<FieldProps, 'id'>[]
}

export const FORM_TEMPLATES: readonly FormTemplate[] = [
  {
    id: 'contact',
    name: 'Contact',
    title: 'ContactForm',
    fields: [
      { type: 'text', label: 'Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'textarea', label: 'Message', required: true },
    ],
  },
  {
    id: 'login',
    name: 'Login',
    title: 'LoginForm',
    fields: [
      { type: 'email', label: 'Email', required: true },
      { type: 'password', label: 'Password', required: true },
    ],
  },
  {
    id: 'billing-address',
    name: 'Billing Address',
    title: 'BillingAddressForm',
    fields: [
      { type: 'text', label: 'Full Name', required: true },
      { type: 'text', label: 'Address Line 1', required: true },
      { type: 'text', label: 'Address Line 2', required: false },
      { type: 'text', label: 'City', required: true },
      { type: 'text', label: 'ZIP Code', required: true },
      {
        type: 'select',
        label: 'Country',
        required: true,
        options: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Other'],
      },
    ],
  },
  {
    id: 'payment',
    name: 'Payment',
    title: 'PaymentForm',
    fields: [
      { type: 'text', label: 'Cardholder Name', required: true },
      { type: 'text', label: 'Card Number', required: true },
      { type: 'text', label: 'Expiry Date', required: true },
      { type: 'text', label: 'CVV', required: true },
    ],
  },
]
