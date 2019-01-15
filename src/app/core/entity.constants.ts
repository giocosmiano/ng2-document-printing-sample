import * as _ from "lodash";

export const EMPTY_VALUE = "Empty";
export const DOCUMENTS_RETRIEVED_MODEL_ENTITY = "documentModel";
export const DOCUMENT_MODEL_ENTITY = "documentModel";
export const PRINT_JOB_MODEL_ENTITY = "printJobModel";

export const DEFAULT_LANDING_PAGE = "/docketlist";
export const DOCKET_DETAIL_PAGE = "/docket-detail";
export const ADMIN_PAGE = "/admin";
export const REPORTS_PAGE = "/reports";
export const METRICS_PAGE = "/metrics";

export const ACTION_CREATE = "Create";
export const ACTION_UPDATE = "Update";
export const ACTION_DELETE = "Delete";
export const ACTION_DISPLAY = "Display";


export const useEntityPathAsUUID = (entityProperty: any): void => {
  let uuid: string = "", path: string = "";
  if (entityProperty) {
    if (Array.isArray(entityProperty)) {
      if (entityProperty.length > 0) {
        _.forEach(entityProperty, (value) => {
          useEntityPathAsUUID(value);
        });
      }
    } else if (_.isObject(entityProperty) && !_.isEmpty(entityProperty)) {
      path = entityProperty["path"];
      uuid = entityProperty["uuid"];
      if (!_.isEmpty(path) && !_.isEmpty(uuid)) {
        uuid = convertNonAlphaOnEntityPath(path);
        entityProperty["uuid"] = uuid;
      }

      _.forEach(entityProperty, (value) => {
        useEntityPathAsUUID(value);
      });

    }
  }
};

export const convertNonAlphaOnEntityPath = (entityPath: any): any => {
  let ignoreConversion: boolean = false,
    convertedEntityPath: string = "",
    convertedEntityPaths: Array<string> = [];

  if (entityPath) {
    if (Array.isArray(entityPath)) {

      [...entityPath].forEach(path => {

        // make sure we're converting literal Strings and not objects
        if (_.isString(path)) {
          convertedEntityPath = convertNonAlphaOnEntityPath(path);
          if (!_.isEmpty(convertedEntityPath)) {
            convertedEntityPaths.push(convertedEntityPath);
          }

          // ignore the conversion if NOT string literals such as objects
        } else {
          ignoreConversion = true;
        }
      });

      if (ignoreConversion) {
        return entityPath;

      } else {
        return convertedEntityPaths;
      }

    } else if (_.isString(entityPath) && !_.isEmpty(entityPath)) {
      convertedEntityPath = entityPath.replace(/http:\//g, "").replace(/[\W_]+/g, "_");

      if (_.startsWith(convertedEntityPath, "_")) {
        convertedEntityPath = convertedEntityPath.substring(1);
      }
    }
  }

  return convertedEntityPath;
};
