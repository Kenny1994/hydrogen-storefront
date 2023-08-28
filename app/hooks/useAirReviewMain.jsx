import {useEffect} from 'react';

import loadScript from '~/helpers/loadScript';

// @feedback - This hook could be replaced by remix-utils's ow hook should we want to go down this route.
export function useAirReviewMain({product, analytics}) {
  useEffect(() => {
    try {
      window.AIR_REVIEWS = window.AIR_REVIEWS || {};
      window.AIR_REVIEWS.template = analytics.pageType;
      window.AIR_REVIEWS.product = {
        ...product,
        id: parseInt(product.id.replace('gid://shopify/Product/', '')),
        selectedVariant: product.selectedVariant,
        variants: product.variants.nodes.map((variant) => {
          return {
            ...variant,
            price: variant.price.amount,
            id: parseInt(
              variant.id.replace('gid://shopify/ProductVariant/', ''),
            ),
          };
        }),
        type: product.productType,
        images: product.selectedVariant?.image?.url
          ? [product.selectedVariant.image.url]
          : [],
        media: product.selectedVariant?.image?.url
          ? [{src: product.selectedVariant.image.url}]
          : [],
      };
      loadScript({
        id: 'air-review-script',
        url: `https://cdn.shopify.com/extensions/505ce933-6eff-47ee-a32f-dee5ae134593/0.0.0/assets/air-reviews-main.min.js?v=${new Date().getTime()}`,
        //   url: `https://localhost:3000/scripttag/air-reviews-main.min.js`,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Cannot initialize Avada Air Review', e);
    }
  }, []);
}