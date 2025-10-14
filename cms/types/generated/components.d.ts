import type { Schema, Struct } from "@strapi/strapi";

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: "components_shared_images";
  info: {
    description: "Image component with URL and alt text";
    displayName: "Image";
  };
  attributes: {
    alt: Schema.Attribute.String;
    url: Schema.Attribute.Media<"images">;
  };
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "shared.image": SharedImage;
    }
  }
}
