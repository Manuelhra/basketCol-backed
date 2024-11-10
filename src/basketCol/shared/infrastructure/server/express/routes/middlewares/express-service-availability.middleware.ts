import { HttpStatus } from '@basketcol/domain';
import { NextFunction, Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../application/http/ports/IHttpResponseHandler';

interface ServiceAvailabilityConfig {
  isEnabled: boolean;
  serviceName: string;
  maintenanceEndTime?: Date;
  customMessage?: string;
}

export const expressServiceAvailabilityMiddleware = (
  serviceConfig: ServiceAvailabilityConfig,
  httpResponseHandler: IHttpResponseHandler,
) => (request: Request, response: Response, next: NextFunction): void => {
  if (!serviceConfig.isEnabled) {
    const maintenanceEndTimeMessage = serviceConfig.maintenanceEndTime
      ? `Service is expected to be available after ${serviceConfig.maintenanceEndTime.toISOString()}.`
      : 'Maintenance end time is not specified.';

    const defaultMessage = `The ${serviceConfig.serviceName} service is currently unavailable due to maintenance.`;

    const errorResponse = httpResponseHandler.handleSingleErrorResponse({
      code: HttpStatus.SERVICE_UNAVAILABLE,
      message: serviceConfig.customMessage || defaultMessage,
      error: {
        name: 'ServiceUnavailableError',
        details: `${defaultMessage} ${maintenanceEndTimeMessage} Please try again later.`,
      },
    });

    // Agregar headers de mantenimiento si existe tiempo estimado
    if (serviceConfig.maintenanceEndTime) {
      response.setHeader('Retry-After', Math.ceil((serviceConfig.maintenanceEndTime.getTime() - Date.now()) / 1000).toString());
    }

    response
      .status(HttpStatus.SERVICE_UNAVAILABLE)
      .json(errorResponse);
    return;
  }

  next();
};
