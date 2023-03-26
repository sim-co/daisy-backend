const asyncWrapper = (asyncFn) => {
  return (req, res, next) => {
    const f = asyncFn(req, res, next);
    f.catch(next);
  };
};

export default asyncWrapper;
