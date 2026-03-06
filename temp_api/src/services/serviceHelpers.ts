import logger from "../utils/logger";
import { ServiceResponseWithPayload } from "./types";

export const generateResponseData = <R>(data: R): ServiceResponseWithPayload<R> => {
  return {
    error: true,
    code: 500,
    payload: data
  };
};

/** 
 * extract the dataValues property of any Sequelize Model that a service function would need
 * @param bindings 
 * @param entity 
 * @returns 
 */
export async function extractSingleDataValuesFrom(entity: any, bindings: any): Promise<any> {
  const record = await entity.findOne(bindings);
  if (record?.dataValues) {
    return record.dataValues;
  }

  return null;
}

export async function extractGroupDataValuesFrom(entity: any, bindings: any): Promise<any> {
  const records = await entity.findAll(bindings);

  if (records?.length) {
    return records.map((r: any) => r.dataValues)
  }

  return null;
}

/**
 * Processes incoming image data and returns a standardized format for storage.
 * Handles:
 * - External URLs (http/https) - returns as-is
 * - Data URLs (data:image/...) - normalizes and validates format
 * - Plain base64 strings - wraps in data URL format
 * 
 * @param img - Image data (URL string, data URL string, or base64 string)
 * @returns Formatted image string ready for database storage, or null if no image provided
 */
export function processIncomingImage(img?: any): string | null {
  if (!img || typeof img !== "string") {
    logger.info('processIncomingImage: received non-string or mpty image data', { type: typeof img });
    return null;
  }

  if (typeof img == 'string') {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      // External URL - return as-is
      logger.info('processIncomingImage: External URL detected', { url: img });
      return img;
    } else if (img.startsWith('data:image')) {
      // Data URL format - normalize and validate
      const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
      try {
        // Validate base64 by attempting to decode
        const buffer = Buffer.from(base64Data, 'base64');
        const base64String = buffer.toString('base64');
        const normalized = `data:image/png;base64,${base64String}`;
        logger.info('processIncomingImage: Normalized data URL', { originalLength: img.length, normalizedLength: normalized.length });
        return normalized;
      } catch (error) {
        logger.error('processIncomingImage: Invalid base64 data in data URL', { error });
        return null;
      }
    }
  }

  return null;
}

/**
 * Processes outgoing image data from db to prepare for front
 * It will be either:
 * - Standard URLs (http/https) - returns as-is
 * - Data URLs (data:image/...) - change to base64 string
 * 
 * @param img - Image data (URL string, data URL string, or base64 string)
 * @returns Base64 image string ready for client
 */
export function processOutgoingImage(img?: any): string | null {
  logger.info('processOutgoingImage: External URL detected', { url: img });
  if (typeof img == 'string') {
    // External URL - return as-is
    return img;
  } else {
    // Plain base64 string (legacy format) - wrap in data URL format
    try {
      // Validate base64 by attempting to decode
      const buffer = Buffer.from(img, 'base64');
      const base64String = buffer.toString('base64');
      const wrapped = `data:image/png;base64,${base64String}`;
      logger.info('processOutgoingImage: Wrapped plain base64 in data URL format');
      return wrapped;
    } catch (error) {
      logger.error('processOutgoingImage: Invalid base64 string', { error });
      return null;
    }
  }
}