'use strict';

/**
 * comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comment.comment', ({ strapi }) => ({
  // Custom create method to handle comment creation with moderation
  async create(ctx) {
    // Get client IP for spam prevention
    const ipAddress = ctx.request.ip;
    
    // Add IP address to the request body
    ctx.request.body.data = {
      ...ctx.request.body.data,
      ipAddress,
      approved: false, // All comments start as unapproved
    };

    const response = await super.create(ctx);
    return response;
  },
}));
