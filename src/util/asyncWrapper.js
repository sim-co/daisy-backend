const asyncWrapper = (asyncFn) => {
  return (req, res, next) => {
    const f = asyncFn(req, res, next);
    console.log("gd")
    f.catch(next);
  };
};

export default asyncWrapper;
