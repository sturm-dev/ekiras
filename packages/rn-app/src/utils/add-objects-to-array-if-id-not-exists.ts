export const addObjectsToArrayIfIdNotExists = (
  baseArray: any[],
  objects: any[],
  field: string = 'id',
): any[] => {
  objects.forEach(obj1 => {
    if (!baseArray.find(obj2 => obj2[field] === obj1[field])) {
      baseArray.push(obj1);
    }
  });

  return baseArray;
};
