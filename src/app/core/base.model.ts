export interface BaseEntity {
    uuid:string;
    id:string;
    isDeleted:boolean;
    isParserDeleted:boolean;
    isDeleting:boolean;
    isCreating:boolean;
    isFailed:boolean;
    isParserOnly:boolean;
}
/**
 * Converts an object into an array. Uses the result array from normalizr if its there
 * Otherwise just turns it into an array in order
 *
 * @param objectToConvert The object to convert to an array
 * @returns {Array}
 */
export const convertObjectToArray = (objectToConvert) => {
    if (objectToConvert && objectToConvert.result) {
       delete objectToConvert.result;
    }

    // TODO: Review as Brad commented these statements updating the appStore related to proceedingChainItems
    // if (objectToConvert && objectToConvert.result) {
    //     if (!Array.isArray(objectToConvert.result)) {
    //         //Framework create scenario
    //         objectToConvert.result = [objectToConvert.result];
    //     }
    //     return objectToConvert.result.reduce(
    //         (arr, id) => {
    //             arr.push(objectToConvert[id]);
    //             return arr;
    //         },
    //         []);
    // } else
    // if (objectToConvert) {
        //handle objects that don't have a results array
        //be careful as object order isn't guaranteed, though for the most part is
        let output = [];
        for (let object in objectToConvert) {
            if (objectToConvert.hasOwnProperty(object)) {
                output.push(objectToConvert[object]);
            }
        }
        return output;
    // TODO: Review as Brad commented these statements updating the appStore related to proceedingChainItems
    // } else {
    //    return [];
    // }
};

/**
 * Converts an array of BaseEntities to an object array where the id is the key
 * @param arrayToConvert
 * @return {[key:string]:T} Id-> Object map
 */
export const convertArrayToObject = <T extends BaseEntity>(arrayToConvert:Array<T>):{[key:string]:T} => {
    return arrayToConvert.reduce(
        (map, obj) => {
            map[obj.id] = obj;
            return map;
        },
        <{[key:string]:T}>{});
};
