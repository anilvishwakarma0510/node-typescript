export const searchUserQuery = (req: any) => {
    const query: any = {};
    if (req.gender) {
      query.gender = req.gender;
    }
  
    if (req.keywords) {
      const regex = new RegExp(req.keywords, 'i');
      query.$or = [
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { email: { $regex: regex } },
        { gender: { $regex: regex } }
      ];
    }
    return query;
  };