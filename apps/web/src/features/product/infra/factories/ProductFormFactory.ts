import type { Product } from '../../models/Product'
import type { ProductFormValues } from '../validation/productSchema'

export class ProductFormFactory {
  static buildFormValue(product?: Product): ProductFormValues {
    if (!product) {
      return {
        name: '',
        description: '',
        context: '',
        benefits: [],
        faqs: [],
        marketingTexts: [],
        imageUrls: [],
        videoUrls: [],
      }
    }
    return {
      name: product.name,
      description: product.description,
      context: product.context,
      benefits: product.benefits,
      faqs: product.faqs,
      marketingTexts: product.marketingTexts,
      imageUrls: product.imageUrls,
      videoUrls: product.videoUrls,
    }
  }
}
