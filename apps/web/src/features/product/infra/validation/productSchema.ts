import { z } from 'zod'

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  context: z.string().min(1, 'Context is required'),
  benefits: z.array(z.string().min(1)).default([]),
  faqs: z.array(faqSchema).default([]),
  marketingTexts: z.array(z.string().min(1)).default([]),
  imageUrls: z.array(z.string().url()).default([]),
  videoUrls: z.array(z.string().url()).default([]),
})

export type ProductFormValues = z.infer<typeof productSchema>
