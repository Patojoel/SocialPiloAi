import type { ProductFormValues } from '../validation/productSchema'
import type { SaveProductPayload } from '../../gateway/ProductGateway'

export class ProductCommandFactory {
  static buildCommand(values: ProductFormValues): SaveProductPayload {
    return {
      name: values.name,
      description: values.description,
      context: values.context,
      benefits: values.benefits,
      faqs: values.faqs,
      marketingTexts: values.marketingTexts,
      imageUrls: values.imageUrls,
      videoUrls: values.videoUrls,
    }
  }
}
