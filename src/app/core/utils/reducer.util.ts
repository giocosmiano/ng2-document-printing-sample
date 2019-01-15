import * as _ from "lodash";

/**
 * Merges arrays in a more sensible manner than Object.assign does by default.
 *
 * Rules:
 * If the objectValue is an array and the source value is not an array
 *      If the sourceValue is a string
 *          Add it to the array if it doesn't exist already and deleteIfFound is false (create scenario)
 *          Delete it from the array if it does exist and deleteIfFound is true (delete scenario)
 *          Otherwise there is no changes to be made so just return the array (update scenario)
 *      If the sourceValue is an object
 *          Compare by id and follow the same rules as above for string case, except for the update scenario
 *          Update scenario we need to add in the latest version of sourceValue as the object itself might have changed
 * Else If the objectValueIsAnArray and the sourceIsAnArray and combineArraysIfFound is true
 *      Concat the arrays and remove duplicates
 * Else If the objectValueIsAnArray and sourceIsAnArray or the sourceIsAnArray and objectValue is undefined
 *      Take the value of the source array
 * Else If the sourceIsAnArray and objectValue is defined
 *      add object value to the source array if its not already in there and return
 *
 * NOTE: Functions are not handled so don't do that, thanks
 *
 * @param objectValue
 * @param sourceValue
 * @param deleteFromArrayIfFound
 * @returns {any}
 */
const mergeArrays = (objectValue, sourceValue, deleteFromArrayIfFound, combineArraysIfFound) => {
    // handle changes to the result array under startingState entity type, i.e. entities.frameworks.result
    let isObjectValueAnArray = Array.isArray(objectValue);
    let isSourceAnArray = Array.isArray(sourceValue);
    if (isObjectValueAnArray && !isSourceAnArray) {
        // State = array, payload = string or object
        let indexInArray;
        let typeOfSource = typeof sourceValue;
        if (typeOfSource === "object" && sourceValue) {
            // object, check by ids
            indexInArray = _.findIndex(objectValue, (o:any) => {
                return o.id === sourceValue.id;
            });
            if (indexInArray === -1) {
                // sourceValue is not in the array so add it to the end
                // create scenario
                return [...objectValue, sourceValue];
            } else if (deleteFromArrayIfFound) {
                // sourceValue is in the array
                // delete scenario
                return objectValue.filter(value => value.id !== sourceValue.id);
            } else {
                // sourceValue is in the array already, re-add it in case things changed in the object itself
                // update scenario
                return objectValue.slice(0, indexInArray).concat(
                    Object.assign({}, sourceValue),
                    objectValue.slice(indexInArray + 1));
            }
        } else if (sourceValue) {
            // it's a primitive
            indexInArray = objectValue.indexOf(sourceValue);
            if (indexInArray === -1) {
                // sourceValue is not in the array so add it to the end
                // create scenario
                return [...objectValue, sourceValue];
            } else if (deleteFromArrayIfFound) {
                // sourceValue is in the array
                // delete scenario
                return objectValue.filter(value => value !== sourceValue);
            } else {
                // sourceValue is in the array already so just return the original array
                // update scenario
                return objectValue;
            }
        }
    } else if (isObjectValueAnArray && isSourceAnArray && combineArraysIfFound) {
        let tempSet = new Set<any>([].concat(objectValue).concat(sourceValue));
        // NOTE: Something wrong with the es6-shim library, both Array.from(tempSet) and [...tempSet] should work but
        // don't
        return Array.from(tempSet.keys());
    } else if ((isObjectValueAnArray && isSourceAnArray) || (!objectValue && isSourceAnArray)) {
        // Both are arrays or objectValue is undefined and source is an array, return the new array
        return [...sourceValue];
    } else if (objectValue && isSourceAnArray) {
        // check if the object is in the source array
        if (sourceValue.indexOf(objectValue) === -1) {
            return [objectValue, ...sourceValue];
        } else {
            return [...sourceValue];
        }
    }
};

/**
 * Merges in source values to a target recursively
 * Similar to object assign but uses our custom array handling and handles deeply nested properties
 *
 * Walks the objects properties recursively
 *      If both target and source have the property
 *          Keep going down a object until they don't
 *          Stop only when:
 *              They are primitives
 *              The mergeArrays method modified them
 *              There is no overlap
 *      If not then:
 *          Use Object assign to copy over the sources property
 *          Just reference it if it is a primitive
 *
 * @param target
 * @param source
 * @param deleteFromArrayIfFound
 * @param combineArraysIfFound
 * @returns {any}
 */
const mergeInSource = (target, source, deleteFromArrayIfFound, combineArraysIfFound) => {
    for (let prop in source) {
        if (prop in target) {
            // Property exists in both source and target
            // keep going down if it's an object
            let mergedProp = mergeArrays(target[prop], source[prop], deleteFromArrayIfFound, combineArraysIfFound);
            if (mergedProp) {
                // array
                target[prop] = mergedProp;
            } else if (source[prop] && typeof source[prop] === "object") {
                if (Object.keys(source[prop]).length === 0) {
                    target[prop] = {};
                } else {
                    // object
                    target[prop] = mergeInSource(
                        Object.assign({}, target[prop]),
                        source[prop],
                        deleteFromArrayIfFound,
                        combineArraysIfFound);
                }
            } else {
                // primitive, just assign it
                target[prop] = source[prop];
            }
        } else if (Array.isArray(source[prop])) {
            // array
            target[prop] = Object.assign([], source[prop]);
        } else if (source[prop] && typeof source[prop] === "object") {
            // object
            target[prop] = Object.assign({}, source[prop]);
        } else {
            // primitive, just assign it
            target[prop] = source[prop];
        }
    }
    return target;
};

/**
 * A deeper object assign that handles arrays like we want it to.
 *
 * Object assign doesn't go deep, only does the first level
 *
 * For example given the following:
 * ```
 *  let store = {a:"1", b:"2", c: {nestedProp:"nested", d: {nestedProps:"nested2"}}};
 *  let payload = {a: "3", c: {nestedProp:"nested-new"}};
 *  let newStore = Object.assign({}, a, b);
 * ```
 * newStore will be: `{a:"3", b:"2", c: {nestedProp:"nested-new"}}`
 * the d property under c gets dropped
 *
 * @param target The object to assign into
 * @param deleteFromArrayIfFound Whether to delete from the array if a match is found
 * @param sources The sources to merge into the target
 * @returns {any} The target object after things have been assigned into it
 */
export const deepObjectAssign = (target, deleteFromArrayIfFound, combineArraysIfFound, ...sources) => {
    sources.forEach((source) => {
        mergeInSource(target, source, deleteFromArrayIfFound, combineArraysIfFound);
    });
    return target;
};
