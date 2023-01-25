export const filterFields = (requestBody: any, ...allowedFields: string[]) => {
    const newObject = {};
  
    Object.keys(requestBody).forEach((key) => {
      if (allowedFields.includes(key)) {
        newObject[key] = requestBody[key];
      }
    });
  
    return newObject;
  };
  