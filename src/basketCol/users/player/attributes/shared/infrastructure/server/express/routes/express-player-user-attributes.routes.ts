import { Router } from 'express';

import { ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController } from '../controllers/ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController.ts';
import { bulkCreatePlayerUserAttributesFromExcelPOSTController } from '../../../dependency-injection';

const register = (router: Router) => {
  const pathPrefix: string = '/users/players';

  // Endpoint - Create player user attributes
  router.post(
    `${pathPrefix}/attributes/bulk-upload/excel`,
    (bulkCreatePlayerUserAttributesFromExcelPOSTController as ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreatePlayerUserAttributesFromExcelPOSTController.run.bind(bulkCreatePlayerUserAttributesFromExcelPOSTController),
  );
};

export default register;
