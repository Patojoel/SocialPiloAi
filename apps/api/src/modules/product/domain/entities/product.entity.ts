export interface ProductFaq {
  question: string
  answer: string
}

export interface Product {
  id: string
  workspaceId: string
  name: string
  description: string
  context: string
  benefits: string[]
  faqs: ProductFaq[]
  marketingTexts: string[]
  imageUrls: string[]
  videoUrls: string[]
  createdAt: Date
  updatedAt: Date
}
