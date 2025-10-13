const home = (req, res) => {
  res.render("home", {
    title: "MACUA | Concesionario Oficial Renault (Demo)",
  });
};

module.exports = { home };
