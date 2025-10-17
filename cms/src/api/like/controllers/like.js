'use strict';

/**
 * like controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::like.like', ({ strapi }) => ({
  // Custom create method to handle like creation
  async create(ctx) {
    const { sessionId, blog_post } = ctx.request.body.data;
    
    // Check if this session already liked this post
    const existingLike = await strapi.db.query('api::like.like').findOne({
      where: {
        sessionId,
        blog_post,
      },
    });

    if (existingLike) {
      return ctx.badRequest('You have already liked this post');
    }

    // Get client IP
    const ipAddress = ctx.request.ip;
    
    // Add IP address to the request body
    ctx.request.body.data = {
      ...ctx.request.body.data,
      ipAddress,
    };

    const response = await super.create(ctx);
    return response;
  },

  // Custom delete method to unlike a post
  async delete(ctx) {
    const { id } = ctx.params;
    const { sessionId } = ctx.request.query;

    // Verify the session owns this like
    const like = await strapi.db.query('api::like.like').findOne({
      where: {
        id,
        sessionId,
      },
    });

    if (!like) {
      return ctx.notFound('Like not found or you do not have permission to delete it');
    }

    const response = await super.delete(ctx);
    return response;
  },
}));
