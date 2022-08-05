export const addArrayOfObjectsToArrayIfIdNotExists = (
  baseArray: any[],
  objects: any[],
): any[] => {
  objects.forEach(obj1 => {
    if (!baseArray.find(obj2 => obj2.id === obj1.id)) {
      baseArray.push(obj1);
    }
  });

  return baseArray;
};
